import { Router } from "express";
import {
  createReview,
  deleteReview,
  updateReview,
} from "../controllers/reviewController.ts";
import {
  authenticateUser,
  authorizeReviewOwner,
} from "../middleware/authMiddleware.ts";
import { validateReview } from "../middleware/validateMiddleware.ts";
import Review from "../models/Review.ts";
import { catchAsync } from "../utils/catchAsync.ts";

// const router = Router();

router.post(
  "/:postId",
  authenticateUser,
  validateReview,
  catchAsync(createReview),
);
router.put(
  "/:postId/:reviewId",
  authenticateUser,
  authorizeReviewOwner,
  validateReview,
  catchAsync(updateReview),
);
router.delete(
  "/:postId/:reviewId",
  authenticateUser,
  authorizeReviewOwner,
  catchAsync(deleteReview),
);

// export default router;
