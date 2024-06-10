import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ServerError } from "../errors/customErrors.ts";
import PostModel from "../models/Post.ts";
import {
  buildPostDocument,
  deletePostDocument,
  updatePostDocument,
} from "../services/postServices.ts";

export const createPost = async (req: Request, res: Response) => {
  try {
    const info = req.body;
    const newPost = await buildPostDocument(info);
    if (!newPost) {
      return res.status(StatusCodes.NOT_ACCEPTABLE);
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Post created", post: newPost });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(StatusCodes.CONFLICT).json({ error: err.message });
    } else {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: `Unexpeceted error: ${err}` });
    }
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postid } = req.params;
    const new_post = await updatePostDocument(postid, req.body);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Post updated", id: new_post });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(StatusCodes.CONFLICT).json({ error: err.message });
    } else {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: `Unexpeceted error: ${err}` });
    }
  }
};
export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postid } = req.params;
    await deletePostDocument(postid);
    return res.status(StatusCodes.OK).json({ message: "Post deleted" });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(StatusCodes.CONFLICT).json({ error: err.message });
    } else {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: `Unexpeceted error: ${err}` });
    }
  }
};
