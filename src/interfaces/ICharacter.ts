import mongoose from 'mongoose';
import { IActivityTest } from './IActivityTest'
import { ICharacterInfo } from './ICharacterInfo';
export interface ICharacter {
    user : mongoose.Types.ObjectId;
    user_id : string;
    character : [ICharacterInfo]
    activity : [IActivityTest]
}
