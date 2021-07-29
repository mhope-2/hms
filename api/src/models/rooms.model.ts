import * as mongoose from 'mongoose'
import UserInterface from '../interfaces/rooms.interface';
var Schema = mongoose.Schema;

const RoomsSchema = new mongoose.Schema({

    room_no: { type: String, required: true, unique:true },
    floor: { type: Number, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: false
          },
    ingredients:[
      {type: Schema.Types.ObjectId, ref: 'Ingredient'}
    ]       
},
  {timestamps:true}
)

const RoomsModel = mongoose.model<UserInterface & mongoose.Document>('Rooms', RoomsSchema)
 
export default RoomsModel 