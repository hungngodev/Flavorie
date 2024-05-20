import { Router } from 'express';
import {
    getCurrentUser
} from '../controllers/userController.js';
import { updateUser } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { catchAsync } from '../utils/catchAsync.js';
import { storage } from '../services/cloudinary/cloudinaryServices.ts';
import multer from 'multer';
const upload = multer({ storage });

const router = Router();

router.route('/current-user')
    .get(authenticateUser, catchAsync(getCurrentUser))
    .patch(authenticateUser, upload.array('images'), catchAsync(updateUser));

router.route('/cart')
    .get(authenticateUser, catchAsync(getCurrentUser))
    .patch(authenticateUser, catchAsync(updateUser));
export default router;
