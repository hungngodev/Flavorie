import { NotFoundError } from "@src/errors/customErrors";
import MealModel from "@src/models/MealModel";
import UserModel from "@src/models/UserModel";
import { createMeal } from "@src/services/mealServices";
import { getMealByIdAPI } from "@src/services/spoonacular/spoonacularServices";
import {
  changeItemTypes,
  getUserItems,
  modifyOrdinaryInfo,
  modifyUserItems,
  toggleLikedItem,
} from "@src/services/userServices";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const updateUser = async (req: Request, res: Response) => {
  const updatedUser = await UserModel.findById((req as any).user?.userId);
  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }
  if (req.files) {
    const files = req.files as Express.Multer.File[];
    updatedUser.avatar = files[0].path;
    updatedUser.avatarFileName = files[0].filename;
  }
  await modifyOrdinaryInfo((req as any).user?.userId || "", req.body);
  await updatedUser.save();
  res.status(StatusCodes.OK).send({ msg: "update user" });
};
export const getPersonalInfo = async (req: Request, res: Response) => {
  const currUser = await UserModel.findById((req as any).user?.userId);
  if (!currUser) {
    throw new NotFoundError("User not found");
  }
  return res.status(StatusCodes.OK).send({ currUser });
};

export const getCart = async (req: Request, res: Response) => {
  if (!(req as any).user) {
    return res.status(StatusCodes.OK).send({ msg: "Unauthorized", cart: [] });
  }
  const cart = await getUserItems((req as any).user.userId, "cart");
  return res.status(StatusCodes.OK).send({ cart });
};

export const getLeftOver = async (req: Request, res: Response) => {
  if (!(req as any).user) {
    return res
      .status(StatusCodes.OK)
      .send({ msg: "Unauthorized", leftOver: [] });
  }
  const leftOver = await getUserItems((req as any).user.userId, "leftOver");
  return res.status(StatusCodes.OK).send({ leftOver: leftOver });
};

export const updateCart = async (req: Request, res: Response) => {
  console.log(req.body);

  if (req.body.transfer === "true") {
    await changeItemTypes(
      (req as any).user?.userId || "",
      req.body.cart,
      "cart",
      "leftOver",
    );
  } else {
    await modifyUserItems(
      (req as any).user?.userId || "",
      req.body.cart,
      "cart",
    );
  }

  res.status(StatusCodes.OK).send({ msg: "update cart" });
};

export const updateLeftOver = async (req: Request, res: Response) => {
  console.log("leftOver", req.body);
  await modifyUserItems(
    (req as any).user?.userId || "",
    req.body.leftOver,
    "leftOver",
  );

  res.status(StatusCodes.OK).send({ msg: "update leftOver" });
};

export const getLikedMeals = async (req: Request, res: Response) => {
  const likedMeals = await getUserItems(
    (req as any).user?.userId || "",
    "likedMeal",
  );
  res.status(StatusCodes.OK).send({ likedMeals });
};

export const updateLikedMeals = async (req: Request, res: Response) => {
  console.log(req.body);
  let { mealId } = req.body;
  const { infoLink } = req.body;
  if (!mealId) {
    console.log("Creating not existing meal for like");
    const id = infoLink.match(/\d+/)[0];
    const mealInfo = await getMealByIdAPI(id);
    mealId = await createMeal(mealInfo, "spoonacular");
  }

  const liked = await toggleLikedItem(
    (req as any).user?.userId || "",
    mealId,
    "likedMeal",
  );
  const likedMeals = await MealModel.findById(mealId);
  if (!likedMeals) {
    throw new NotFoundError("Meal not found");
  }
  if (liked) {
    likedMeals.numberOfLiked += 1;
  } else {
    likedMeals.numberOfLiked -= 1;
  }
  await likedMeals.save();
  res
    .status(StatusCodes.OK)
    .send({ liked, numberOfLiked: likedMeals.numberOfLiked });
};

export const getCookedMeals = async (req: Request, res: Response) => {
  const cookedMeals = await getUserItems(
    (req as any).user?.userId || "",
    "cookedMeal",
  );
  res.status(StatusCodes.OK).send({ cookedMeals });
};

export const updateCookedMeals = async (req: Request, res: Response) => {
  console.log(req.body);
  await toggleLikedItem(
    (req as any).user?.userId || "",
    req.body.mealId,
    "cookedMeal",
  );
  const user = await UserModel.findById((req as any).user?.userId || "");
  if (user) {
    user.points += 10;
    await user.save();
  }

  res.status(StatusCodes.OK).send({ msg: "update cookedMeal" });
};

// export const getNutrition = async (req: Request, res: Response) => {
//   const nutrientData = {
//     protein: "20",
//     carb: "30",
//     fat: "10",
//     vitamins: "5",
//     minerals: "5",
//   };
//   const weeklySummaryData = {
//     weeklyProtein: 70,
//     weeklyCarb: 50,
//     weeklyFat: 30,
//   };

//   const weeklyCaloriesData = [
//     { date: "Mon", weeklyCalories: "200" },
//     { date: "Tue", weeklyCalories: "250" },
//     { date: "Wed", weeklyCalories: "300" },
//     { date: "Thu", weeklyCalories: "280" },
//     { date: "Fri", weeklyCalories: "350" },
//     { date: "Sat", weeklyCalories: "400" },
//     { date: "Sun", weeklyCalories: "370" },
//   ];
//   // di qua tat ca cac likedMeal getUserItems(userId, "likedMeal")
//   // tinh toan ra duoc nutrientData
//   // likedMeal co mot field la allIngredients
//   // moi ingredient co mot field la nutrient
//   // moi nutrient co mot field la amount
//   // moi nutrient co mot field la unit
// };
