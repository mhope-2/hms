import HttpException from '../http/HttpException';

class UserNotFoundException extends HttpException {
  constructor(id: number) {
    super(404, `User not found`);
  }
}

export default UserNotFoundException;