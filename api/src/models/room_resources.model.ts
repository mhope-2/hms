import * as mongoose from 'mongoose'
import roomResourcesInterface from '../interfaces/room_resources.interface'

const RoomResourcesSchema = new mongoose.Schema({

    name:{type: String, required: true, unique:true},
    description:{type: String, required: true},

},
{timestamps:true}
)

const RoomResourcesModel = mongoose.model<roomResourcesInterface & mongoose.Document>('RoomResources', RoomResourcesSchema);
 
export default RoomResourcesModel