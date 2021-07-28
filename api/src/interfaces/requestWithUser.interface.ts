import { Request } from 'express';
import User from './rooms.interface';
 
interface RequestWithUser extends Request {
    user?: User; 
}
 
export default RequestWithUser