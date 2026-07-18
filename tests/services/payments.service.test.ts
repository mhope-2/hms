import PaymentsService from '../../src/services/payments.service';
import PaymentNotFoundException from '../../src/exceptions/payments/PaymentNotFoundException';
import BookingAlreadyPaidException from '../../src/exceptions/payments/BookingAlreadyPaidException';
import BookingNotFoundException from '../../src/exceptions/bookings/BookingNotFoundException';

const sampleBooking = { _id: 'b1', bookingCode: 'BK123456', cost: 250 };
const paymentBody = { bookingId: 'b1', method: 'momo', transactionRef: 'MM-001' };

function mockPaymentsRepo() {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    findCompletedByBookingId: jest.fn().mockResolvedValue(null),
  };
}

describe('PaymentsService', () => {
  let payments: ReturnType<typeof mockPaymentsRepo>;
  let bookings: { findById: jest.Mock };
  let service: PaymentsService;

  beforeEach(() => {
    payments = mockPaymentsRepo();
    bookings = { findById: jest.fn().mockResolvedValue(sampleBooking) };
    service = new PaymentsService(payments as any, bookings as any);
  });

  describe('createPayment', () => {
    it('throws BookingNotFoundException when the booking does not exist', async () => {
      bookings.findById.mockResolvedValue(null);
      await expect(service.createPayment(paymentBody as any)).rejects.toBeInstanceOf(BookingNotFoundException);
      expect(payments.create).not.toHaveBeenCalled();
    });

    it('throws BookingAlreadyPaidException when a completed payment exists', async () => {
      payments.findCompletedByBookingId.mockResolvedValue({ _id: 'p0', status: 'completed' });
      await expect(service.createPayment(paymentBody as any)).rejects.toBeInstanceOf(BookingAlreadyPaidException);
      expect(payments.create).not.toHaveBeenCalled();
    });

    it('records the payment with the booking cost as amount, ignoring any client amount', async () => {
      payments.create.mockImplementation(async (data: any) => ({ _id: 'p1', ...data }));
      const payment = await service.createPayment({ ...paymentBody, amount: 1 } as any);
      expect(payment.amount).toBe(250);
      expect(payments.create).toHaveBeenCalledWith(expect.objectContaining({
        bookingId: 'b1',
        amount: 250,
        method: 'momo',
        status: 'completed',
        transactionRef: 'MM-001',
      }));
    });
  });

  it('listPayments returns all payments', async () => {
    payments.findAll.mockResolvedValue([{ _id: 'p1' }]);
    await expect(service.listPayments()).resolves.toEqual([{ _id: 'p1' }]);
  });

  it('getPaymentById throws PaymentNotFoundException when missing', async () => {
    payments.findById.mockResolvedValue(null);
    await expect(service.getPaymentById('nope')).rejects.toBeInstanceOf(PaymentNotFoundException);
  });
});
