import {
  getAllIngredients,
  getIndividualIngredient,
  getSuggestionIngredients,
  searchIngredients,
} from "@src/controllers/ingredientsController";
import { checkUser } from "@src/middleware/authMiddleware";
import { getDietAndAllergy } from "@src/middleware/userMiddleware";
import { catchAsync } from "@src/utils/catchAsync";
import { Router } from "express";
const router = Router();

router.get(
  "/",
  checkUser,
  catchAsync(getDietAndAllergy),
  catchAsync(getAllIngredients),
);
router.get(
  "/search",
  checkUser,
  getDietAndAllergy,
  catchAsync(searchIngredients),
);

router.get("/autocomplete", checkUser, catchAsync(getSuggestionIngredients));

router.get("/:id", catchAsync(getIndividualIngredient));
// router.get('/ingredients/:categoryName',)

export default router;
