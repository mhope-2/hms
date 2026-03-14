import HttpException from '../src/exceptions/http/HttpException';
import AuthenticationTokenMissingException from '../src/exceptions/auth/AuthenticationTokenMissingException';
import InvalidCredentialsException from '../src/exceptions/auth/InvalidCredentialsException';
import InvalidPasswordLengthException from '../src/exceptions/auth/InvalidPasswordLengthException';
import NotAuthorizedException from '../src/exceptions/auth/NotAuthorizedException';
import PasswordMismatchException from '../src/exceptions/auth/PasswordMismatchException';
import UserNotExistException from '../src/exceptions/auth/UserNotExistException';
import UserNotFoundException from '../src/exceptions/auth/UserNotFoundException';
import UserWithThatEmailAlreadyExistsException from '../src/exceptions/auth/UserWithThatEmailAlreadyExistsException';
import UserWithThatUsernameAlreadyExistsException from '../src/exceptions/auth/UserWithThatUsernameAlreadyExistsException';
import WrongAuthenticationTokenException from '../src/exceptions/auth/WrongAuthenticationTokenException';
import BookingNotFoundException from '../src/exceptions/bookings/BookingNotFoundException';
import RoomNotFoundException from '../src/exceptions/room/RoomNotFoundException';

describe('HttpException', () => {
  it('sets status and message', () => {
    const err = new HttpException(500, 'Internal error');
    expect(err.status).toBe(500);
    expect(err.message).toBe('Internal error');
    expect(err).toBeInstanceOf(Error);
  });

  it('is an instance of Error', () => {
    const err = new HttpException(400, 'Bad request');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('Auth exceptions', () => {
  it('AuthenticationTokenMissingException: 401 Token Missing', () => {
    const err = new AuthenticationTokenMissingException();
    expect(err.status).toBe(401);
    expect(err.message).toBe('Token Missing');
    expect(err).toBeInstanceOf(HttpException);
  });

  it('InvalidCredentialsException: 401 Invalid Credentials', () => {
    const err = new InvalidCredentialsException();
    expect(err.status).toBe(401);
    expect(err.message).toBe('Invalid Credentials');
  });

  it('InvalidPasswordLengthException: 401 Invalid Password Length', () => {
    const err = new InvalidPasswordLengthException();
    expect(err.status).toBe(401);
    expect(err.message).toBe('Invalid Password Length');
  });

  it('NotAuthorizedException: 403 Not Authorized', () => {
    const err = new NotAuthorizedException();
    expect(err.status).toBe(403);
    expect(err.message).toBe('Not Authorized');
  });

  it('PasswordMismatchException: 401 Passwords Do Not Match', () => {
    const err = new PasswordMismatchException();
    expect(err.status).toBe(401);
    expect(err.message).toBe('Passwords Do Not Match');
  });

  it('UserNotExistException: 404', () => {
    const err = new UserNotExistException();
    expect(err.status).toBe(404);
  });

  it('UserNotFoundException: 404', () => {
    const err = new UserNotFoundException(1);
    expect(err.status).toBe(404);
    expect(err.message).toBe('User not found');
  });

  it('UserWithThatEmailAlreadyExistsException: 400', () => {
    const err = new UserWithThatEmailAlreadyExistsException('test@example.com');
    expect(err.status).toBe(400);
    expect(err.message).toMatch(/email already exists/i);
  });

  it('UserWithThatUsernameAlreadyExistsException: 400 Username Exists', () => {
    const err = new UserWithThatUsernameAlreadyExistsException('testuser');
    expect(err.status).toBe(400);
    expect(err.message).toBe('Username Exists');
  });

  it('WrongAuthenticationTokenException: 401', () => {
    const err = new WrongAuthenticationTokenException();
    expect(err.status).toBe(401);
    expect(err.message).toMatch(/wrong auth token/i);
  });
});

describe('Resource exceptions', () => {
  it('BookingNotFoundException: 404 with id in message', () => {
    const err = new BookingNotFoundException('abc123');
    expect(err.status).toBe(404);
    expect(err.message).toContain('abc123');
  });

  it('RoomNotFoundException: 404 with id in message', () => {
    const err = new RoomNotFoundException('room-1');
    expect(err.status).toBe(404);
    expect(err.message).toContain('room-1');
  });
});
