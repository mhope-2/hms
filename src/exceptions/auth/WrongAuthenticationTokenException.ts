import HttpException from '../http/HttpException';

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong Auth Token. Kindly Login to Refresh token.');
  }
}

export default WrongAuthenticationTokenException;