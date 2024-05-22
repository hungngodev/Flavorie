import express from "express";
import {
  getRanDomMealsAuthenticated,
  getRandomMealsUnauthenticated,
  getAllMeals,

} from "../controllers/mealController.ts";
import { getDietAndAllergy } from "../middleware/userMiddleware.ts";
import { checkUser } from "../middleware/authMiddleware.ts";
import { catchAsync } from "../utils/catchAsync.ts";
const router = express.Router();

router.get("/", checkUser, getDietAndAllergy, catchAsync(getAllMeals));
router.route("/:id")
  .get(checkUser, catchAsync(getRanDomMealsAuthenticated))

export default router;
