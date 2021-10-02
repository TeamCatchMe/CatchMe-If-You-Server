import mongoose from "mongoose";
import { IActivity } from "./IActivity";
export interface ICharacter {
  user: mongoose.Types.ObjectId;
  user_id: string;
  user_nickname: string;
  characterName: string;
  characterIndex: number;
  characterImageIndex: number;
  characterPrivacy: boolean;
  characterLevel: number;
  characterBirth: string;
  recentActivityTime: string;
  activityCount: number;
  countPercentage: number;
  activity: IActivity[];
  activityID: mongoose.Types.ObjectId;
}
