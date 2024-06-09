
import { ServerError, UnauthenticatedError } from "../errors/customErrors.ts";
import PostModel, { Post } from "../models/Post.ts";
import UserModel from "../models/UserModel.ts";


export const buildPostDocument = async (post: any): Promise<string> => {
  try {
    const { author } = post;
    const user = await UserModel.find({ _id: author });
    const existedPost = await PostModel.find({ _id: post.id });
    if (!user) {
      throw new UnauthenticatedError(`invalid author`);
    }
    if (existedPost.length > 0) {
      throw new ServerError(`post already exists`);
    }
    const newPost = await PostModel.create({
      _id: post.id,
      id: post.id,
      author: post.author,
      header: post.header,
      body: post.body,
      privacy: post.privacy,
    });
    return newPost.id;
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};