// postController.ts
import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PostError } from "../errors/customErrors.ts";
import { Post } from "../models/Post.ts";
import {
  buildPostDocument,
  deletePostDocument,
  updatePostDocument,
} from "../services/postServices.ts";

const createPostController = async (req: Request) => {
  const postBody = req.body;
  const createdPost = await buildPostDocument(postBody);
  if (!createdPost) {
    return null;
  }
  return { message: "Post created", data: createdPost };
};

const updatePostController = async (req: Request) => {
  const postBody = req.body;
  const { postid } = req.params;
  const updatedPost = await updatePostDocument(postid, postBody);
  if (!updatedPost) {
    return null;
  }
  return {
    message: "Post updated",
    data: updatedPost,
  };
};

const deletePostController = async (req: Request) => {
  const { postid } = req.params;
  await deletePostDocument(postid);
  return { message: "Post deleted" };
};

export const postService = async (req: Request, res: Response) => {
  try {
    let response;
    switch (req.method) {
      case "POST":
        response = await createPostController(req);
        break;
      case "PUT":
        response = await updatePostController(req);
        break;
      case "DELETE":
        response = await deletePostController(req);
        break;
      default:
        response = { message: "Invalid request" };
    }
    if (!response) {
      throw new PostError("Post service failed");
    }
    return res.status(StatusCodes.OK).json(response);
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
