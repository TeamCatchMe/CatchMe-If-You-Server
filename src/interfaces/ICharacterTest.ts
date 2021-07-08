import mongoose from 'mongoose';
import { IActivityTest } from './IActivityTest'
export interface ICharacterTest {
    user : mongoose.Types.ObjectId;
    user_id : string;
    characterName : string;
    characterIndex : number;
    characterImageIndex : number;
    characterImage : number;
    characterPrivacy : boolean;
    characterBirth : string;
    activity : [IActivityTest]
}
