import express from 'express';
import request from 'supertest';
import AuthenticationController from '../../src/controllers/authentication.controller';
import InvalidCredentialsException from '../../src/exceptions/auth/InvalidCredentialsException';
import PasswordMismatchException from '../../src/exceptions/auth/PasswordMismatchException';

const mockService = {
  listUsers: jest.fn(),
  getUserById: jest.fn(),
  register: jest.fn(),
  login: jest.fn(),
};

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', new AuthenticationController(mockService as any).router);
  app.use((err: any, _req: any, res: any, _next: any) => {
    res.status(err.status || 500).json({ status: err.status || 500, message: err.message });
  });
  return app;
}

const app = buildApp();

const registerBody = {
  firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '+233000000',
  username: 'ab', password: 'secret1', password2: 'secret1',
};

describe('Authentication routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /api/auth/users returns 200 with users', async () => {
    mockService.listUsers.mockResolvedValue([{ _id: 'u1', username: 'ab' }]);
    const res = await request(app).get('/api/auth/users');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ _id: 'u1', username: 'ab' }]);
  });

  it('POST /api/auth/user/register sets the auth cookie via Set-Cookie and returns 200', async () => {
    mockService.register.mockResolvedValue({
      user: { _id: 'u1', username: 'ab', password: '' },
      cookie: 'Authorization=jwt-token; HttpOnly; Max-Age=3600',
    });
    const res = await request(app).post('/api/auth/user/register').send(registerBody);
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'][0]).toContain('Authorization=jwt-token');
    expect(res.body.response).toContain('ab');
  });

  it('POST /api/auth/user/register returns 401 on password mismatch', async () => {
    mockService.register.mockRejectedValue(new PasswordMismatchException());
    const res = await request(app).post('/api/auth/user/register').send({ ...registerBody, password2: 'x' });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/user/login returns the user and sets the auth cookie', async () => {
    mockService.login.mockResolvedValue({
      user: { _id: 'u1', username: 'ab', password: '' },
      cookie: 'Authorization=jwt-token; HttpOnly; Max-Age=3600',
    });
    const res = await request(app).post('/api/auth/user/login').send({ username: 'ab', password: 'secret1' });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'][0]).toContain('Authorization=jwt-token');
    expect(res.body.username).toBe('ab');
  });

  it('POST /api/auth/user/login returns 401 for bad credentials', async () => {
    mockService.login.mockRejectedValue(new InvalidCredentialsException());
    const res = await request(app).post('/api/auth/user/login').send({ username: 'ab', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/user/logout clears the Authorization cookie', async () => {
    const res = await request(app).post('/api/auth/user/logout');
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'][0]).toContain('Authorization=;Max-age=0');
  });
});
