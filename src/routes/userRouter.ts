import { Router } from 'express';
import {
    getCurrentUser
} from '../controllers/userController.js';
import { updateUser } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { catchAsync } from '../utils/catchAsync.js';
import { storage } from '../services/cloudinary/cloudinaryServices.ts';
import multer from 'multer';
import { getAllNotifications } from '../controllers/notificationController.ts';
import { getNotificationCount } from '../controllers/notificationController.ts';
import { getNotificationById } from '../controllers/notificationController.ts';
const upload = multer({ storage });

const router = Router();

router.route('/current-user')
    .get(authenticateUser, catchAsync(getCurrentUser))
    .patch(authenticateUser, upload.array('images'), catchAsync(updateUser));

router.route('/notifications/cnt').get(authenticateUser, catchAsync(getNotificationCount))
router.route('/notifications').get(authenticateUser, catchAsync(getAllNotifications))
router.route('/notifications/:id').get(authenticateUser, catchAsync(getNotificationById))
export default router;
