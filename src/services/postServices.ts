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

export const buildPostDocument = async (body: Post): Promise<string> => {
  try {
    const { id, author } = body;
    const getUser = await UserModel.findById(author);

    if (id) {
      const existedPost = await PostModel.findById(id);
      if (existedPost) {
        throw new BadRequestError(`Post already exists`);
      }
    }
    if (!getUser) {
      console.log("here");
      throw new BadRequestError("Invalid author");
    }
    if (!body.body || !body.header) {
      throw new BadRequestError("Missing information");
    }
    const newPost = await PostModel.create({
      author: body.author,
      header: body.header,
      body: body.body,
      media: body.media,
      privacy: body.privacy,
    });

    return newPost._id as string;
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};
export const updatePostDocument = async (
  postId: string,
  body: Post,
): Promise<string> => {
  try {
    const updatePost = await PostModel.findById(postId);
    if (!updatePost) {
      throw new ServerError("Post not found");
    }
    if ("header" in body) updatePost.header = body.header;
    if ("body" in body) updatePost.body = body.body;
    if ("media" in body) updatePost.media = body.media;
    if ("privacy" in body) updatePost.privacy = body.privacy;
    if ("review" in body) updatePost.review = body.review;

    await updatePost.save();
    return updatePost._id as string;
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
