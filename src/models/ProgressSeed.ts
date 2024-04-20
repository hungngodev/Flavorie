import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
export interface Progress extends mongoose.Document {
    name: string;
    currentCagetory: number;
    queryIndex: number;
    parentIndex: number;
    childIndex: number;
}
type ProgressModel = mongoose.Model<Progress>;
const ProgressSchema = new mongoose.Schema<Progress, ProgressModel>({
    name: {
        type: String,
        required: true,
    },
    currentCagetory: {
        type: Number,
        required: true,
    },
    queryIndex: {
        type: Number,
        required: true,
    },
    parentIndex: {
        type: Number,
        required: true,
    },
    childIndex: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});


export default mongoose.model<Progress, ProgressModel>('Progress', ProgressSchema);
