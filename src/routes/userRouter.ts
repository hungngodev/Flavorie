import { Router } from 'express';
import multer from 'multer';
import { getCart, getLeftOver, updateCart, updateLeftOver, updateUser, getLikedMeals, updateLikedMeals } from '../controllers/userController.js';
import { authenticateUser, checkUser } from '../middleware/authMiddleware.js';
import { storage } from '../services/cloudinary/cloudinaryServices.ts';
import { catchAsync } from '../utils/catchAsync.js';
const upload = multer({ storage });

const router = Router();

router.route('/')
    .patch(authenticateUser, upload.array('images'), catchAsync(updateUser));

router.route('/cart')
    .get(checkUser, catchAsync(getCart))
    .patch(authenticateUser, catchAsync(updateCart));

router.route('/left-over')
    .get(authenticateUser, catchAsync(getLeftOver))
    .patch(authenticateUser, catchAsync(updateLeftOver));

router.route('/likedMeals')
    .get(authenticateUser, catchAsync(getLikedMeals))
    .post(authenticateUser, catchAsync(updateLikedMeals));
export default router;
