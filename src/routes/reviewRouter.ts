import { Router } from "express";
import { createReview, deleteReview, updateReview } from "../controllers/reviewController.ts";
import { authenticateUser } from "../middleware/authMiddleware.ts";
import { validateReview } from "../middleware/validateMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";

const router = Router();

router.post('/', validateReview, authenticateUser, catchAsync(createReview));
router.put('/', validateReview, authenticateUser, catchAsync(updateReview));
router.delete('/:reviewId', authenticateUser, catchAsync(deleteReview));

export default router;