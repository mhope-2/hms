import HttpException from "../http/HttpException";
 
class RoomResourceNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Post with id ${id} not found`);
  }
}
 
export default RoomResourceNotFoundException;