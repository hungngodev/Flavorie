import { Request, Response } from "express";
import Post from "../models/Post.ts";
import Review from "../models/Review.ts";
import UserModel from "../models/UserModel.ts";
// import { isDataView } from "util/types";

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
        const post = await Post.findById(postId);
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

        if (post) {
        post.review.push(review);
        await post.save();
        }

        if (parentReview) {
        const parent = await Review.findById(parentReview);
        if (parent) {
            parent.childrenReview.push(review);
            await parent.save();
        }
        }

        await review.save();
        return res.status(201).send(review);
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
        await Post.findByIdAndUpdate(postId, {
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
