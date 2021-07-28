import HttpException from '../http/HttpException';

class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Token Missing');
  }
}

export default AuthenticationTokenMissingException;