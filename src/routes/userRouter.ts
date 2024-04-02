import { Router } from 'express';
const router = Router();
import { getCurrentUser, updateUser } from '../controllers/userController.ts';



router.get('/user/info', getCurrentUser);
router.post('/user/update', updateUser);

export default router;