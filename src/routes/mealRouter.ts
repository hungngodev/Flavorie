import express from "express";
import {
  getAllMeals,
  getRanDomMealsAuthenticated
} from "../controllers/mealController.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import { getDietAndAllergy } from "../middleware/userMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";
const router = express.Router();

router.get("/", checkUser, getDietAndAllergy, catchAsync(getAllMeals));
router.route("/:id")
  .get(checkUser, catchAsync(getRanDomMealsAuthenticated))

export default router;
