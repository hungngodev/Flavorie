// postController
import { ServerError } from "@src/errors/customErrors";
import Post from "@src/models/Post";
import {
  buildPostDocument,
  deletePostDocument,
  getFeedDocument,
  getPostDocumentById,
  getUserPostDocument,
  hidePostDocument,
  reactPostDocument,
  savePostDocument,
  updatePostDocument,
} from "@src/services/postServices";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";

const PostErorHandler = (fn: RequestHandler) => {
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
    throw new ServerError("Failed to create post");
  }
  return res
    .status(StatusCodes.OK)
    .json({ message: "Post created", post: createdPost });
});

export const updatePostController = PostErorHandler(async (req, res) => {
  const postBody = req.body;
  const postFiles = req.files;
  const { postid } = req.params;
  const updatedPost = await updatePostDocument(postid, postBody, postFiles);
  if (!updatedPost) {
    throw new ServerError("Failed to update post");
  }
  return res
    .status(StatusCodes.OK)
    .json({ message: "Post updated", post: updatedPost });
});

export const deletePostController = PostErorHandler(async (req, res) => {
  const { postid } = req.params;
  const { userId } = (req as any).user ? (req as any).user : { userId: "" };
  await deletePostDocument(postid, userId);
  return res.status(StatusCodes.OK).json({ message: "Post deleted" });
});

export const newFeedController = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const feed = await getFeedDocument(Number(page), Number(limit));
    const totalPosts = await Post.estimatedDocumentCount();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Feed retrieved", posts: feed, totalPosts });
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

export const reactPostController = PostErorHandler(
  async (req: Request, res: Response) => {
    const { postid } = req.params;
    const userId = (req as any).user?.userId || "";
    const post = await reactPostDocument(userId, postid);
    if (!post) {
      throw new ServerError("Failed to like post");
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Post liked", reacts: post });
  },
);

export const savePostController = PostErorHandler(async (req, res) => {
  const { postid } = req.params;
  const userId = (req as any).user?.userId || "";
  const post = await savePostDocument(postid, userId);
  if (!post) {
    throw new ServerError("Post not found");
  }
  return res
    .status(StatusCodes.OK)
    .json({ message: "Post hidden", post: post });
});

export const getUserPostController = PostErorHandler(async (req, res) => {
  const userId = (req as any).user?.userId || "";
  const { limit } = req.params;
  const posts = await getUserPostDocument(userId, parseInt(limit));
  if (!posts) {
    throw new ServerError("Post not found");
  }
  return res.status(StatusCodes.OK).send({
    message: "Post hidden",
    userList: posts.userList,
    savedList: posts.savedList,
  });
});

export const hidePostController = PostErorHandler(async (req, res) => {
  const { postid } = req.params;
  const userId = (req as any).user?.userId || "";
  const post = await hidePostDocument(postid, userId);
  if (!post) {
    throw new ServerError("Post not found");
  }
  return res
    .status(StatusCodes.OK)
    .json({ message: "Post hidden", post: post });
});

export const getPostController = PostErorHandler(async (req, res) => {
  const { postid } = req.params;
  const post = await getPostDocumentById(postid);
  if (!post) {
    throw new ServerError("Post not found");
  }
  return res.status(StatusCodes.OK).json({ message: "Post retrieved", post });
});
