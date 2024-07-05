import { Request, Response } from "express";
import { Server } from "http";
import { Types, model } from "mongoose";
import { ServerError } from "../errors/customErrors.ts";
import PostModel from "../models/Post.ts";
import ReviewModel from "../models/Review.ts";
import UserModel from "../models/UserModel.ts";
import { recursivePopulate } from "../utils/index.ts";
// import { isDataView } from "util/types";

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

export const createReview = async (req: Request, res: Response) => {
  const { content, parentReview } = req.body;
  const postId = req.params.postId;
  const userId = req.user.userId;

  if (!userId) {
    console.log("error no userid");
    return res.status(401).send({ error: "Unauthorized" });
  }
  if (!postId) {
    console.log("error no postid");
    return res.status(401).send({ error: "Unauthorized" });
  }
  const user = await UserModel.findById(userId);

  if (!user) {
    console.log("error no user");
    return res.status(404).send({ error: "User not found" });
  }

  try {
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new ServerError("Post not found");
    }

    if (!post) {
      return res.status(404).send({ error: "Post not found" });
    }
    const review = await new ReviewModel({
      userId: userId,
      postId: postId,
      content: content,
      parentReview: parentReview,
    }).populate({ path: "userId", select: "id name avatar" });
    console.log(review);

    const savedReview = await review.save();

    if (!savedReview || !review) {
      console.log("error creating new review");
      return res.status(400).send({ error: "Error creating new review" });
    }

    if (post && !parentReview) {
      post.review.push(review);
      await post.save();
      console.log("post saved", post.review);
    }

    if (post && parentReview) {
      const parent = await ReviewModel.findById(parentReview);
      if (parent) {
        parent.childrenReview.push(review);
        await parent.save();
        console.log("parent saved", parent.childrenReview);
      }
    }

    const populatedPost = await PostModel.findOne({ _id: postId }).populate([
      {
        path: "review",
        populate: { path: "userId", select: "id name avatar" },
      },
      {
        path: "author",
        select: "id name avatar",
      },
    ]);

    if (!populatedPost) {
      throw new ServerError("Post not found");
    }
    await recursivePopulate(populatedPost.review);
    console.log("populated post", populatedPost);

    await review.save();
    return res.status(201).json(populatedPost);
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const updateReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  if (!userId) {
    return res.status(401).send({ error: "Unauthorized" });
  } else {
    try {
      const user = await UserModel.findById(userId);
      const review = await ReviewModel.findByIdAndUpdate(reviewId, {
        content: content,
      });

      if (!review) {
        return res.status(403).send({ error: "Cannot update" });
      }
      if (user?._id !== review.userId) {
        return res.status(403).send({ error: "Review author does not match" });
      }

      // review.content = content;
      await review.save();

      return res.status(200).send(review);
    } catch (error) {
      return res.status(400).send(error);
    }
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  const { reviewId } = req.params;
  const postId = req.params.postId;

  try {
    const review = await ReviewModel.findById(reviewId);
    const post = await PostModel.findById(postId);
    if (!review || !post) {
      return res.status(404).send({ error: "Review or post not found" });
    }
    const childrenReview = review.childrenReview;
    const deleteQueue: Types.ObjectId[] = [];

    while (childrenReview.length > 0) {
      const queueSize = childrenReview.length;
      for (let i = 0; i < queueSize; i++) {
        const review = childrenReview.shift();
        const reviewDoc = await ReviewModel.findById(review);
        if (reviewDoc) {
          deleteQueue.push(reviewDoc._id);
          if (reviewDoc.childrenReview.length > 0) {
            childrenReview.push(...reviewDoc.childrenReview);
          }
        }
      }
    }

    if (deleteQueue.length > 0) {
      const bulkOps = deleteQueue.map(reviewId => ({
        deleteOne: { filter: { _id: reviewId } },
      }));

      const bulkResult = await ReviewModel.bulkWrite(bulkOps);
      if (bulkResult.deletedCount !== deleteQueue.length) {
        throw new ServerError("Failed to delete some reviews");
      }
    }
    if (review.parentReview) {
      const parent = await ReviewModel.findById(review.parentReview);
      parent?.childrenReview.pull(review._id);
      await parent?.save();
    }
    // await PostModel.findByIdAndUpdate(postId, {
    //   $pull: { review: reviewId },
    // });

    // if (review?.parentReview) {
    //   await Review.findByIdAndUpdate(review.parentReview, {
    //     $pull: { childrenReview: reviewId },
    //   });
    // }

    await ReviewModel.findByIdAndDelete(reviewId);

    return res.status(200).send({ message: "Delete review successfully" });
  } catch (error) {
    return res.status(400).send(error);
  }
};

export const getReviews = async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const postId = req.params.postId;
  const user = await UserModel.findById(userId);
  const post = await PostModel.findById(postId).populate([
    { path: "author", select: "id name avatar" },
    {
      path: "review",
      select: "content",
      populate: {
        path: "userId",
        model: "User",
        select: "id name avatar",
      },
    },
  ]);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }
  if (!post) {
    return res.status(404).send({ error: "Post not found" });
  }
  const reviews = post.review;
  if (!reviews) {
    return res.status(404).send({ error: "No reviews found" });
  }
  return res.status(200).send(reviews);
};
