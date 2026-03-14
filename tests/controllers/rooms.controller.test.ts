jest.mock('../../src/models/rooms.model', () => {
  const MockModel: any = jest.fn().mockImplementation(() => ({
    save: jest.fn(),
  }));
  MockModel.find = jest.fn();
  MockModel.findById = jest.fn();
  MockModel.findByIdAndUpdate = jest.fn();
  MockModel.findByIdAndDelete = jest.fn();
  return { __esModule: true, default: MockModel };
});

// Bypass auth so protected routes can be tested without a real token
jest.mock('../../src/middleware/auth.middleware', () => ({
  __esModule: true,
  default: jest.fn((_req, _res, next) => next()),
}));

import express from 'express';
import request from 'supertest';
import RoomsController from '../../src/controllers/rooms.controller';
import RoomsModel from '../../src/models/rooms.model';

const MockRoomsModel = RoomsModel as unknown as jest.MockedFunction<any> & {
  find: jest.Mock;
  findById: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
};

function buildApp() {
  const app = express();
  app.use(express.json());
  const controller = new RoomsController();
  app.use('/api', controller.router);
  // minimal error handler
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500).json({ status: err.status, message: err.message });
  });
  return app;
}

const app = buildApp();

const sampleRoom = { _id: 'r1', roomNumber: '101', floor: '1', resources: ['WiFi'], price: 100, status: 'available' };
const newRoomBody = { roomNumber: '201', floor: '2', resources: ['TV'], price: 150 };

describe('Rooms routes', () => {
  beforeEach(() => jest.clearAllMocks());

  // ── GET /api/rooms ──────────────────────────────────────────────────────────
  describe('GET /api/rooms', () => {
    it('returns 200 with list of available rooms', async () => {
      MockRoomsModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue([sampleRoom]) });
      const res = await request(app).get('/api/rooms');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([sampleRoom]);
    });

    it('returns 400 on database error', async () => {
      MockRoomsModel.find.mockReturnValue({ exec: jest.fn().mockRejectedValue(new Error('DB error')) });
      const res = await request(app).get('/api/rooms');
      expect(res.status).toBe(400);
    });
  });

  // ── GET /api/rooms/:id ──────────────────────────────────────────────────────
  describe('GET /api/rooms/:id', () => {
    it('returns 200 with the room when found', async () => {
      MockRoomsModel.findById.mockResolvedValue(sampleRoom);
      const res = await request(app).get('/api/rooms/r1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(sampleRoom);
    });

    it('returns 404 when room does not exist', async () => {
      MockRoomsModel.findById.mockResolvedValue(null);
      const res = await request(app).get('/api/rooms/unknown');
      expect(res.status).toBe(404);
    });
  });

  // ── POST /api/rooms/add ─────────────────────────────────────────────────────
  describe('POST /api/rooms/add', () => {
    it('returns 200 and success message when room is saved', async () => {
      const mockSave = jest.fn().mockResolvedValue(null);
      MockRoomsModel.mockImplementation(() => ({ save: mockSave }));
      const res = await request(app).post('/api/rooms/add').send(newRoomBody);
      expect(res.status).toBe(200);
      expect(res.body.Response).toContain('201');
    });

    it('returns 400 when save fails', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('Save failed'));
      MockRoomsModel.mockImplementation(() => ({ save: mockSave }));
      const res = await request(app).post('/api/rooms/add').send(newRoomBody);
      expect(res.status).toBe(400);
    });
  });

  // ── PATCH /api/rooms/update/:id ─────────────────────────────────────────────
  describe('PATCH /api/rooms/update/:id', () => {
    it('returns 200 with success message when room is updated', async () => {
      MockRoomsModel.findByIdAndUpdate.mockResolvedValue(sampleRoom);
      const res = await request(app).patch('/api/rooms/update/r1').send({ price: 200 });
      expect(res.status).toBe(200);
      expect(res.body.Response).toContain('r1');
    });

    it('returns 404 when room is not found', async () => {
      MockRoomsModel.findByIdAndUpdate.mockResolvedValue(null);
      const res = await request(app).patch('/api/rooms/update/unknown').send({ price: 200 });
      expect(res.status).toBe(404);
    });
  });

  // ── DELETE /api/rooms/delete/:id ────────────────────────────────────────────
  describe('DELETE /api/rooms/delete/:id', () => {
    it('returns 200 with success message when room is deleted', async () => {
      MockRoomsModel.findByIdAndDelete.mockResolvedValue(sampleRoom);
      const res = await request(app).delete('/api/rooms/delete/r1');
      expect(res.status).toBe(200);
      expect(res.body.Response).toContain('r1');
    });

    it('returns 404 when room is not found', async () => {
      MockRoomsModel.findByIdAndDelete.mockResolvedValue(null);
      const res = await request(app).delete('/api/rooms/delete/unknown');
      expect(res.status).toBe(404);
    });
  });
});
