import { Request, Response } from "express";
import Post from "../models/Post.ts";
import Review from "../models/Review.ts";
import UserModel from "../models/UserModel.ts";
// import { isDataView } from "util/types";

export const createReview = async (req: Request, res: Response) => {
  const { content, parentReview } = req.body;
  const postId = req.params.postId;
  const userId = req.user.userId;

    const user = await UserModel.findById(userId);
    const post = await Post.findById(postId);

    if (!user) {
        console.log("error no user");
        return res.status(404).send({ error: "User not found" });
    }
    if (!post) {
        return res.status(404).send({ error: "Post not found" });
    }

    try {
        const reviewData: any = {
        userId: userId,
        postId: postId,
        content: content,
        };

        if (parentReview) {
        const parent = await Review.findById(parentReview);
        if (!parent) {
            return res.status(404).send({ error: "Review not found"});
            }
            reviewData.parentReview = parentReview;
        }

        const review = new Review(reviewData);
        const savedReview = await review.save();
        
        if (parentReview) {
            const parent = await Review.findById(parentReview);
            if (parent) {
                parent.childrenReview.push(review._id);
                console.log(parent)
                await parent.save();
            }
        }
        
        if (!savedReview) {
        console.log("error creating new review");
        }

        if (post) {
        post.review.push(review._id);
        console.log(postId, review._id)
        await post.save();
        }

    // await review.save();
    return res.status(200).json(review);

    } catch (error) {
        if(error instanceof Error){
            console.log(error.message);
            console.log('Request body', req.body)
        }
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

        // recursive func to delete review and its children
        const deleteReviews = async(reviewId: string) => {
            const review = await Review.findById(reviewId);
            if (review) {
                if (review.childrenReview && review.childrenReview.length >0) {
                    for (const child of review.childrenReview) {
                        await deleteReviews(child._id.toString());
                    }
                }
                
                await Review.findByIdAndDelete(reviewId);
            }
        }

        await deleteReviews(reviewId)

        await Post.findByIdAndUpdate(postId, {
        $pull: { review: reviewId },
        });

        // for a single child
        if (review?.parentReview) {
        await Review.findByIdAndUpdate(review.parentReview, {
            $pull: { childrenReview: reviewId },
        });
        }

        return res.status(200).send({ message: "Delete review successfully" });
    } catch (error) {
        return res.status(400).send(error);
    }
};
