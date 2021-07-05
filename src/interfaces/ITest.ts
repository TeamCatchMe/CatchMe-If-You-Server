import mongoose from 'mongoose';

export interface ITest {
    user: mongoose.Types.ObjectId;
    hello: string;
    image: string;
    message: string;
}
