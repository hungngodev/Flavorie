import { Router } from 'express';
import {
    getCurrentUser
} from '../controllers/userController.js';
import { updateUser, updateCart, updateLeftOver, getCart, getLeftOver } from '../controllers/userController.js';
import { authenticateUser, checkUser } from '../middleware/authMiddleware.js';
import { catchAsync } from '../utils/catchAsync.js';
import { storage } from '../services/cloudinary/cloudinaryServices.ts';
import multer from 'multer';
const upload = multer({ storage });

const router = Router();

router.route('/current-user')
    .get(checkUser, catchAsync(getCurrentUser))
    .patch(authenticateUser, upload.array('images'), catchAsync(updateUser));

router.route('/cart')
    .get(authenticateUser, catchAsync(getCart))
    .patch(authenticateUser, catchAsync(updateCart));

router.route('/left-over')
    .get(authenticateUser, catchAsync(getLeftOver))
    .patch(authenticateUser, catchAsync(updateLeftOver));
export default router;
