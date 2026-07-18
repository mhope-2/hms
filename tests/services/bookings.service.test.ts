import BookingsService from '../../src/services/bookings.service';
import BookingNotFoundException from '../../src/exceptions/bookings/BookingNotFoundException';
import RoomNotFoundException from '../../src/exceptions/room/RoomNotFoundException';

const sampleRoom = { _id: 'room1', roomNumber: '101', price: 250 };
const bookingBody = {
  roomId: 'room1',
  userPhone: '+233000000',
  userEmail: 'guest@example.com',
  userFullName: 'Guest One',
  numberOfPeople: 2,
  startDate: '2026-08-01',
  endDate: '2026-08-05',
};

function mockBookingsRepo() {
  return {
    findAllWithRooms: jest.fn(),
    findByIdWithRooms: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
  };
}

describe('BookingsService', () => {
  let bookingsRepo: ReturnType<typeof mockBookingsRepo>;
  let roomsRepo: { findById: jest.Mock };
  let emailService: { send: jest.Mock };
  let service: BookingsService;

  beforeEach(() => {
    bookingsRepo = mockBookingsRepo();
    roomsRepo = { findById: jest.fn() };
    emailService = { send: jest.fn().mockResolvedValue(undefined) };
    service = new BookingsService(bookingsRepo as any, roomsRepo as any, emailService as any);
  });

  describe('createBooking', () => {
    it('throws RoomNotFoundException when the room does not exist', async () => {
      roomsRepo.findById.mockResolvedValue(null);
      await expect(service.createBooking(bookingBody as any)).rejects.toBeInstanceOf(RoomNotFoundException);
      expect(bookingsRepo.create).not.toHaveBeenCalled();
    });

    it('saves the booking with a generated code and the room price as cost', async () => {
      roomsRepo.findById.mockResolvedValue(sampleRoom);
      bookingsRepo.create.mockImplementation(async (data: any) => ({ _id: 'b1', ...data }));
      const booking = await service.createBooking(bookingBody as any);
      expect(booking.bookingCode).toMatch(/^BK\d{6}$/);
      expect(booking.cost).toBe(250);
      expect(bookingsRepo.create).toHaveBeenCalledWith(expect.objectContaining({ roomId: 'room1', cost: 250 }));
    });

    it('sends a confirmation email to the booking user', async () => {
      roomsRepo.findById.mockResolvedValue(sampleRoom);
      bookingsRepo.create.mockImplementation(async (data: any) => ({ _id: 'b1', ...data }));
      await service.createBooking(bookingBody as any);
      expect(emailService.send).toHaveBeenCalledWith(expect.objectContaining({
        recipientEmail: 'guest@example.com',
        subject: 'INT HOTEL BOOKING DETAILS',
      }));
    });

    it('still returns the booking when the email fails', async () => {
      roomsRepo.findById.mockResolvedValue(sampleRoom);
      bookingsRepo.create.mockImplementation(async (data: any) => ({ _id: 'b1', ...data }));
      emailService.send.mockRejectedValue(new Error('SMTP down'));
      await expect(service.createBooking(bookingBody as any)).resolves.toMatchObject({ _id: 'b1' });
    });
  });

  it('listBookings returns populated bookings', async () => {
    bookingsRepo.findAllWithRooms.mockResolvedValue([{ _id: 'b1' }]);
    await expect(service.listBookings()).resolves.toEqual([{ _id: 'b1' }]);
  });

  it('getBookingById throws BookingNotFoundException when missing', async () => {
    bookingsRepo.findByIdWithRooms.mockResolvedValue(null);
    await expect(service.getBookingById('nope')).rejects.toBeInstanceOf(BookingNotFoundException);
  });

  it('updateBooking throws BookingNotFoundException when missing', async () => {
    bookingsRepo.updateById.mockResolvedValue(null);
    await expect(service.updateBooking('nope', {} as any)).rejects.toBeInstanceOf(BookingNotFoundException);
  });

  it('approveBooking sets status approved with an approval timestamp', async () => {
    bookingsRepo.updateById.mockResolvedValue({ _id: 'b1', status: 'approved' });
    await service.approveBooking('b1');
    expect(bookingsRepo.updateById).toHaveBeenCalledWith('b1', expect.objectContaining({
      status: 'approved',
      approved_at: expect.any(Date),
    }));
  });

  it('approveBooking throws BookingNotFoundException when missing', async () => {
    bookingsRepo.updateById.mockResolvedValue(null);
    await expect(service.approveBooking('nope')).rejects.toBeInstanceOf(BookingNotFoundException);
  });

  it('declineBooking sets status declined', async () => {
    bookingsRepo.updateById.mockResolvedValue({ _id: 'b1', status: 'declined' });
    await service.declineBooking('b1');
    expect(bookingsRepo.updateById).toHaveBeenCalledWith('b1', { status: 'declined' });
  });
});
