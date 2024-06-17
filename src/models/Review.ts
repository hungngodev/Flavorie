import mongoose, { DateSchemaDefinition, Types } from "mongoose";
import { User } from "./UserModel.ts";
import { Post } from "./Post.ts";

export interface Review extends mongoose.Document {
    userID: mongoose.Types.ObjectId;
    postID: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
    childrenReview: Types.DocumentArray<Review>;
    parentReview: mongoose.Types.ObjectId | null;
}

type ReviewModel = mongoose.Model<Review>;
const ReviewSchema = new mongoose.Schema<Review, ReviewModel>({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    content: String,
    timestamp: { type: Date, default: Date.now },
    childrenReview: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    parentReview: { type: mongoose.Schema.Types.ObjectId, ref: "Review", default: null },
});

export default mongoose.model<Review, ReviewModel>("Review", ReviewSchema);
