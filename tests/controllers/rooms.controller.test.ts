// Bypass auth so protected routes can be tested without a real token
jest.mock('../../src/middleware/auth.middleware', () => ({
  __esModule: true,
  default: jest.fn((_req, _res, next) => next()),
}));

import express from 'express';
import request from 'supertest';
import RoomsController from '../../src/controllers/rooms.controller';
import RoomNotFoundException from '../../src/exceptions/room/RoomNotFoundException';

const mockService = {
  listAvailableRooms: jest.fn(),
  getRoomById: jest.fn(),
  addRoom: jest.fn(),
  updateRoom: jest.fn(),
  deleteRoom: jest.fn(),
};

function buildApp() {
  const app = express();
  app.use(express.json());
  const controller = new RoomsController(mockService as any);
  app.use('/api', controller.router);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
  });
  return app;
}

const app = buildApp();

const sampleRoom = { _id: 'r1', roomNumber: '101', floor: '1', resources: ['WiFi'], price: 100, status: 'available' };
const newRoomBody = { roomNumber: '201', floor: '2', resources: ['TV'], price: 150 };

describe('Rooms routes', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('GET /api/rooms', () => {
    it('returns 200 with list of available rooms', async () => {
      mockService.listAvailableRooms.mockResolvedValue([sampleRoom]);
      const res = await request(app).get('/api/rooms');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([sampleRoom]);
    });

    it('returns 500 on unexpected service error', async () => {
      mockService.listAvailableRooms.mockRejectedValue(new Error('DB error'));
      const res = await request(app).get('/api/rooms');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/rooms/:id', () => {
    it('returns 200 with the room when found', async () => {
      mockService.getRoomById.mockResolvedValue(sampleRoom);
      const res = await request(app).get('/api/rooms/r1');
      expect(res.status).toBe(200);
      expect(res.body).toEqual(sampleRoom);
    });

    it('returns 404 when the service throws RoomNotFoundException', async () => {
      mockService.getRoomById.mockRejectedValue(new RoomNotFoundException('unknown'));
      const res = await request(app).get('/api/rooms/unknown');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/rooms/add', () => {
    it('returns 200 and success message when room is saved', async () => {
      mockService.addRoom.mockResolvedValue({ ...sampleRoom, ...newRoomBody });
      const res = await request(app).post('/api/rooms/add').send(newRoomBody);
      expect(res.status).toBe(200);
      expect(res.body.Response).toContain('201');
      expect(mockService.addRoom).toHaveBeenCalledWith(expect.objectContaining(newRoomBody));
    });

    it('returns 500 when save fails unexpectedly', async () => {
      mockService.addRoom.mockRejectedValue(new Error('Save failed'));
      const res = await request(app).post('/api/rooms/add').send(newRoomBody);
      expect(res.status).toBe(500);
    });
  });

  describe('PATCH /api/rooms/update/:id', () => {
    it('returns 200 with success message when room is updated', async () => {
      mockService.updateRoom.mockResolvedValue(sampleRoom);
      const res = await request(app).patch('/api/rooms/update/r1').send({ price: 200 });
      expect(res.status).toBe(200);
      expect(res.body.Response).toContain('r1');
    });

    it('returns 404 when room is not found', async () => {
      mockService.updateRoom.mockRejectedValue(new RoomNotFoundException('unknown'));
      const res = await request(app).patch('/api/rooms/update/unknown').send({ price: 200 });
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/rooms/delete/:id', () => {
    it('returns 200 with success message when room is deleted', async () => {
      mockService.deleteRoom.mockResolvedValue(sampleRoom);
      const res = await request(app).delete('/api/rooms/delete/r1');
      expect(res.status).toBe(200);
      expect(res.body.Response).toContain('r1');
    });

    it('returns 404 when room is not found', async () => {
      mockService.deleteRoom.mockRejectedValue(new RoomNotFoundException('unknown'));
      const res = await request(app).delete('/api/rooms/delete/unknown');
      expect(res.status).toBe(404);
    });
  });
});
