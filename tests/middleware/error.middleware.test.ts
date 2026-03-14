import { Request, Response, NextFunction } from 'express';
import errorMiddleware from '../../src/middleware/error.middleware';
import HttpException from '../../src/exceptions/http/HttpException';

function makeRes() {
  const send = jest.fn();
  const status = jest.fn().mockReturnValue({ send });
  return { res: { status } as unknown as Response, status, send };
}

describe('errorMiddleware', () => {
  const req = {} as Request;
  const next = jest.fn() as NextFunction;

  it('sends the error status and message', () => {
    const { res, status, send } = makeRes();
    errorMiddleware(new HttpException(404, 'Not found'), req, res, next);
    expect(status).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith({ status: 404, message: 'Not found' });
  });

  it('defaults to status 500 when error has no status', () => {
    const { res, status } = makeRes();
    const err = new HttpException(0, 'oops');
    (err as any).status = undefined;
    errorMiddleware(err, req, res, next);
    expect(status).toHaveBeenCalledWith(500);
  });

  it('defaults to "Something went wrong" when error has no message', () => {
    const { res, send } = makeRes();
    const err = new HttpException(400, '');
    (err as any).message = undefined;
    errorMiddleware(err, req, res, next);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Something went wrong' }),
    );
  });
});
