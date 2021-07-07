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
const CharacterTest_1 = __importDefault(require("../models/CharacterTest"));
const config_1 = __importDefault(require("../config"));
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.mongoURI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        console.log("Mongoose Connected ...");
        CharacterTest_1.default.createCollection().then(function (collection) {
            console.log('Collection is created!');
        });
        CharacterTest_1.default.insertMany([
            {
                "user_id": 1,
                "characterName": "제로콜라 먹는 흑마술사",
                "characterIndex": 1,
                "characterImageIndex": 1,
                "characterLevel": 1
            },
            {
                "user_id": 1,
                "characterName": "커피 먹는 기능명세린",
                "characterIndex": 2,
                "characterImageIndex": 2,
                "characterLevel": 1
            },
            {
                "user_id": 1,
                "characterName": "압도적 강의력 파워토익",
                "characterIndex": 3,
                "characterImageIndex": 3,
                "characterLevel": 1
            },
            {
                "user_id": 2,
                "characterName": "다이어트하며 치킨 먹는 누누",
                "characterIndex": 1,
                "characterImageIndex": 5,
                "characterLevel": 2
            },
            {
                "user_id": 2,
                "characterName": "베이컨 랜디스를 선택한 이지",
                "characterIndex": 2,
                "characterImageIndex": 3,
                "characterLevel": 1
            },
            {
                "user_id": 2,
                "characterName": "몇개나 더해야 하는지 물어보는 영자이",
                "characterIndex": 3,
                "characterImageIndex": 4,
                "characterLevel": 1
            },
            {
                "user_id": 2,
                "characterName": "아 지금 더미 쌓고 있는 띵",
                "characterIndex": 4,
                "characterImageIndex": 1,
                "characterLevel": 1
            },
            {
                "user_id": 3,
                "characterName": "끊임없이 코인 태우는 코인마스터 후릐",
                "characterIndex": 1,
                "characterImageIndex": 1,
                "characterLevel": 1
            },
            {
                "user_id": 3,
                "characterName": "키드오를 와악 먹는 띵린",
                "characterIndex": 2,
                "characterImageIndex": 4,
                "characterLevel": 1
            },
            {
                "user_id": 3,
                "characterName": "지하철에서 졸다가 역을 놓친 판다",
                "characterIndex": 3,
                "characterImageIndex": 6,
                "characterLevel": 1
            },
        ]).then(function (collection) {
            console.log("Data Insert Success.");
        });
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
    }
});
exports.default = connectDB;
//# sourceMappingURL=db.js.map