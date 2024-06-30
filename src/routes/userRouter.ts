import { Router } from 'express';
import multer from 'multer';
import { getCart, getLeftOver, updateCart, updateLeftOver, updateUser, getLikedMeals, updateLikedMeals } from '../controllers/userController.js';
import { authenticateUser, checkUser } from '../middleware/authMiddleware.js';
import { storage } from '../services/cloudinary/cloudinaryServices.ts';
import { catchAsync } from '../utils/catchAsync.js';
import { getAllNotifications } from '../controllers/notificationController.ts';
import { getNotificationCount } from '../controllers/notificationController.ts';
import { getNotificationById } from '../controllers/notificationController.ts';
import { getSuggestionIngredients } from '../controllers/ingredientsController.ts';
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

router.route('/notifications/cnt').get(authenticateUser, catchAsync(getNotificationCount))
router.route('/notifications').get(authenticateUser, catchAsync(getAllNotifications))
router.route('/notifications/:id').get(authenticateUser, catchAsync(getNotificationById))
router.route('/ingredients/suggestions').get(authenticateUser, catchAsync(getSuggestionIngredients))
export default router;
