import * as mongoose from 'mongoose'
import roomResources from '../interfaces/room_resources.interface'

const RoomResourcesSchema = new mongoose.Schema({

    name:{type: String, required: true},
    description:{type: String, required: true},

},
{timestamps:true}
)

const RoomResourcesModel = mongoose.model<roomResources & mongoose.Document>('RoomResources', RoomResourcesSchema);
 
export default RoomResourcesModel