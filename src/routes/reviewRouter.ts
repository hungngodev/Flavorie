import { Router } from "express";
import { validateLoginInput, validateReview } from "../middleware/validateMiddleware";
import { checkUser, authenticateUser } from "../middleware/authMiddleware";
import { catchAsync } from "../utils/catchAsync";
import Review from "../models/Review";
import { createReview, updateReview, deleteReview } from "../controllers/reviewController";    

const router = Router();

router.post('/', validateReview, authenticateUser, catchAsync(createReview));
router.put('/', validateReview, authenticateUser, catchAsync(updateReview));
router.delete('/:reviewId', authenticateUser, catchAsync(deleteReview));

export default router;