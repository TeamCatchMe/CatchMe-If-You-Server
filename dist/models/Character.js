"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CharacterSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "User",
    },
    user_id: {
        type: String,
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
    characterPrivacy: {
        type: Boolean,
        required: true,
    },
    activity: [
        {
            activityIndex: {
                type: Number,
                required: true,
            },
            activityContent: {
                type: String,
                required: true,
            },
            activityImage: {
                type: String,
                required: true,
            },
            activityDate: {
                type: String,
                required: true,
            },
        }
    ]
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model("Character", CharacterSchema);
//# sourceMappingURL=Character.js.map