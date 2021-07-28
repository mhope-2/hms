import * as mongoose from 'mongoose'
import UserInterface from '../interfaces/rooms.interface';

const UserSchema = new mongoose.Schema({

    username: { type: String, required: true, unique:true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: false
          }       
},
  {timestamps:true}
)

const UserModel = mongoose.model<UserInterface & mongoose.Document>('User',UserSchema)
 
export default UserModel