import { Document } from "mongoose";
import { BadRequestError, ServerError } from "../errors/customErrors.ts";
import PostModel, { Post } from "../models/Post.ts";

export const buildPostDocument = async (post: Post): Promise<Document> => {
  try {
    const { author, body, header, id } = post;
    const getUser = await PostModel.find({ _id: author });
    const existedPost = await PostModel.find({ _id: id });
    if (existedPost.length > 0) {
      throw new BadRequestError(`Post already exists`);
    }
    if (!getUser) {
      throw new BadRequestError("Invalid author");
    }
    if (!body || !header) {
      throw new BadRequestError("Missing information");
    }
    const newPost = await PostModel.create({
      _id: post.id,
      id: post.id,
      author: post.author,
      header: post.header,
      body: post.body,
      privacy: post.privacy,
    });

    return newPost;
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};
export const updatePostDocument = async (
  postId: string,
  body: Post,
): Promise<string> => {
  try {
    const post = await PostModel.findOne({ _id: postId });
    if (!post) {
      throw new ServerError("Post not found");
    }
    if ("header" in body) post.header = body.header;
    if ("body" in body) post.body = body.body;
    if ("media" in body) post.media = body.media;
    if ("privacy" in body) post.privacy = body.privacy;
    if ("review" in body) post.review = body.review;

    await post.save();
    return post.id;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const deletePostDocument = async (postId: string) => {
  try {
    const post = await PostModel.findOne({ _id: postId });
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
