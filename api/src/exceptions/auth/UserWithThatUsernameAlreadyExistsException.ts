import HttpException from '../http/HttpException';

class UserWithThatUsernameAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `Username Exists`);
  }
}

export default UserWithThatUsernameAlreadyExistsException;