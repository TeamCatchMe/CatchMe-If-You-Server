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
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
    }
});
exports.default = connectDB;
//# sourceMappingURL=db.js.map