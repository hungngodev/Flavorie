import { Router } from 'express';
const router = Router();
import { getAllIngredients } from '../controllers/ingredientsController.ts';



router.get('/ingredients', getAllIngredients);


export default router;