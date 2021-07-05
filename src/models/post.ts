import mongoose from 'mongoose';
import { IPost } from "../interfaces/IPost";

const PostSchema = new mongoose.Schema({
    user : {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    text : {
        type: String,
    },
    image : {
        type: String,
    }
});

export default mongoose.model<IPost & mongoose.Document>(
    "Post",
    PostSchema
);
