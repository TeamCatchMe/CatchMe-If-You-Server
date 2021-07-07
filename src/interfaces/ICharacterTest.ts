import mongoose from 'mongoose';

export interface ICharacterTest {
    user : mongoose.Types.ObjectId;
    user_id : number;
    characterName : string;
    characterIndex : number;
    characterImageIndex : number;
    characterImage : number;
}
