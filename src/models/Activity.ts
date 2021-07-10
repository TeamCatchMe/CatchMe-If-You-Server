import mongoose from "mongoose";
import { IActivity } from "../interfaces/IActivity";

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "UserData",
    },
    
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
    characterIndex: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Character",
    },
  },
  {
    versionKey: false,
  }
);

export default mongoose.model<IActivity & mongoose.Document>(
  "Activity",
  ActivitySchema
);
