import TokenService from '../../src/services/token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.JWT_EXPIRES = '3600';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_REFRESH_EXPIRES = '7200';
    service = new TokenService();
  });

  it('createAccessToken returns a signed token and numeric expiresIn', () => {
    const tokenData = service.createAccessToken({ _id: 'user-1' });
    expect(typeof tokenData.token).toBe('string');
    expect(tokenData.token.length).toBeGreaterThan(0);
    expect(tokenData.expiresIn).toBe(3600);
  });

  it('createAccessToken defaults expiresIn to 3600 when JWT_EXPIRES is unset', () => {
    delete process.env.JWT_EXPIRES;
    expect(service.createAccessToken({ _id: 'user-1' }).expiresIn).toBe(3600);
  });

  it('createRefreshToken uses the refresh expiry', () => {
    const tokenData = service.createRefreshToken({ _id: 'user-2' });
    expect(tokenData.expiresIn).toBe(7200);
    expect(typeof tokenData.token).toBe('string');
  });

  it('createRefreshToken defaults expiresIn to 3600 when JWT_REFRESH_EXPIRES is unset', () => {
    delete process.env.JWT_REFRESH_EXPIRES;
    expect(service.createRefreshToken({ _id: 'user-2' }).expiresIn).toBe(3600);
  });

  it('buildAuthCookie formats the Authorization cookie', () => {
    const cookie = service.buildAuthCookie({ expiresIn: 3600, token: 'abc.def.ghi' });
    expect(cookie).toBe('Authorization=abc.def.ghi; HttpOnly; Max-Age=3600');
  });
});
