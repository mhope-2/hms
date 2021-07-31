import * as mongoose from 'mongoose'
import rolesInterface from '../interfaces/roles.interface'

const roleSchema = new mongoose.Schema({

    role: { type: String, required: true, unique:true},
    description : {type: String, required: true},

},

{timestamps:true}
)

const RolesModel = mongoose.model<rolesInterface & mongoose.Document>('Roles', roleSchema);
 
export default RolesModel