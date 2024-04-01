import { Router } from 'express';
const router = Router();
import { getAllIngredients } from '@/controllers/ingredientsController';



router.get('/ingredients', getAllIngredients);


export default router;