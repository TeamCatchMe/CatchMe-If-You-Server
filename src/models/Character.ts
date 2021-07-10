import mongoose from "mongoose";
import { ICharacter } from "../interfaces/ICharacter";
import Activity from "../models/Activity";
const CharacterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Character",
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
    characterBirth: {
      type: String,
    },
    ResentActivityTime: {
      type: String,
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
      },
    ],

  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICharacter & mongoose.Document>(
  "Character",
  CharacterSchema
);
