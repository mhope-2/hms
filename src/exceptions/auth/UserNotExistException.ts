import HttpException from '../http/HttpException';

class UserNotExistException extends HttpException {
  constructor() {
    super(404, `User not found`);
  }
}

export default UserNotExistException;