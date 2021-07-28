import HttpException from '../http/HttpException';

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `Email Exists`);
  }
}

export default UserWithThatEmailAlreadyExistsException;