import express from "express";
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
router.post("/random-unauthenticated", getRandomMealsUnauthenticated);
router.post("/random-authenticated", getRanDomMealsAuthenticated);
router.post("/left-over", getMealsFromLeftOver);

export default router;
