import mongoose from "mongoose";
import { ICharacter } from "../interfaces/ICharacter";
import Activity from "../models/Activity";
const CharacterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "UserData",
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
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<ICharacter & mongoose.Document>(
  "Character",
  CharacterSchema
);
