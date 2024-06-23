import { Request, Response } from "express";
import Review from "../models/Review.ts";

export const createReview = async (req: Request, res: Response) => {
    const { content, postId, parentReview } = req.body;
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

        if (parentReview) {
            const parent = await Review.findById(parentReview);
            if (parent) {
                parent.childrenReview.push(review._id);
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
        const review = await Review.findByIdAndUpdate(id, 
            { content }, 
            { new: true, runValidators: true });
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
    return res.status(400).send({ error: 'Bad request' });
};

export const deleteReview = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const review = await Review.findByIdAndDelete(id);
        res.status(200).send(review);
    }
    catch (error) {
        res.status(400).send(error);
    } 
};