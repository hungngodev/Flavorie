import { Router } from 'express';
const router = Router();
import { getAllMeals } from '../controllers/mealController.ts';



router.get('/meals', getAllMeals);


export default router;