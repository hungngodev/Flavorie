import express from "express";
import { check } from "express-validator";
import {
  getAllMeals,
  getMealsFromLeftOver,
  getRanDomMealsAuthenticated,
  getRandomMealsUnauthenticated,
} from "../controllers/mealController.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import { checkValidIngredient } from "../middleware/mealMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";
const router = express.Router();

router.get("/", checkUser, catchAsync(getAllMeals));
router.post("/random-unauthenticated", getRandomMealsUnauthenticated);
router.post("/random-authenticated", checkUser, getRanDomMealsAuthenticated);
router.post("/left-over", checkValidIngredient, getMealsFromLeftOver);

export default router;
