import mongoose from "mongoose";
import { IActivity } from "./IActivity";
export interface ICharacter {
  user: mongoose.Types.ObjectId;
  user_id: number;
  characterName: string;
  characterIndex: number;
  characterImageIndex: number;
  characterPrivacy: boolean;
  characterLevel: number;
  characterBirth: string;
  ResentActivityTime: string;
}
