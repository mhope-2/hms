jest.mock('../../src/models/user.model', () => ({
  __esModule: true,
  default: { findById: jest.fn() },
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import authMiddleware from '../../src/middleware/auth.middleware';
import UserModel from '../../src/models/user.model';
import RequestWithUser from '../../src/interfaces/requestWithUser.interface';

const mockVerify = jwt.verify as jest.Mock;
const mockFindById = UserModel.findById as jest.Mock;

function makeReq(cookies: Record<string, string> = {}): RequestWithUser {
  return { cookies } as unknown as RequestWithUser;
}

describe('authMiddleware', () => {
  const res = {} as Response;
  let next: NextFunction;

  beforeEach(() => {
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('calls next with 401 when no Authorization cookie', async () => {
    await authMiddleware(makeReq(), res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 401 }),
    );
  });

  it('calls next with 401 when jwt.verify throws', async () => {
    mockVerify.mockImplementation(() => { throw new Error('bad token'); });
    await authMiddleware(makeReq({ Authorization: 'bad' }), res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 401 }),
    );
  });

  it('calls next with 401 when user is not found in DB', async () => {
    mockVerify.mockReturnValue({ _id: 'user123' });
    mockFindById.mockResolvedValue(null);
    await authMiddleware(makeReq({ Authorization: 'valid' }), res, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 401 }),
    );
  });

  it('attaches user to request and calls next() on valid token', async () => {
    const fakeUser = { _id: 'user123', username: 'jane' };
    mockVerify.mockReturnValue({ _id: 'user123' });
    mockFindById.mockResolvedValue(fakeUser);
    const req = makeReq({ Authorization: 'valid' });
    await authMiddleware(req, res, next);
    expect(req.user).toBe(fakeUser);
    expect(next).toHaveBeenCalledWith(/* no args */);
  });
});
