import { Router } from 'express';
import {
    getCurrentUser
} from '../controllers/userController.js';
import { updateUser } from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';


const router = Router();

router.get('/current-user', authenticateUser, getCurrentUser);


export default router;
