import { Router } from 'express';
const router = Router();
import { getAllIngredients } from '../controllers/ingredientsController.ts';
import { authenticateUser } from '../middleware/authMiddleware.ts';



router.get('/', authenticateUser, getAllIngredients);


export default router;