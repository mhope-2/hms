// Prevent real DB connections - we only test the controller's pure helper methods
jest.mock('../../src/models/user.model', () => ({
  __esModule: true,
  default: { findOne: jest.fn(), findById: jest.fn(), create: jest.fn() },
}));

import AuthenticationController from '../../src/controllers/authentication.controller';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  beforeAll(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_EXPIRES = '3600';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_REFRESH_EXPIRES = '7200';
    controller = new AuthenticationController();
  });

  describe('createToken', () => {
    it('returns a token string and numeric expiresIn', () => {
      const tokenData = controller.createToken({ _id: 'user-1' });
      expect(typeof tokenData.token).toBe('string');
      expect(tokenData.token.length).toBeGreaterThan(0);
      expect(tokenData.expiresIn).toBe(3600);
    });

    it('defaults expiresIn to 3600 when JWT_EXPIRES is unset', () => {
      delete process.env.JWT_EXPIRES;
      const tokenData = controller.createToken({ _id: 'user-1' });
      expect(tokenData.expiresIn).toBe(3600);
      process.env.JWT_EXPIRES = '3600';
    });
  });

  describe('refreshToken', () => {
    it('returns a refresh token string and numeric expiresIn', () => {
      const tokenData = controller.refreshToken({ _id: 'user-2' });
      expect(typeof tokenData.token).toBe('string');
      expect(tokenData.token.length).toBeGreaterThan(0);
      expect(tokenData.expiresIn).toBe(7200);
    });

    it('defaults expiresIn to 3600 when JWT_REFRESH_EXPIRES is unset', () => {
      delete process.env.JWT_REFRESH_EXPIRES;
      const tokenData = controller.refreshToken({ _id: 'user-2' });
      expect(tokenData.expiresIn).toBe(3600);
      process.env.JWT_REFRESH_EXPIRES = '7200';
    });
  });

  describe('setCookie', () => {
    it('formats the Authorization cookie correctly', () => {
      const cookie = controller.setCookie({ expiresIn: 3600, token: 'abc.def.ghi' });
      expect(cookie).toBe('Authorization=abc.def.ghi; HttpOnly; Max-Age=3600');
    });
  });
});
