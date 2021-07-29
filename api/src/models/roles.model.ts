import * as mongoose from 'mongoose'
import rolesInterface from '../interfaces/roles.interface'

const rolesSchema = new mongoose.Schema({

    ReadableStreamDefaultController:{type: String, required: true, unique:true},
    description:{type: String, required: true},

},
{timestamps:true}
)

const rolesModel = mongoose.model<rolesInterface & mongoose.Document>('RoomResources', rolesSchema);
 
export default rolesModel