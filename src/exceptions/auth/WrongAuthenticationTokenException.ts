import HttpException from '../http/HttpException';

class WrongAuthenticationTokenException extends HttpException {
  constructor() {
    super(401, 'Wrong Auth Token');
  }
}

export default WrongAuthenticationTokenException;