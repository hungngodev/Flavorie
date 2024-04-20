import { Router } from 'express';
import {
    getCurrentUser
} from '../controllers/userController.js';
import { updateUser } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { catchAsync } from '../utils/catchAsync.js';
import { upload, uploadToCloudinary } from '../services/cloudinary/cloudinaryServices.js';

const router = Router();

router.route('/current-user')
    .get(authenticateUser, catchAsync(getCurrentUser))
    .patch(authenticateUser, upload.array('images', 10), uploadToCloudinary, catchAsync(updateUser));


export default router;
