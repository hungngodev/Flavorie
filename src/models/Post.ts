import mongoose, { Types } from "mongoose";

export interface Media {
  type: "image" | "video" | "file";
  url: string;
  metadata: string[];
}
export type Privacy = "public" | "private" | "friend";

interface PostDocument extends mongoose.Document {
  id: string;
  header: string;
  body: string;
  author: Types.ObjectId;
  media: Media[];
  privacy: Privacy;
  commentCount: number;
  reactCount: number;
}

interface PostModel extends mongoose.Model<PostDocument> {}
const PostSchema = new mongoose.Schema<PostDocument, PostModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    header: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    commentCount: {
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

PostSchema.methods.toJSON = function () {
  return this.toObject();
};
export default mongoose.model<PostDocument, PostModel>("Post", PostSchema);
