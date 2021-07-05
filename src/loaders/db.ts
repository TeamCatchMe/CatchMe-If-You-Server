import mongoose from 'mongoose';
import Test from "../models/test";

import config from "../config";

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });

        console.log("Mongoose Connected ...");

        // Test.createCollection().then(function (collection) {
        //     console.log('Banner Collection is created!');
        // });
        // Test.insertMany([
        //     {
        //         "hello": "야 들어가냐?33",
        //         "image": "https://catchmeserver.s3.us-east-2.amazonaws.com/image.png",
        //         "message" : "끼얏호"
        //     },
        //     {
        //         "hello": "들어간거 맞지??333",
        //         "image": "https://catchmeserver.s3.us-east-2.amazonaws.com/image.png",
        //         "message" : "바보"

        //     },
        //     {
        //         "hello": "들654865ㅕㅇ??333",
        //         "image": "https://catchmeserver.s3.us-east-2.amazonaws.com/image.png",
        //     }

        // ]).then(function (collection) {
        //     console.log("Data Insert Success.");
        // });

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;