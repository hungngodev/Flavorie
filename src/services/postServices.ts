import { Document } from "mongoose";
import { BadRequestError, ServerError } from "../errors/customErrors.ts";
import PostModel, { Post } from "../models/Post.ts";
import UserModel from "../models/UserModel.ts";

export const getSinglePostDocument = async (
  postId: string,
): Promise<Document> => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      throw new ServerError("Post not found");
    }
    return post.toJSON() as Document;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const buildPostDocument = async (postBody: Post): Promise<string> => {
  try {
    const { author, header, body, media, privacy } = postBody;
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
      location: postBody.location,
    };
    const newPost = await PostModel.create(postData);
    if (!newPost) {
      throw new ServerError("Failed to create post");
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
    if (!updatedPost) throw new ServerError("Failed to update post");

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
      throw new ServerError("Post not found");
    }
    const deletedPost = await PostModel.deleteOne({ _id: postId });
    if (deletedPost.deletedCount === 0) {
      throw new ServerError("Failed to delete post");
    }
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};
