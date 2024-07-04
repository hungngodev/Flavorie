import { Document, Types } from "mongoose";
import { StringDecoder } from "string_decoder";
import {
  BadRequestError,
  PostError,
  ServerError,
} from "../errors/customErrors.ts";
import PostModel, { Post } from "../models/Post.ts";
import ReviewModel from "../models/Review.ts";
import UserModel from "../models/UserModel.ts";
import {
  parseMedia,
  parsePublicId,
  recursivePopulate,
  updateFieldArray,
} from "../utils/index.ts";
import { cloudinary } from "./cloudinary/cloudinaryServices.ts";

PostModel.schema.pre("findOne", function (next) {
  this.populate([
    {
      path: "review",
      populate: [
        {
          path: "childrenReview",
          model: "Review",
        },
        {
          path: "userId",
          select: "id name avatar",
        },
      ],
    },
  ]);
  next();
});

export const getPostDocumentById = async (
  postId: string,
): Promise<Document> => {
  try {
    const post = await PostModel.findOne({ _id: postId }).populate([
      {
        path: "review",
        populate: { path: "userId", select: "id name avatar" },
      },
      {
        path: "author",
        select: "id name avatar",
      },
    ]);

    if (!post) {
      throw new ServerError("Post not found");
    }
    await recursivePopulate(post.review);
    console.log(post);
    return post as Document;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const getFeedDocument = async (
  page: number = 1,
  limit: number = 20,
): Promise<Document[]> => {
  console.log(`page number is ${page}`);
  const postLists = await PostModel.find()
    .sort({
      createdAt: -1,
      updatedAt: -1,
      reactCount: -1,
      reviewCount: -1,
      location: -1,
    })
    .populate({ path: "author", select: "name avatar location " })
    .populate({
      path: "review",
      populate: { path: "userId", select: "id name avatar" },
    })
    .skip((page - 1) * limit)
    .limit(limit);

  if (postLists.length === 0) throw new ServerError("Failed to get posts");
  for (let post of postLists) {
    await recursivePopulate(post.review);
  }
  console.log(postLists);
  return postLists.map(post => post.toJSON() as Document);
};

export const buildPostDocument = async (
  postFiles: any,
  postBody: Post,
): Promise<Document> => {
  try {
    const { author, header, body, privacy, location } = postBody;
    // console.log(postFiles);
    // console.log(postBody);

    const getUser = await UserModel.findById(author);
    if (!getUser) {
      throw new BadRequestError("Invalid author");
    }
    if (!body || !header) {
      throw new BadRequestError("Missing information");
    }
    const mediaData = parseMedia(postFiles);

    const postData = {
      author: author,
      header: header,
      body: body,
      media: mediaData,
      privacy: privacy,
      location: location,
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
  postBody: Partial<Post> & { remainingMedia: string[] | string },
  postFiles: any,
): Promise<Document> => {
  const {
    author,
    header,
    body,
    privacy,
    location,
    react,
    review,
    remainingMedia,
  } = postBody;

  try {
    // console.log(postBody);
    // console.log(postFiles);
    if (!postBody || !body || !header)
      throw new BadRequestError("Missing data");
    if (author) throw new BadRequestError("Cannot change author");

    const currentPost: Post | null = await PostModel.findById(postId);
    if (!currentPost) throw new PostError("Post not found");

    let parsedRemainingMedia: any = [];
    if (remainingMedia && remainingMedia.length > 0) {
      parsedRemainingMedia = Array.isArray(remainingMedia)
        ? remainingMedia.map(mediaString => JSON.parse(mediaString))
        : JSON.parse(remainingMedia);
    } else {
      currentPost.media.forEach(media => {
        const publicId = parsePublicId(media.url);
        cloudinary.uploader.destroy(publicId, err => {
          if (err) console.log(err);
        });
      });
    }

    // Delete media files from Cloudinary

    currentPost.media.forEach(media => {
      const isKept = Array.isArray(parsedRemainingMedia)
        ? parsedRemainingMedia.some(file => file.url === media.url)
        : parsedRemainingMedia.url === media.url;
      if (!isKept) {
        const publicId = parsePublicId(media.url);
        cloudinary.uploader.destroy(publicId, err => {
          if (err) console.log(err);
        });
      }
    });

    const mediaData = parseMedia(postFiles);
    const updateData = {
      header,
      body,
      media: [
        ...(Array.isArray(parsedRemainingMedia)
          ? parsedRemainingMedia
          : [parsedRemainingMedia]),
        ...mediaData,
      ].filter(post => !post.url.startsWith("blob")),
      privacy,
      location,
    };

    console.log("update data", updateData);

    const updatedPost = await PostModel.findByIdAndUpdate(postId, updateData, {
      new: true,
    }).populate([{ path: "author", select: "id name avatar" }]);

    if (!updatedPost) throw new ServerError("Failed to update post");

    await updatedPost.save();

    const returnPost = await PostModel.findOne({ _id: postId }).populate([
      {
        path: "review",
        populate: { path: "userId", select: "id name avatar" },
      },
      {
        path: "author",
        select: "id name avatar",
      },
    ]);

    if (!returnPost) {
      throw new ServerError("Post not found");
    }
    await recursivePopulate(returnPost.review);

    console.log(returnPost);
    return returnPost;
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

    // delete all files in cloudinary
    const mediaFiles = post.media;
    const allUrls = mediaFiles.map(file => file.url);

    const allValidUrls = allUrls.map(url => {
      if (!url) return false;
      const publicId = parsePublicId(url);
      return !!publicId; // ensure the publicId is valid (non-empty)
    });
    if (allValidUrls.length !== mediaFiles.length) {
      throw new ServerError("One or more media files have invalid URLs");
    }

    allUrls.forEach(async file => {
      const publicId = parsePublicId(file);
      await cloudinary.uploader.destroy(publicId, err => {
        if (err) console.log(err);
      });
    });

    const reviews = [...post.review];
    const deleteQueue: Types.ObjectId[] = [];

    // bfs to collect all review documents
    while (reviews.length > 0) {
      const queueSize = reviews.length;
      for (let i = 0; i < queueSize; i++) {
        const review = reviews.shift();
        const reviewDoc = await ReviewModel.findById(review);
        if (reviewDoc) {
          deleteQueue.push(reviewDoc._id);
          if (reviewDoc.childrenReview.length > 0) {
            reviews.push(...reviewDoc.childrenReview);
          }
        }
      }
    }

    // use bulkwrite to send multiple delete operations in one batch, reducing network round-trips
    if (deleteQueue.length > 0) {
      const bulkOps = deleteQueue.map(reviewId => ({
        deleteOne: { filter: { _id: reviewId } },
      }));

      const bulkResult = await ReviewModel.bulkWrite(bulkOps);
      if (bulkResult.deletedCount !== deleteQueue.length) {
        throw new PostError("Failed to delete some reviews");
      }
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
): Promise<Document | null> => {
  try {
    const post = await PostModel.findById(postId).populate({
      path: "author",
      select: "name avatar id",
    });
    if (!post) throw new PostError("Post not found");

    const alreadyLiked = post.react.some(id => id.equals(userId));

    if (alreadyLiked) {
      post.react.pull(userId);
      post.reactCount -= 1;
    } else {
      post.react.push(new Types.ObjectId(userId));
      post.reactCount = Math.max(0, post.reactCount + 1);
    }
    await post.save();

    const returnPost = await PostModel.findOne({ _id: postId }).populate([
      {
        path: "review",
        populate: { path: "userId", select: "id name avatar" },
      },
      {
        path: "author",
        select: "id name avatar",
      },
    ]);

    if (!returnPost) {
      throw new ServerError("Post not found");
    }

    await recursivePopulate(returnPost?.review);
    await returnPost?.save();
    return returnPost;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const savePostDocument = async (
  postId: string,
  userId: string,
): Promise<Document> => {
  try {
    const post = await PostModel.findById(postId).populate({
      path: "author",
      select: "name id avatar",
    });
    const user = await UserModel.findById(userId);

    if (!post || !user) throw new PostError("Post or user not found");

    const updatedPost = await updateFieldArray(user.savedPost, postId);
    if (!updatedPost) throw new ServerError("Failed to save post");
    user.savedPost = updatedPost as Types.DocumentArray<Types.ObjectId>;
    await user.save();

    return post;
  } catch (err) {
    throw new ServerError(`${err}`);
  }
};

export const hidePostDocument = async (
  postId: string,
  userId: string,
): Promise<Document> => {
  try {
    const post = await PostModel.findById(postId).populate({
      path: "author",
      select: "name id avatar",
    });
    const user = await UserModel.findById(userId);
    console.log("here");

    if (!post || !user) throw new PostError("Post or user not found");
    console.log(post.hiddenTo);
    const updatedPost = await updateFieldArray(post.hiddenTo, userId);

    if (!updatedPost) throw new ServerError("Failed to save post");
    post.hiddenTo = updatedPost as Types.DocumentArray<Types.ObjectId>;
    console.log(post.hiddenTo);
    await post.save();
    console.log(post);

    return post;
  } catch (err) {
    console.log(err);
    throw new ServerError(`${err}`);
  }
};
