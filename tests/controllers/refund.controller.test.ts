jest.mock('../../src/middleware/auth.middleware', () => ({
  __esModule: true,
  default: jest.fn((_req, _res, next) => next()),
}));

import express from 'express';
import request from 'supertest';
import RefundController from '../../src/controllers/refund.controller';
import RefundNotFoundException from '../../src/exceptions/refunds/RefundNotFoundException';
import RefundNotAllowedException from '../../src/exceptions/refunds/RefundNotAllowedException';

const mockService = {
  listRefunds: jest.fn(),
  getRefundById: jest.fn(),
  requestRefund: jest.fn(),
  approveRefund: jest.fn(),
  declineRefund: jest.fn(),
};

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', new RefundController(mockService as any).router);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
  });
  return app;
}

const app = buildApp();
const refundBody = { paymentId: 'p1', reason: 'Trip cancelled' };

describe('Refund routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /api/refunds returns 200 with refunds', async () => {
    mockService.listRefunds.mockResolvedValue([{ _id: 'r1' }]);
    const res = await request(app).get('/api/refunds');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ _id: 'r1' }]);
  });

  it('GET /api/refunds/:id returns 404 when missing', async () => {
    mockService.getRefundById.mockRejectedValue(new RefundNotFoundException('nope'));
    const res = await request(app).get('/api/refunds/nope');
    expect(res.status).toBe(404);
  });

  it('POST /api/refunds/request returns 200 with the refund id', async () => {
    mockService.requestRefund.mockResolvedValue({ _id: 'r1', ...refundBody, status: 'pending' });
    const res = await request(app).post('/api/refunds/request').send(refundBody);
    expect(res.status).toBe(200);
    expect(res.body.Response).toContain('r1');
    expect(mockService.requestRefund).toHaveBeenCalledWith(expect.objectContaining(refundBody));
  });

  it('POST /api/refunds/request returns 409 when not allowed', async () => {
    mockService.requestRefund.mockRejectedValue(new RefundNotAllowedException('already refunded'));
    const res = await request(app).post('/api/refunds/request').send(refundBody);
    expect(res.status).toBe(409);
  });

  it('POST /api/refunds/approve/:id returns 200 on success', async () => {
    mockService.approveRefund.mockResolvedValue({ _id: 'r1', status: 'approved' });
    const res = await request(app).post('/api/refunds/approve/r1');
    expect(res.status).toBe(200);
    expect(mockService.approveRefund).toHaveBeenCalledWith('r1');
  });

  it('POST /api/refunds/decline/:id returns 200 on success', async () => {
    mockService.declineRefund.mockResolvedValue({ _id: 'r1', status: 'declined' });
    const res = await request(app).post('/api/refunds/decline/r1');
    expect(res.status).toBe(200);
    expect(mockService.declineRefund).toHaveBeenCalledWith('r1');
  });
});
