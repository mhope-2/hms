import HttpException from '../http/HttpException';

class InvalidCredentialsException extends HttpException {
  constructor() {
    super(401, 'Invalid Credentials');
  }
}

export default InvalidCredentialsException;