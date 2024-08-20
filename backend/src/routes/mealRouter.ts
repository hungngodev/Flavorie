import {
  getAllMeals,
  getAutoComplete,
  getIndividualMeal,
} from "@src/controllers/mealController";
import { checkUser } from "@src/middleware/authMiddleware";
import { getDietAndAllergy, getLeftOver } from "@src/middleware/userMiddleware";
import { catchAsync } from "@src/utils/catchAsync";
import express from "express";
const router = express.Router();

router
  .route("/")
  .get(checkUser, getDietAndAllergy, getLeftOver, catchAsync(getAllMeals));

router.route("/autocomplete").get(checkUser, catchAsync(getAutoComplete));
router.route("/:mealId").get(checkUser, catchAsync(getIndividualMeal));

export default router;
