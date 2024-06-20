import { Router } from "express";
import { checkUser, authenticateUser, authorizeReviewOwner } from "../middleware/authMiddleware";
import { catchAsync } from "../utils/catchAsync";
import Review from "../models/Review";
import { createReview, updateReview, deleteReview } from "../controllers/reviewController";    

const router = Router();

router.post('/:postId', authenticateUser, catchAsync(createReview));
router.put('/', authenticateUser, authorizeReviewOwner, catchAsync(updateReview));
router.delete('/:postId/:reviewId', authenticateUser, authorizeReviewOwner, catchAsync(deleteReview));

export default router;