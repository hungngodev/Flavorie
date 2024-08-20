import { Router } from "express";
import {
  getAllIngredients,
  getIndividualIngredient,
  getSuggestionIngredients,
  searchIngredients,
} from "../controllers/ingredientsController";
import { checkUser } from "../middleware/authMiddleware";
import { getDietAndAllergy } from "../middleware/userMiddleware";
import { catchAsync } from "../utils/catchAsync";
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
