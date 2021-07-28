import HttpException from '../http/HttpException';

class PasswordMismatchException extends HttpException {
  constructor() {
    super(401, 'Password Mismatch');
  }
}

export default PasswordMismatchException;