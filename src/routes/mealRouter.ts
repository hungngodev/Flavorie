import express from "express";
import {
  getAllMeals,
  getIndividualMeal
} from "../controllers/mealController.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import { getDietAndAllergy, getLeftOver } from "../middleware/userMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";
const router = express.Router();

router.get("/", checkUser, getDietAndAllergy, getLeftOver, catchAsync(getAllMeals));
router.route("/:mealId")
  .get(checkUser, catchAsync(getIndividualMeal))

export default router;
