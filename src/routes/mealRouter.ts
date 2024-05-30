import express from "express";
import {
  getAllMeals,
  getRanDomMealsAuthenticated
} from "../controllers/mealController.ts";
import { checkUser, authenticateUser } from "../middleware/authMiddleware.ts";
import { getDietAndAllergy, getLeftOver } from "../middleware/userMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";
const router = express.Router();

router.get("/", checkUser, getDietAndAllergy, getLeftOver, catchAsync(getAllMeals));
router.route("/:mealid")
  .get(checkUser, catchAsync(getRanDomMealsAuthenticated))

export default router;
