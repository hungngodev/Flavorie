import { Router } from "express";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../controllers/reviewController.ts";
import {
  authenticateUser,
  authorizeReviewOwner,
  checkUser,
} from "../middleware/authMiddleware.ts";
import { validateReview } from "../middleware/validateMiddleware.ts";
import { default as Review, default as Review } from "../models/Review.ts";
import { catchAsync } from "../utils/catchAsync.ts";

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
  validateReview,
  catchAsync(updateReview),
);
router.delete(
  "/review/:postId/:reviewId",
  authenticateUser,
  authorizeReviewOwner,
  catchAsync(deleteReview),
);

export default router;

export default router;
