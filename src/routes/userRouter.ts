import { Router } from "express";
import multer from "multer";
import { getSuggestionIngredients } from "../controllers/ingredientsController.ts";
import {
  getAllNotifications,
  getNotificationById,
  getNotificationCount,
} from "../controllers/notificationController.ts";
import {
  getCart,
  getCookedMeals,
  getLeftOver,
  getLikedMeals,
  getNutrition,
  getPersonalInfo,
  updateCart,
  updateCookedMeals,
  updateLeftOver,
  updateLikedMeals,
  updateUser,
} from "../controllers/userController.js";
import { authenticateUser, checkUser } from "../middleware/authMiddleware.js";
import { storage } from "../services/cloudinary/cloudinaryServices.ts";
import { catchAsync } from "../utils/catchAsync.js";
const upload = multer({ storage });

const router = Router();

router
  .route("/")
  .get(checkUser, catchAsync(getPersonalInfo))
  .patch(authenticateUser, upload.array("images"), catchAsync(updateUser));

router
  .route("/cart")
  .get(checkUser, catchAsync(getCart))
  .patch(authenticateUser, catchAsync(updateCart));

router
  .route("/leftOver")
  .get(authenticateUser, catchAsync(getLeftOver))
  .patch(authenticateUser, catchAsync(updateLeftOver));

router
  .route("/likedMeal")
  .get(authenticateUser, catchAsync(getLikedMeals))
  .post(authenticateUser, catchAsync(updateLikedMeals));
router
.route("/nutrition").get(authenticateUser, catchAsync(getNutrition))
router
  .route("/cookedMeal")
  .get(authenticateUser, catchAsync(getCookedMeals))
  .post(authenticateUser, catchAsync(updateCookedMeals));

router
  .route("/notifications/cnt")
  .get(authenticateUser, catchAsync(getNotificationCount));
router
  .route("/notifications")
  .get(authenticateUser, catchAsync(getAllNotifications));
router
  .route("/notifications/:id")
  .get(authenticateUser, catchAsync(getNotificationById));
router
  .route("/ingredients/suggestions")
  .get(authenticateUser, catchAsync(getSuggestionIngredients));
export default router;
