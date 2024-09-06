import { getReceiptsSuggestionIngredients } from "@src/controllers/ingredientsController";
import {
  getAllNotifications,
  getNotificationById,
  getNotificationCount,
} from "@src/controllers/notificationController";
import {
  getCart,
  getCookedMeals,
  getLeftOver,
  getLikedMeals,
  getPersonalInfo,
  updateCart,
  updateCookedMeals,
  updateLeftOver,
  updateLikedMeals,
  updateUser,
} from "@src/controllers/userController";
import { authenticateUser, checkUser } from "@src/middleware/authMiddleware";
import { storage } from "@src/services/cloudinary/cloudinaryServices";
import { catchAsync } from "@src/utils/catchAsync";
import { Router } from "express";
import multer from "multer";
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
  .get(authenticateUser, catchAsync(getReceiptsSuggestionIngredients));
export default router;
