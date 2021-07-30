import HttpException from '../http/HttpException';

class UserWithThatEmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(400, `User with that email already exists. Kindly choose another email.`);
  }
}

export default UserWithThatEmailAlreadyExistsException;