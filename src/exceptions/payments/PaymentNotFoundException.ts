import HttpException from "../http/HttpException";

class PaymentNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Payment with id ${id} not found`);
  }
}

export default PaymentNotFoundException;
