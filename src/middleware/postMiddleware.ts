import { NextFunction, Request, Response } from "express";
import { PostError } from "../errors/customErrors.ts";
import PostModel from "../models/Post.ts";

export const checkAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) {
    const post = await PostModel.findOne({ _id: req.params.postid });
    if (!post) {
      throw new PostError("Post not found");
    }
    if ((post.author as any as string) !== req.user.userId) {
      throw new PostError("Invalid author request");
    }
  }
  next();
};
