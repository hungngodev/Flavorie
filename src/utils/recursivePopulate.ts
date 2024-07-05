import { select } from "@inquirer/prompts";
import { Document } from "mongoose";
import PostModel, { Post } from "../models/Post";

async function recursivePopulate(reviews: any) {
  for (let review of reviews) {
    await review.populate({
      path: "childrenReview",
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
    });

    if (review.childrenReview.length > 0) {
      await recursivePopulate(review.childrenReview);
    }
  }
}

export default recursivePopulate;
