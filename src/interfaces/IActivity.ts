import mongoose from "mongoose";
export interface IActivity {
  user: mongoose.Types.ObjectId;
  user_id: string;
  activityIndex: number;
  activityContent: string;
  activityImage: string;
  activityYear: string;
  activityMonth: string;
  activityDay: string;
  recentActivityTime: string;
  characterIndex: number;
  activityImageName: string;
}
