import mongoose from "mongoose";
import Test from "../models/test";
import UserData from "../models/Userdata";
import Character from "../models/Character";

import config from "../config";

const connectDB = async () => {

    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });

        console.log("Mongoose Connected ...");

        // CharacterTest.createCollection().then(function (collection) {
        //     console.log('Collection is created!');
        // });
        // CharacterTest.insertMany([
        //     {
        //         "user_id": 100,
        //         "characterName": "제로콜라 먹는 흑마술사",
        //         "characterIndex" : 1,
        //         "characterImageIndex" : 1,
        //         "characterLevel" : 1,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 1,
        //                 "activityContent" : "20210707 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20210707
        //             }
        //         ]
        //     },
           
        // ]).then(function (collection) {
        //     console.log("Data Insert Success.");
        // });

    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;
