"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TestSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
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
exports.default = mongoose_1.default.model("Test", TestSchema);
//# sourceMappingURL=test.js.map