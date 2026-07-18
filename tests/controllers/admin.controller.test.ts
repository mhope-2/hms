jest.mock('../../src/middleware/auth.middleware', () => ({
  __esModule: true,
  default: jest.fn((_req, _res, next) => next()),
}));

import express from 'express';
import request from 'supertest';
import AdminController from '../../src/controllers/admin.controller';
import BookingNotFoundException from '../../src/exceptions/bookings/BookingNotFoundException';

const mockService = { approveBooking: jest.fn(), declineBooking: jest.fn() };

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', new AdminController(mockService as any).router);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
  });
  return app;
}

const app = buildApp();

describe('Admin booking routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /api/bookings/approve/:id returns 200 on success', async () => {
    mockService.approveBooking.mockResolvedValue({ _id: 'b1', status: 'approved' });
    const res = await request(app).post('/api/bookings/approve/b1');
    expect(res.status).toBe(200);
    expect(mockService.approveBooking).toHaveBeenCalledWith('b1');
  });

  it('POST /api/bookings/approve/:id returns 404 for a missing booking', async () => {
    mockService.approveBooking.mockRejectedValue(new BookingNotFoundException('nope'));
    const res = await request(app).post('/api/bookings/approve/nope');
    expect(res.status).toBe(404);
  });

  it('POST /api/bookings/decline/:id returns 200 and echoes the reason', async () => {
    mockService.declineBooking.mockResolvedValue({ _id: 'b1', status: 'declined' });
    const res = await request(app).post('/api/bookings/decline/b1').send({ reasonForDecline: 'overbooked' });
    expect(res.status).toBe(200);
    expect(res.body.Response).toContain('overbooked');
  });

  it('POST /api/bookings/decline/:id returns 404 for a missing booking', async () => {
    mockService.declineBooking.mockRejectedValue(new BookingNotFoundException('nope'));
    const res = await request(app).post('/api/bookings/decline/nope');
    expect(res.status).toBe(404);
  });
});
