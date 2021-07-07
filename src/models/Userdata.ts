import mongoose from "mongoose";
import { IUserData } from "../interfaces/IUserData";

const UserDataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IUserData & mongoose.Document>(
  "UserData",
  UserDataSchema
);
