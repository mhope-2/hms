import HttpException from "../http/HttpException";
 
class BookingNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Post with id ${id} not found`);
  }
}
 
export default BookingNotFoundException;