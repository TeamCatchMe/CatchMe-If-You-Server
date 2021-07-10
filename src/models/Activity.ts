import mongoose from "mongoose";
import { IActivity } from "../interfaces/IActivity";

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Activity",
    },
    user_id: {
      type: String,
      required: true,
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
    },
    activityDate: {
      type: String,
      required: true,
    },
    characterIndex: {
      type: Number,
      required: true,
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
