import { Router } from 'express';
const router = Router();
import { getAllIngredients, getSuggestionIngredients } from '../controllers/ingredientsController.ts';
import { checkUser } from '../middleware/authMiddleware.ts';
import { catchAsync } from '../utils/catchAsync.ts';
import { getDietAndAllergy } from '../middleware/userMiddleware.ts';

router.get('/', checkUser, catchAsync(getDietAndAllergy), catchAsync(getAllIngredients));
router.get('/:id',)
// router.get('/ingredients/suggestions', checkUser, catchAsync(getSuggestionIngredients))
// router.get('/ingredients/:categoryName',)

export default router;