import HttpException from "../http/HttpException";

class RefundNotAllowedException extends HttpException {
  constructor(message: string) {
    super(409, message);
  }
}

export default RefundNotAllowedException;
