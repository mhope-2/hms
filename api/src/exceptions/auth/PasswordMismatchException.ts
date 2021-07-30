import HttpException from '../http/HttpException';

class PasswordMismatchException extends HttpException {
  constructor() {
    super(401, 'Passwords Do Not Match');
  }
}

export default PasswordMismatchException;