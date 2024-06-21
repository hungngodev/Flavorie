import { Router } from "express";
import { authenticateUser, authorizeReviewOwner} from "../middleware/authMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";
import Review from "../models/Review.ts";
import { createReview, updateReview, deleteReview } from "../controllers/reviewController.ts";    

const router = Router();

router.post('/:postId', authenticateUser, catchAsync(createReview));
router.put('/:postId/:reviewId', authenticateUser, authorizeReviewOwner, catchAsync(updateReview));
router.delete('/:postId/:reviewId', authenticateUser, authorizeReviewOwner, catchAsync(deleteReview));

export default router;