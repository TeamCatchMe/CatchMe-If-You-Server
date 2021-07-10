import mongoose from "mongoose";
export interface IActivity {
    user: mongoose.Types.ObjectId;
    user_id: number;
    activityIndex: number;
    activityContent: string;
    activityImage: string;
    activityDate: string;
    characterIndex: number;
}
