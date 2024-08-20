import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "@src/controllers/reviewController";
import {
  authorizeReviewOwner,
  checkUser,
} from "@src/middleware/authMiddleware";
import { catchAsync } from "@src/utils/catchAsync";
import { Router } from "express";

const router = Router();

router.get("/review/:postId", checkUser, catchAsync(getReviews));

router.post(
  "/review/:postId",
  // authenticateUser,
  checkUser,
  catchAsync(createReview),
);
router.put(
  "/review/:postId/:reviewId",
  checkUser,
  authorizeReviewOwner,
  // validateReview,
  catchAsync(updateReview),
);
router.delete(
  "/review/:postId/:reviewId",
  checkUser,
  authorizeReviewOwner,
  catchAsync(deleteReview),
);

export default router;
