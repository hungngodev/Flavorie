import { Router } from "express";
import {
  createReview,
  deleteReview,
  getReviews,
  updateReview,
} from "../controllers/reviewController";
import {
  authenticateUser,
  authorizeReviewOwner,
  checkUser,
} from "../middleware/authMiddleware";
import { validateReview } from "../middleware/validateMiddleware";
import { default as Review } from "../models/Review";
import { catchAsync } from "../utils/catchAsync";

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
