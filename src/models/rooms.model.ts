import * as mongoose from 'mongoose'
import RoomsInterface from '../interfaces/rooms.interface';
let Schema = mongoose.Schema;

const RoomsSchema = new mongoose.Schema({

    roomNumber: { type: String, required: true, unique:true },
    floor: { type: Number, required: true },
    resourcesIds:[
      {type: Schema.Types.ObjectId, ref: 'RoomResources'}
    ],
    price: { type: Number, required: true} // in ghc
},
  {timestamps:true}
)

const RoomsModel = mongoose.model<RoomsInterface & mongoose.Document>('Rooms', RoomsSchema)
 
export default RoomsModel 