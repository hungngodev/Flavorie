import express, { Request, Response } from 'express';
// const router = Router();
import { getAllMeals } from '../controllers/mealController.ts';
import { ServerError } from '../errors/customErrors.ts';

const router = express.Router();

router.get('/', getAllMeals);

export default router;