import * as mongoose from 'mongoose'
import RoomsInterface from '../interfaces/rooms.interface';
let Schema = mongoose.Schema;

const RoomsSchema = new mongoose.Schema({

    roomNumber: { type: String, required: true, unique:true },
    floor: { type: String, required: true },
    resources:[
        { type: String, required: true },
    ],
    price: { type: Number, required: true}, // in ghc.
    status: { type: String, default: 'available' }
    
},
  {timestamps:true}
)

const RoomsModel = mongoose.model<RoomsInterface & mongoose.Document>('Rooms', RoomsSchema)
 
export default RoomsModel 