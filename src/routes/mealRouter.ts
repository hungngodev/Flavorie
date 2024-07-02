import express from "express";
import {
  getAllMeals,
  getIndividualMeal,
  getAutoComplete
} from "../controllers/mealController.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import { getDietAndAllergy, getLeftOver } from "../middleware/userMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";
const router = express.Router();

router.route("/")
  .get(checkUser, getDietAndAllergy, getLeftOver, catchAsync(getAllMeals));

router.route('/autocomplete')
  .get(checkUser, catchAsync(getAutoComplete));
router.route("/:mealId")
  .get(checkUser, catchAsync(getIndividualMeal))

export default router;
