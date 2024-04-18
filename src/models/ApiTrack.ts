import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
export interface ApiTrack extends mongoose.Document {
    serviceName: string;
    usageCount: number;
    currentKey: number;
    createdAt: Date;
    updatedAt: Date;
}
type ApiTrackModel = mongoose.Model<ApiTrack>;
const ApiTrackSchema = new mongoose.Schema<ApiTrack, ApiTrackModel>({
    serviceName: {
        type: String,
        required: true,
    },
    usageCount: {
        type: Number,
        required: true,
    },
    currentKey: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});


export default mongoose.model<ApiTrack, ApiTrackModel>('ApiTrack', ApiTrackSchema);
