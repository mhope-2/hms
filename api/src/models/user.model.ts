import * as mongoose from 'mongoose'
import UserInterface from '../interfaces/user.interface';
let Schema = mongoose.Schema;


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ],
        required:true,
        unique:true,
        trim:true,
        minlength:3
      },
    username: { type: String, required: true, unique:true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role:[
        {type: Schema.Types.ObjectId, ref: 'Roles'}
      ],
    
},
  {timestamps:true}
)

const UserModel = mongoose.model<UserInterface & mongoose.Document>('User',UserSchema)
 
export default UserModel