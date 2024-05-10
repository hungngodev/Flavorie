import express from "express";
import { check } from "express-validator";
import {
  getAllMeals,
  getMealsFromLeftOver,
  getRanDomMealsAuthenticated,
  getRandomMealsUnauthenticated,
} from "../controllers/mealController.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";
const router = express.Router();

router.get("/", checkUser, catchAsync(getAllMeals));
router.get("/random-unauthenticated", getRandomMealsUnauthenticated);
router.get("/random-authenticated", checkUser, getRanDomMealsAuthenticated);
router.get("/left-over", getMealsFromLeftOver);

export default router;
