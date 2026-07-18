jest.mock('../../src/middleware/auth.middleware', () => ({
  __esModule: true,
  default: jest.fn((_req, _res, next) => next()),
}));

import express from 'express';
import request from 'supertest';
import BookingsController from '../../src/controllers/bookings.controller';
import BookingNotFoundException from '../../src/exceptions/bookings/BookingNotFoundException';
import RoomNotFoundException from '../../src/exceptions/room/RoomNotFoundException';

const mockService = {
  listBookings: jest.fn(),
  getBookingById: jest.fn(),
  createBooking: jest.fn(),
  updateBooking: jest.fn(),
};

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', new BookingsController(mockService as any).router);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
  });
  return app;
}

const app = buildApp();

const bookingBody = {
  roomId: 'room1',
  userPhone: '+233000000',
  userEmail: 'guest@example.com',
  userFullName: 'Guest One',
  numberOfPeople: 2,
  startDate: '2026-08-01',
  endDate: '2026-08-05',
};

describe('Bookings routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /api/bookings returns 200 with bookings', async () => {
    mockService.listBookings.mockResolvedValue([{ _id: 'b1' }]);
    const res = await request(app).get('/api/bookings');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ _id: 'b1' }]);
  });

  it('GET /api/bookings/:id returns 404 when the booking is missing', async () => {
    mockService.getBookingById.mockRejectedValue(new BookingNotFoundException('nope'));
    const res = await request(app).get('/api/bookings/nope');
    expect(res.status).toBe(404);
  });

  it('POST /api/bookings/add returns 200 with the booking code', async () => {
    mockService.createBooking.mockResolvedValue({ _id: 'b1', bookingCode: 'BK123456' });
    const res = await request(app).post('/api/bookings/add').send(bookingBody);
    expect(res.status).toBe(200);
    expect(res.body.Response).toContain('BK123456');
  });

  it('POST /api/bookings/add returns 404 when the room does not exist', async () => {
    mockService.createBooking.mockRejectedValue(new RoomNotFoundException('room1'));
    const res = await request(app).post('/api/bookings/add').send(bookingBody);
    expect(res.status).toBe(404);
  });

  it('PATCH /api/bookings/update/:id returns 200 on success', async () => {
    mockService.updateBooking.mockResolvedValue({ _id: 'b1' });
    const res = await request(app).patch('/api/bookings/update/b1').send({ numberOfPeople: 3 });
    expect(res.status).toBe(200);
    expect(res.body.Response).toContain('b1');
  });

  it('PATCH /api/bookings/update/:id returns 404 when missing', async () => {
    mockService.updateBooking.mockRejectedValue(new BookingNotFoundException('nope'));
    const res = await request(app).patch('/api/bookings/update/nope').send({});
    expect(res.status).toBe(404);
  });
});
