import express from "express";
import {
  getAllMeals,
  getAutoComplete,
  getIndividualMeal,
} from "../controllers/mealController";
import { checkUser } from "../middleware/authMiddleware";
import { getDietAndAllergy, getLeftOver } from "../middleware/userMiddleware";
import { catchAsync } from "../utils/catchAsync";
const router = express.Router();

router
  .route("/")
  .get(checkUser, getDietAndAllergy, getLeftOver, catchAsync(getAllMeals));

router.route("/autocomplete").get(checkUser, catchAsync(getAutoComplete));
router.route("/:mealId").get(checkUser, catchAsync(getIndividualMeal));

export default router;
