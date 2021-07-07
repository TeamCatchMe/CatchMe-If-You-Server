import mongoose from 'mongoose';
import { ICharacter } from "../interfaces/ICharacter";

const CharacterSchema = new mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
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

export default mongoose.model<ICharacter & mongoose.Document>(
    "Character",
    CharacterSchema
);
