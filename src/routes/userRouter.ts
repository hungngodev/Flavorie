import { Router } from 'express';
import {
    getCurrentUser
} from '../controllers/userController.js';
import { updateUser } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { catchAsync } from '../utils/catchAsync.js';

const router = Router();

router.get('/current-user', authenticateUser, catchAsync(getCurrentUser));


export default router;
