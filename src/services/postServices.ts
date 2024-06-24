import { v2 as cloudinary } from "cloudinary";
import { Document, Types } from "mongoose";
import {
  BadRequestError,
  PostError,
  ServerError,
} from "../errors/customErrors.ts";
import PostModel, { Post } from "../models/Post.ts";
import UserModel from "../models/UserModel.ts";

export const getSinglePostDocument = async (
  postId: string,
): Promise<Document> => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) {
      throw new ServerError("Post not found");
    }
    return post.toJSON() as Document;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const getFeedDocument = async (
  page: number = 1,
  limit: number = 20,
): Promise<Document[]> => {
  console.log(`page number is ${page}`);
  const postLists = await PostModel.find({ privacy: { $ne: "private" } })
    .sort({
      createdAt: -1,
      updatedAt: -1,
      reactCount: -1,
      reviewCount: -1,
      location: -1,
    })
    .populate({ path: "author", select: "name avatar location " })
    .skip((page - 1) * limit)
    .limit(limit);
  if (postLists.length === 0) throw new ServerError("Failed to get posts");

  return postLists.map(post => post.toJSON() as Document);
};

export const buildPostDocument = async (
  postFiles: any,
  postBody: Post,
): Promise<Document> => {
  try {
    const {
      author,
      header,
      body,
      media,
      privacy,
      location,
      reviewCount,
      reactCount,
    } = postBody;
    // console.log(postFiles);
    // console.log(postBody);

    const getUser = await UserModel.findById(author);
    if (!getUser) {
      throw new BadRequestError("Invalid author");
    }
    if (!body || !header) {
      throw new BadRequestError("Missing information");
    }

    // the media field in backend will only store the url of the image on cloudinary
    let parsedMedia = [];
    if (postFiles && postFiles.length > 0) {
      parsedMedia = postFiles.map((file: any) => ({
        type: file.mimetype.startsWith("image") ? "image" : "video",
        url: file.path,
        metadata: [file.fieldname, file.originalname],
        description: file.originalName,
      }));
    }

    const postData = {
      author: author,
      header: header,
      body: body,
      media: parsedMedia.length > 0 ? parsedMedia : media,
      privacy: privacy,
      location: location,
      reviewCount: reviewCount,
      reactCount: reactCount,
    };
    const newPost = await PostModel.create(postData);
    if (!newPost) {
      throw new ServerError("Failed to create post");
    }
    const returnPost = await PostModel.findById(newPost._id).populate({
      path: "author",
      select: "name avatar location ",
    });

    // Return the newly created post to reload the newfeed
    return returnPost as Document;
  } catch (error) {
    console.log(error);
    throw new ServerError(`${error}`);
  }
};
export const updatePostDocument = async (
  postId: string,
  body: Partial<Post>,
): Promise<string> => {
  try {
    if (!body) {
      throw new BadRequestError("Missing data");
    }
    if ("author" in body) {
      throw new BadRequestError("Cannot change author");
    }
    const updateData = {
      header: body.header,
      body: body.body,
      media: body.media,
      privacy: body.privacy,
      location: body.location,
      review: body.review,
    };
    const updatedPost = await PostModel.findByIdAndUpdate(postId, updateData, {
      new: true,
    });
    if (!updatedPost) throw new ServerError("Failed to update post");

    await updatedPost.save();
    return updatedPost._id as string;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const deletePostDocument = async (postId: string) => {
  try {
    const post = await PostModel.findById(postId);
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

export const reactPostDocument = async (
  userId: string,
  postId: string,
): Promise<Array<Types.ObjectId>> => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) throw new PostError("Post not found");

    const alreadyLiked = post.react.some(id => id.equals(userId));

    if (alreadyLiked) {
      post.reactCount -= 1;
      post.react.pull(userId);
    } else {
      post.reactCount += 1;
      post.react.push(new Types.ObjectId(userId));
    }
    await post.save();
    return post.react;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};
