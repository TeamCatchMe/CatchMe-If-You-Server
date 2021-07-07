"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CharacterSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        // ref: "User",
    },
    user_id: {
        type: Number,
        required: true,
    },
    characterName: {
        type: String,
        required: true,
    },
    characterIndex: {
        type: Number,
    },
    characterImageIndex: {
        type: Number,
    },
    characterLevel: {
        type: Number,
    },
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model("Character", CharacterSchema);
//# sourceMappingURL=CharacterTest.js.map