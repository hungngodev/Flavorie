import express, { Request, Response } from 'express';
// const router = Router();
import { getAllMeals } from '../controllers/mealController.ts';
import { ServerError } from '../errors/customErrors.ts';
import { catchAsync } from '../utils/catchAsync.ts';

const router = express.Router();

router.get('/', catchAsync(getAllMeals));

export default router;