import { Router } from 'express';
import {
    getCurrentUser
} from '../controllers/userController.js';
import { updateUser } from '../controllers/userController.js';


const router = Router();

router.get('/current-user', getCurrentUser);


export default router;
