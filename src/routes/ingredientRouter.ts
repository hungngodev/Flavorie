import { Router } from "express";
import {
  getAllIngredients,
  getIndividualIngredient,
  getSuggestionIngredients,
} from "../controllers/ingredientsController.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import { getDietAndAllergy } from "../middleware/userMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";
const router = Router();

router.get(
  "/",
  checkUser,
  catchAsync(getDietAndAllergy),
  catchAsync(getAllIngredients),
);

router.get("/:id", catchAsync(getIndividualIngredient));
// router.get('/ingredients/:categoryName',)

export default router;
