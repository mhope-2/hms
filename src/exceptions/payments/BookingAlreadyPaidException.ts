import HttpException from "../http/HttpException";

class BookingAlreadyPaidException extends HttpException {
  constructor(bookingId: string) {
    super(409, `Booking ${bookingId} has already been paid for`);
  }
}

export default BookingAlreadyPaidException;
