import HttpException from '../http/HttpException';

class InvalidPasswordLengthException extends HttpException {
  constructor() {
    super(401, 'Invalid Password Length');
  }
}

export default InvalidPasswordLengthException;