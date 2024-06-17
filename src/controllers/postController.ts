// postController.ts
import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { PostError } from "../errors/customErrors.ts";
import { Post } from "../models/Post.ts";
import {
  buildPostDocument,
  deletePostDocument,
  getFeedDocument,
  updatePostDocument,
} from "../services/postServices.ts";

const PostErorHandler = (fn: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await fn(req, res, next);
    } catch (err) {
      if (err instanceof Error) {
        return res.status(StatusCodes.CONFLICT).json({ error: err.message });
      } else {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: `Unexpected error: ${err}` });
      }
    }
  };
};

export const createPostController = PostErorHandler(async (req, res) => {
  const postBody = req.body;
  const createdPost = await buildPostDocument(postBody);
  if (!createdPost) {
    return null;
  }
  return res
    .status(StatusCodes.OK)
    .json({ message: "Post created", post: createdPost });
});

export const updatePostController = PostErorHandler(async (req, res) => {
  const postBody = req.body;
  const { postid } = req.params;
  const updatedPost = await updatePostDocument(postid, postBody);
  if (!updatedPost) {
    return null;
  }
  return res
    .status(StatusCodes.OK)
    .json({ message: "Post updated", post: updatedPost });
});

export const deletePostController = PostErorHandler(async (req, res) => {
  const { postid } = req.params;
  await deletePostDocument(postid);
  return res.status(StatusCodes.OK).json({ message: "Post deleted" });
});

export const newFeedController = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.body;
    const feed = await getFeedDocument(page, limit);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Feed retrieved", posts: feed });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(StatusCodes.CONFLICT).json({ error: err.message });
    } else {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: `Unexpected error: ${err}` });
    }
  }
};
