import HttpException from "../http/HttpException";
 
class RoomNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Role with id ${id} not found`);
  }
}
 
export default RoomNotFoundException;