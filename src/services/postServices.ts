import { Document, Types } from "mongoose";
import {
  BadRequestError,
  PostError,
  ServerError,
} from "../errors/customErrors.ts";
import PostModel, { Post } from "../models/Post.ts";
import ReviewModel from "../models/Review.ts";
import UserModel from "../models/UserModel.ts";

export const getSinglePostDocument = async (
  postId: string,
): Promise<Document> => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      throw new PostError("Post not found");
    }
    return post.toJSON() as Document;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const getFeedDocument = async (
  page: number = 1,
  limit: number = 20,
): Promise<Document[]> => {
  const postLists = await PostModel.find({ privacy: { $ne: "private" } })
    .sort({
      createdAt: -1,
      updatedAt: -1,
      reactCount: -1,
      reviewCount: -1,
      location: -1,
    })
    .populate({ path: "author", select: "name avatar location " })
    .skip((page - 1) * limit)
    .limit(limit);
  if (postLists.length === 0) throw new PostError("Failed to get posts");

  return postLists.map(post => post.toJSON() as Document);
};

export const buildPostDocument = async (postBody: Post): Promise<string> => {
  try {
    const {
      author,
      header,
      body,
      media,
      privacy,
      location,
      reviewCount,
      reactCount,
    } = postBody;
    const getUser = await UserModel.findById(author);

    if (!getUser) {
      throw new BadRequestError("Invalid author");
    }
    if (!body || !header) {
      throw new BadRequestError("Missing information");
    }
    const postData = {
      author: author,
      header: header,
      body: body,
      media: media,
      privacy: privacy,
      location: location,
      reviewCount: reviewCount,
      reactCount: reactCount,
    };
    const newPost = await PostModel.create(postData);
    if (!newPost) {
      throw new PostError("Failed to create post");
    }
    return newPost._id as string;
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};
export const updatePostDocument = async (
  postId: string,
  body: Partial<Post>,
): Promise<string> => {
  try {
    if (!body) {
      throw new BadRequestError("Missing data");
    }
    if ("author" in body) {
      throw new BadRequestError("Cannot change author");
    }
    const updateData = {
      header: body.header,
      body: body.body,
      media: body.media,
      privacy: body.privacy,
      location: body.location,
      review: body.review,
    };
    const updatedPost = await PostModel.findByIdAndUpdate(postId, updateData, {
      new: true,
    });
    if (!updatedPost) throw new PostError("Failed to update post");

    await updatedPost.save();
    return updatedPost._id as string;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const deletePostDocument = async (postId: string) => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      throw new PostError("Post not found");
    }
    const reviews = post.review;
    const deleteQueue: Types.ObjectId[] = [];

    // bfs to collect all documents
    while (reviews.length > 0) {
      const queueSize = reviews.length;
      for (let i = 0; i < queueSize; i++) {
        const review = reviews.shift();
        if (review) {
          deleteQueue.push(review._id as Types.ObjectId);
          if (review.childrenReview.length > 0) {
            reviews.push(...review.childrenReview);
          }
        }
      }
    }

    // use bulkwrite to send multiple delete operations in one batch, reducing network round-trips
    if (deleteQueue.length > 0) {
      const bulkOps = deleteQueue.map(reviewId => ({
        deleteOne: { filter: { _id: reviewId } },
      }));

      const bulkResult = await ReviewModel.bulkWrite(bulkOps);
      if (bulkResult.deletedCount !== deleteQueue.length) {
        throw new PostError("Failed to delete some reviews");
      }
    }
    const deletedPost = await PostModel.deleteOne({ _id: postId });
    if (deletedPost.deletedCount === 0) {
      throw new PostError("Failed to delete post");
    }
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const reactPostDocument = async (
  userId: string,
  postId: string,
): Promise<Array<Types.ObjectId>> => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) throw new PostError("Post not found");

    const alreadyLiked = post.react.some(id => id.equals(userId));

    if (alreadyLiked) {
      post.reactCount -= 1;
      post.react.pull(userId);
    } else {
      post.reactCount += 1;
      post.react.push(new Types.ObjectId(userId));
    }
    await post.save();
    return post.react;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};
