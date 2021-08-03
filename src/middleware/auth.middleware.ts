import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/auth/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/auth/WrongAuthenticationTokenException';
import UserNotExistException from '../exceptions/auth/UserNotExistException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import UserModel from '../models/user.model';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET || '';
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const id = verificationResponse._id;
      const user = await UserModel.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}
 
export default authMiddleware;