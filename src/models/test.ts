import mongoose from 'mongoose';
import { ITest } from "../interfaces/ITest";

const TestSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
    },
    hello: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
});

export default mongoose.model<ITest & mongoose.Document>(
    "Test",
    TestSchema
);
