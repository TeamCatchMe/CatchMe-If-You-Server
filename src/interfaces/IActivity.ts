import mongoose from "mongoose";
export interface IActivity {
  user: mongoose.Types.ObjectId;
  user_id: number;
  activityIndex: number;
  activityContent: string;
  activityImage: string;
  activityYear: string;
  activityMonth: string;
  activityDay: string;
  characterIndex: number;
  activityImageName: string;
}
