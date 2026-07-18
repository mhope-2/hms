jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';
import AuthenticationService from '../../src/services/authentication.service';
import PasswordMismatchException from '../../src/exceptions/auth/PasswordMismatchException';
import InvalidPasswordLengthException from '../../src/exceptions/auth/InvalidPasswordLengthException';
import UserWithThatEmailAlreadyExistsException from '../../src/exceptions/auth/UserWithThatEmailAlreadyExistsException';
import UserWithThatUsernameAlreadyExistsException from '../../src/exceptions/auth/UserWithThatUsernameAlreadyExistsException';
import InvalidCredentialsException from '../../src/exceptions/auth/InvalidCredentialsException';
import UserNotFoundException from '../../src/exceptions/auth/UserNotFoundException';

const registerBody = {
  firstName: 'A', lastName: 'B', email: 'a@b.com', phone: '+233000000',
  username: 'ab', password: 'secret1', password2: 'secret1',
};

function mockUsersRepo() {
  return {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn().mockResolvedValue(null),
    findByUsername: jest.fn().mockResolvedValue(null),
    findByUsernameWithPassword: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn().mockResolvedValue({}),
  };
}

const mockTokenService = {
  createRefreshToken: jest.fn().mockReturnValue({ token: 'jwt-token', expiresIn: 3600 }),
  buildAuthCookie: jest.fn().mockReturnValue('Authorization=jwt-token; HttpOnly; Max-Age=3600'),
};

describe('AuthenticationService', () => {
  let users: ReturnType<typeof mockUsersRepo>;
  let service: AuthenticationService;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTokenService.createRefreshToken.mockReturnValue({ token: 'jwt-token', expiresIn: 3600 });
    mockTokenService.buildAuthCookie.mockReturnValue('Authorization=jwt-token; HttpOnly; Max-Age=3600');
    users = mockUsersRepo();
    users.create.mockImplementation(async (data: any) => ({ _id: 'u1', ...data }));
    service = new AuthenticationService(users as any, mockTokenService as any);
  });

  describe('register', () => {
    it('rejects mismatched passwords WITHOUT creating the user', async () => {
      await expect(service.register({ ...registerBody, password2: 'different' } as any))
        .rejects.toBeInstanceOf(PasswordMismatchException);
      expect(users.create).not.toHaveBeenCalled();
    });

    it('rejects passwords shorter than 6 characters WITHOUT creating the user', async () => {
      await expect(service.register({ ...registerBody, password: 'abc', password2: 'abc' } as any))
        .rejects.toBeInstanceOf(InvalidPasswordLengthException);
      expect(users.create).not.toHaveBeenCalled();
    });

    it('rejects an already-registered email WITHOUT creating the user', async () => {
      users.findByEmail.mockResolvedValue({ _id: 'existing' });
      await expect(service.register(registerBody as any))
        .rejects.toBeInstanceOf(UserWithThatEmailAlreadyExistsException);
      expect(users.create).not.toHaveBeenCalled();
    });

    it('rejects an already-taken username WITHOUT creating the user', async () => {
      users.findByUsername.mockResolvedValue({ _id: 'existing' });
      await expect(service.register(registerBody as any))
        .rejects.toBeInstanceOf(UserWithThatUsernameAlreadyExistsException);
      expect(users.create).not.toHaveBeenCalled();
    });

    it('hashes the password and never returns it', async () => {
      const { user } = await service.register(registerBody as any);
      expect(bcrypt.hash).toHaveBeenCalledWith('secret1', 10);
      expect(users.create).toHaveBeenCalledWith(expect.objectContaining({ password: 'hashed-password' }));
      expect(user.password).toBe('');
    });

    it('issues a refresh-secret token (the one auth.middleware verifies) and returns the cookie', async () => {
      const { cookie } = await service.register(registerBody as any);
      expect(mockTokenService.createRefreshToken).toHaveBeenCalled();
      expect(cookie).toBe('Authorization=jwt-token; HttpOnly; Max-Age=3600');
      expect(users.updateById).toHaveBeenCalledWith('u1', { token: 'jwt-token' });
    });
  });

  describe('login', () => {
    it('throws InvalidCredentialsException for an unknown username', async () => {
      users.findByUsernameWithPassword.mockResolvedValue(null);
      await expect(service.login({ username: 'ghost', password: 'x' } as any))
        .rejects.toBeInstanceOf(InvalidCredentialsException);
    });

    it('throws InvalidCredentialsException for a wrong password', async () => {
      users.findByUsernameWithPassword.mockResolvedValue({ _id: 'u1', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login({ username: 'ab', password: 'wrong' } as any))
        .rejects.toBeInstanceOf(InvalidCredentialsException);
    });

    it('returns the user (password blanked) and cookie on success', async () => {
      users.findByUsernameWithPassword.mockResolvedValue({ _id: 'u1', username: 'ab', password: 'hashed' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const { user, cookie } = await service.login({ username: 'ab', password: 'secret1' } as any);
      expect(user.password).toBe('');
      expect(cookie).toBe('Authorization=jwt-token; HttpOnly; Max-Age=3600');
      expect(users.updateById).toHaveBeenCalledWith('u1', { token: 'jwt-token' });
    });
  });

  describe('getUserById', () => {
    it('throws UserNotFoundException when missing', async () => {
      users.findById.mockResolvedValue(null);
      await expect(service.getUserById('nope')).rejects.toBeInstanceOf(UserNotFoundException);
    });
  });
});
