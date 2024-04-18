import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
export interface Progress extends mongoose.Document {
    name: string;
    currentCagetory: string;
    currentIndex: number;
}
type ProgressModel = mongoose.Model<Progress>;
const ProgressSchema = new mongoose.Schema<Progress, ProgressModel>({
    name: {
        type: String,
        required: true,
    },
    currentCagetory: {
        type: String,
        required: true,
    },
    currentIndex: {
        type: Number,
        required: true,
    },
});


export default mongoose.model<Progress, ProgressModel>('Progress', ProgressSchema);
