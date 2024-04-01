import { Router } from 'express';
const router = Router();
import { getAllMeals } from '@/controllers/mealController';



router.get('/meals', getAllMeals);


export default router;