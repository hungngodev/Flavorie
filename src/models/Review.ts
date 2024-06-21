import mongoose, { DateSchemaDefinition, Types } from "mongoose";
import { User } from "./UserModel";
import Post from "./Post.ts";
import { NextFunction, Request, Response } from "express";
import ExpressError from "../utils/ExpressError";

export interface Review extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    postId: mongoose.Types.ObjectId;
    content: string;
    timestamp: Date;
    childrenReview: Types.DocumentArray<Review>;
    parentReview: mongoose.Types.ObjectId | null;
}

type ReviewModel = mongoose.Model<Review>;
export const ReviewSchema = new mongoose.Schema<Review, ReviewModel>(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        postId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Post", 
            required: true 
        },
        content: {
            type: String,
            required: true,
        },
        timestamp: { 
            type: Date, 
            default: Date.now 
        },
        childrenReview: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Review" 
        }],
        parentReview: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Review", 
            default: null 
        },
});

export default mongoose.model<Review, ReviewModel>("Review", ReviewSchema);

