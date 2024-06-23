// postController.ts
import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  buildPostDocument,
  deletePostDocument,
  getFeedDocument,
  reactPostDocument,
  updatePostDocument,
} from "../services/postServices.ts";

const PostErorHandler = (fn: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await fn(req, res, next);
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);
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
  const postFiles = req.files;
  const createdPost = await buildPostDocument(postFiles, postBody);
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
    const { page, limit } = req.query;
    const feed = await getFeedDocument(Number(page), Number(limit));
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
export const reactPostController = PostErorHandler(async (req, res) => {
  const { postid } = req.params;
  const { userId } = req.user;
  const post = await reactPostDocument(userId, postid);
  if (!post) {
    return null;
  }
  return res.status(StatusCodes.OK).json({ message: "Post liked", post: post });
});
