import mongoose from 'mongoose';
export interface Review extends mongoose.Document {

}
type ReviewModel = mongoose.Model<Review>;
const ReviewSchema = new mongoose.Schema<Review, ReviewModel>({

}, {
    timestamps: true,
});


export default mongoose.model<Review, ReviewModel>('Review', ReviewSchema);
