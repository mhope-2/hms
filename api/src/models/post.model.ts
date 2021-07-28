import * as mongoose from 'mongoose'
import PostInterface from '../interfaces/post.interface'

const PostSchema = new mongoose.Schema({

    postImagePath:{type: String, required: true},
    postTitle:{type: String, required: true},
    postBody: {type: String, required: true},
    username: {type: String, required:true},
},
{timestamps:true}
)

const PostModel = mongoose.model<PostInterface & mongoose.Document>('Post', PostSchema);
 
export default PostModel