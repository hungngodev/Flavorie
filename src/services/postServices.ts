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
    const updateData = {
      author: author,
      header: header,
      body: body,
      media: media,
      privacy: privacy,
      location: postBody.location,
    };
    const newPost = await PostModel.create(updateData);
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
  body: Post,
): Promise<string> => {
  try {
    const updatePost = await PostModel.findById(postId);
    if (!updatePost) {
      throw new ServerError("Post not found");
    }

    if ("header" in body && updatePost)
      (updatePost as Post).header = body.header;
    if ("body" in body) (updatePost as Post).body = body.body;
    if ("media" in body) (updatePost as Post).media = body.media;
    if ("privacy" in body) (updatePost as Post).privacy = body.privacy;
    if ("location" in body) (updatePost as Post).location = body.location;
    if ("review" in body) (updatePost as Post).review = body.review;

    if ("author" in body) {
      throw new BadRequestError("Cannot change author");
    }

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
