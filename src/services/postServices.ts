import { ServerError, UnauthenticatedError } from "../errors/customErrors.ts";
import PostModel, { Post } from "../models/Post.ts";
import UserModel from "../models/UserModel.ts";

export const buildPostDocument = async (post: Post) => {
  try {
    const { author, id } = post;
    const user = await UserModel.find(author);
    const existedPost = await PostModel.findById(id);
    if (!user) {
      throw new UnauthenticatedError(`invalid author`);
    }
    if (existedPost) {
      throw new ServerError(`post already existed`);
    }
    const newPost = await PostModel.create({
      post,
    });
    return newPost.id;
  } catch (error) {
    throw new ServerError(`${error}`);
  }
};
