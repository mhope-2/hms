import * as mongoose from 'mongoose'
import UserInterface from '../interfaces/rooms.interface';
let Schema = mongoose.Schema;

const RoomsSchema = new mongoose.Schema({

    roomNumber: { type: String, required: true, unique:true },
    floor: { type: Number, required: true },
    resourcesIds:[
      {type: Schema.Types.ObjectId, ref: 'RoomResources'}
    ],
    price: { type: Number, required: true}
},
  {timestamps:true}
)

const RoomsModel = mongoose.model<UserInterface & mongoose.Document>('Rooms', RoomsSchema)
 
export default RoomsModel 