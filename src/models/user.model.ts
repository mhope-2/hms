import * as mongoose from 'mongoose'
import UserInterface from '../interfaces/user.interface';
let validator = require('validator');
let Schema = mongoose.Schema;


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        validate: [validator.isEmail, "Please provide a valid email"],
        required:true,
        unique:true,
        lowercase: true,
        trim:true,
        minlength:3
      },
    username: { type: String, required: true, unique:true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: false },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select:false, minlength: 6 },
    token: { type: String },
    roleId: { type: Schema.Types.ObjectId, ref: 'Roles', select: false }
      
},
  {timestamps:true}
)

const UserModel = mongoose.model<UserInterface & mongoose.Document>('User',UserSchema)
 
export default UserModel