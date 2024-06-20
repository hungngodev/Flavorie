import { Request, Response } from "express";
import Review from "../models/Review";
import Post from "../models/Post";
import { isDataView } from "util/types";

export const createReview = async (req: Request, res: Response) => {
    const { content, parentReview } = req.body;
    const postId = req.params.postId
    const userId = req.user.userId;

    if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    try {
        const review = new Review({
            userId,
            postId,
            content,
            parentReview
        });

        const post = await Post.findById(postId);
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
    }
    catch (error) {
        return res.status(400).send(error);
    }
};

export const updateReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!userId) {
        return res.status(401).send({ error: 'Unauthorized' });
    }

    try {
        const review = await Review.findByIdAndUpdate(id);

        if (review?.userId.toString() !== userId) {
            return res.status(403).send({ error: 'Forbidden' });
        }

        review.content = content;
        await review.save();

        return res.status(200).send(review);
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({ error: error.message });
        }
    }
};

export const deleteReview = async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const postId = req.params.postId;

    try {
        const review = await Review.findById(reviewId);
        await Post.findByIdAndUpdate(postId, {
            $pull: {review: reviewId}
        });

        if (review?.parentReview) {
            await Review.findByIdAndUpdate(review.parentReview, {
                $pull: {childrenReview: reviewId}
            });
        }

        await Review.findByIdAndDelete(reviewId);

        return res.status(200).send({ message: 'Delete review successfully'});
    }
    catch (error) {
        return res.status(400).send(error);
    } 
};  
