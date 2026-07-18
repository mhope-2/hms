jest.mock('../../src/middleware/auth.middleware', () => ({
  __esModule: true,
  default: jest.fn((_req, _res, next) => next()),
}));

import express from 'express';
import request from 'supertest';
import PaymentsController from '../../src/controllers/payments.controller';
import PaymentNotFoundException from '../../src/exceptions/payments/PaymentNotFoundException';
import BookingAlreadyPaidException from '../../src/exceptions/payments/BookingAlreadyPaidException';

const mockService = { listPayments: jest.fn(), getPaymentById: jest.fn(), createPayment: jest.fn() };

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', new PaymentsController(mockService as any).router);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
  });
  return app;
}

const app = buildApp();
const paymentBody = { bookingId: 'b1', method: 'momo', transactionRef: 'MM-001' };

describe('Payments routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /api/payments returns 200 with payments', async () => {
    mockService.listPayments.mockResolvedValue([{ _id: 'p1' }]);
    const res = await request(app).get('/api/payments');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ _id: 'p1' }]);
  });

  it('GET /api/payments/:id returns 404 when missing', async () => {
    mockService.getPaymentById.mockRejectedValue(new PaymentNotFoundException('nope'));
    const res = await request(app).get('/api/payments/nope');
    expect(res.status).toBe(404);
  });

  it('POST /api/payments/add returns 200 with the payment', async () => {
    mockService.createPayment.mockResolvedValue({ _id: 'p1', ...paymentBody, amount: 250, status: 'completed' });
    const res = await request(app).post('/api/payments/add').send(paymentBody);
    expect(res.status).toBe(200);
    expect(res.body.Response).toContain('p1');
  });

  it('POST /api/payments/add returns 409 when the booking is already paid', async () => {
    mockService.createPayment.mockRejectedValue(new BookingAlreadyPaidException('b1'));
    const res = await request(app).post('/api/payments/add').send(paymentBody);
    expect(res.status).toBe(409);
  });

  it('POST /api/payments/add rejects an invalid method with 400 (validation middleware)', async () => {
    const res = await request(app).post('/api/payments/add').send({ ...paymentBody, method: 'bitcoin' });
    expect(res.status).toBe(400);
    expect(mockService.createPayment).not.toHaveBeenCalled();
  });
});
