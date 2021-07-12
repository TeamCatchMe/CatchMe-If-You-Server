import mongoose from "mongoose";
import config from "../config";

const connectDB = async () => {

    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        console.log("... 캐치미와 몽고디비의 만남 성공 ...");

    } catch (err) {
        console.log("... 캐치미와 몽고디비의 만남 실패 ...");
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;
