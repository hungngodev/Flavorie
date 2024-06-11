import mongoose, { Types } from "mongoose";
import { Review } from "./Review.ts";

export interface Media {
  type: "image" | "video" | "file";
  url: string;
  metadata: string[];
}
export type Privacy = "public" | "private" | "friend";

export interface Post extends mongoose.Document {
  author: Types.ObjectId;
  header: string;
  body: string;
  media: Media[];
  privacy: Privacy;
  location: string;
  review: Types.DocumentArray<Review>;
  //react: Types.DocumentArray<React>;
  reviewCount: number;
  reactCount: number;
}

interface PostModel extends mongoose.Model<Post> {}
const PostSchema = new mongoose.Schema<Post, PostModel>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    header: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    media: [
      {
        type: {
          type: String,
          enum: ["image", "video", "file"],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        metadata: {
          type: [String],
        },
      },
    ],
    privacy: {
      type: String,
      enum: ["public", "private", "friend"],
      required: true,
      default: "public",
    },
    location: {
      type: String,
    },
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    reviewCount: {
      type: Number,
      default: 0,
    },
    reactCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model<Post, PostModel>("Post", PostSchema);
