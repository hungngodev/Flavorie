import { Router } from 'express';
const router = Router();
import { getAllIngredients } from '../controllers/ingredientsController.ts';



router.get('/', getAllIngredients);


export default router;