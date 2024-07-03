import { Request, Response } from "express";
import { model } from "mongoose";
import { ServerError } from "../errors/customErrors.ts";
import PostModel from "../models/Post.ts";
import Review from "../models/Review.ts";
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
    const review = new Review({
      userId: userId,
      postId: postId,
      content: content,
      parentReview: parentReview,
    });
    console.log(review);

    const savedReview = await review.save();
    if (!savedReview) {
      console.log("error creating new review");
    }
    await savedReview.populate("userId", "id name avatar");

    if (post && !parentReview) {
      post.review.push(review);
      await post.save();
    }

    if (post && parentReview) {
      const parent = await Review.findById(parentReview);
      if (parent) {
        parent.childrenReview.push(review);
        await parent.save();
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

    await review.save();
    return res.status(201).send(populatedPost);
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
      const review = await Review.findByIdAndUpdate(reviewId);

      if (review?.userId.toString() !== userId) {
        return res.status(403).send({ error: "Forbidden" });
      }

      review.content = content;
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
    const review = await Review.findById(reviewId);
    await PostModel.findByIdAndUpdate(postId, {
      $pull: { review: reviewId },
    });

    if (review?.parentReview) {
      await Review.findByIdAndUpdate(review.parentReview, {
        $pull: { childrenReview: reviewId },
      });
    }

    await Review.findByIdAndDelete(reviewId);

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
