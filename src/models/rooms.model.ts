import * as mongoose from 'mongoose'
import RoomsInterface from '../interfaces/rooms.interface';
let Schema = mongoose.Schema;

const RoomsSchema = new mongoose.Schema({

    roomNumber: { type: String, required: true, unique:true },
    floor: { type: String, required: true },
    resources:[
        { type: Schema.Types.ObjectId, ref: 'RoomResources' },
    ],
    price: { type: Number, required: true}, // in ghc.
    status: { type: String, status: 'available' }
    
},
  {timestamps:true}
)

const RoomsModel = mongoose.model<RoomsInterface & mongoose.Document>('Rooms', RoomsSchema)
 
export default RoomsModel 