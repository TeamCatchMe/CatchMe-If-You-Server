import mongoose from 'mongoose';

export interface ICharacter {
    user : mongoose.Types.ObjectId;
    user_id : number;
    characterName : string;
    characterIndex : number;
    characterImageIndex : number;
    characterImage : number;
}
