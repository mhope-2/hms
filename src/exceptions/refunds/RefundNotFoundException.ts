import HttpException from "../http/HttpException";

class RefundNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Refund with id ${id} not found`);
  }
}

export default RefundNotFoundException;
