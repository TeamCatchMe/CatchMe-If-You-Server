import mongoose from 'mongoose';

export interface ICharacterInfo {
    user : mongoose.Types.ObjectId;
    user_id : string;
    characterName : string;
    characterIndex : number;
    characterImageIndex : number;
    characterPrivacy : boolean;
    characterLevel : number;
    characterBirth : string;
}
