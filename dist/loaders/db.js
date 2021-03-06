"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.mongoURI, {
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
        //         "message": null
        //     }
        // ]).then(function (collection) {
        //     console.log("Data Insert Success.");
        // });
        // UserData.createCollection().then(function (collection) {
        //   console.log("Banner Collection is created!");
        // });
        // UserData.insertMany([
        //   {
        //     email: "test@test.com",
        //     password: "test111",
        //     nickname: "최영재",
        //   },
        //   {
        //     email: "test2@test.com",
        //     password: "test222",
        //     nickname: "권세훈",
        //   },
        //   {
        //     email: "test3@test.com",
        //     password: "test333",
        //     nickname: "백진희",
        //   },
        // ]).then(function (collection) {
        //   console.log("Data Insert Success.");
        // });
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
        //     {
        //         "user_id": 100,
        //         "characterName": "커피 먹는 기능명세린",
        //         "characterIndex" : 2,
        //         "characterImageIndex" : 2,
        //         "characterLevel" : 1,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 2,
        //                 "activityContent" : "20210506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20210506
        //             }
        //         ]
        //     },
        //     {
        //         "user_id": 100,
        //         "characterName": "압도적 강의력 파워토익",
        //         "characterIndex" : 3,
        //         "characterImageIndex" : 3,
        //         "characterLevel" : 1,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 3,
        //                 "activityContent" : "20210404 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20210404
        //             }
        //         ]
        //     },
        //     {
        //         "user_id": 100,
        //         "characterName": "다이어트하며 치킨 먹는 누누",
        //         "characterIndex" : 1,
        //         "characterImageIndex" : 5,
        //         "characterLevel" : 2,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 4,
        //                 "activityContent" : "20210202 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20210202
        //             }
        //         ]
        //     },
        //     {
        //         "user_id": 1,
        //         "characterName": "베이컨 랜디스를 선택한 이지",
        //         "characterIndex" : 2,
        //         "characterImageIndex" : 3,
        //         "characterLevel" : 1,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 5,
        //                 "activityContent" : "20200506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20200506
        //             }
        //         ]
        //     },
        //     {
        //         "user_id": 1,
        //         "characterName": "몇개나 더해야 하는지 물어보는 영자이",
        //         "characterIndex" : 3,
        //         "characterImageIndex" : 4,
        //         "characterLevel" : 1,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 6,
        //                 "activityContent" : "20190506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20190506
        //             }
        //         ]
        //     },
        //     {
        //         "user_id": 100,
        //         "characterName": "아 지금 더미 쌓고 있는 띵",
        //         "characterIndex" : 4,
        //         "characterImageIndex" : 1,
        //         "characterLevel" : 1,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 7,
        //                 "activityContent" : "20180506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20180506
        //             }
        //         ]
        //     },
        //     {
        //         "user_id": 100,
        //         "characterName": "끊임없이 코인 태우는 코인마스터 후릐",
        //         "characterIndex" : 1,
        //         "characterImageIndex" : 1,
        //         "characterLevel" : 1,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 8,
        //                 "activityContent" : "20170506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20170106
        //             }
        //         ]
        //     },
        //     {
        //         "user_id": 100,
        //         "characterName": "키드오를 와악 먹는 띵린",
        //         "characterIndex" : 2,
        //         "characterImageIndex" : 4,
        //         "characterLevel" : 1,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 9,
        //                 "activityContent" : "20150506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20150506
        //             }
        //         ]
        //     },
        //     {
        //         "user_id": 3,
        //         "characterName": "지하철에서 졸다가 역을 놓친 판다",
        //         "characterIndex" : 3,
        //         "characterImageIndex" : 6,
        //         "characterLevel" : 1,
        //         "activity" : [
        //             {
        //                 "activityIndex" : 1,
        //                 "activityContent" : "20210506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20210506
        //             },
        //             {
        //                 "activityIndex" : 2,
        //                 "activityContent" : "20180506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20180506
        //             },
        //             {
        //                 "activityIndex" : 3,
        //                 "activityContent" : "20160506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20160506
        //             },{
        //                 "activityIndex" : 4,
        //                 "activityContent" : "20170506 천방지축 얼렁뚱땅 뒹굴뒹굴 돌아가는 짱구의 하루, 오늘도 짱구는 무엇을 할까?",
        //                 "activityImage" : "https://catchmeserver.s3.us-east-2.amazonaws.com/1625504589099.jpeg",
        //                 "activityDate" : 20170506
        //             }
        //         ]
        //     },
        // ]).then(function (collection) {
        //     console.log("Data Insert Success.");
        // });
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
    }
});
exports.default = connectDB;
//# sourceMappingURL=db.js.map