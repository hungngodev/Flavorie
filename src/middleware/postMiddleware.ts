import { NextFunction, Request, Response } from "express";
import { PostError } from "../errors/customErrors.ts";
import PostModel from "../models/Post.ts";
import UserModel from "../models/UserModel.ts";

export const checkAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.files);
  if (req.user) {
    const post = await PostModel.findOne({ _id: req.params.postid });
    if (!post) {
      throw new PostError("Post not found");
    }
    if (post.author.toString() !== req.user.userId) {
      throw new PostError("Invalid author request");
    }
    req.body.author = post.author;
  }
  next();
};

export const bindAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) {
    console.log("at middleware");
    console.log(req);
    console.log(req.body);
    const author = await UserModel.findById(req.user.userId);
    if (!author) {
      throw new PostError("Author not found");
    }
    req.body.author = req.user.userId;

    console.log(req.body);
    console.log(req.body.author);
  }
  next();
};
