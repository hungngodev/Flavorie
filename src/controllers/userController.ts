import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.ts";
import MealModel from "../models/MealModel.ts";
import UserModel from "../models/UserModel.ts";
import { createMeal } from "../services/mealServices.ts";
import { getMealByIdAPI } from "../services/spoonacular/spoonacularServices.ts";
import {
  changeItemTypes,
  getUserItems,
  modifyOrdinaryInfo,
  modifyUserItems,
  toggleLikedItem,
} from "../services/userServices.ts";

export const updateUser = async (req: Request, res: Response) => {
  const updatedUser = await UserModel.findById(req.user.userId);
  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }
  if (req.files) {
    const files = req.files as Express.Multer.File[];
    updatedUser.avatar = files[0].path;
    updatedUser.avatarFileName = files[0].filename;
  }
  await modifyOrdinaryInfo(req.user.userId, req.body);
  await updatedUser.save();
  res.status(StatusCodes.OK).send({ msg: "update user" });
};

export const getCart = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(StatusCodes.OK).send({ msg: "Unauthorized", cart: [] });
  }
  const cart = await getUserItems(req.user.userId, "cart");
  return res.status(StatusCodes.OK).send({ cart });
};

export const getLeftOver = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(StatusCodes.OK)
      .send({ msg: "Unauthorized", leftOver: [] });
  }
  const leftOver = await getUserItems(req.user.userId, "leftOver");
  return res.status(StatusCodes.OK).send({ leftOver: leftOver });
};

export const updateCart = async (req: Request, res: Response) => {
  console.log(req.body);

  if (req.body.transfer === "true") {
    await changeItemTypes(req.user.userId, req.body.cart, "cart", "leftOver");
  } else {
    await modifyUserItems(req.user.userId, req.body.cart, "cart");
  }

  res.status(StatusCodes.OK).send({ msg: "update cart" });
};

export const updateLeftOver = async (req: Request, res: Response) => {
  console.log("leftOver", req.body);
  await modifyUserItems(req.user.userId, req.body.leftOver, "leftOver");

  res.status(StatusCodes.OK).send({ msg: "update leftOver" });
};

export const getLikedMeals = async (req: Request, res: Response) => {
  const likedMeals = await getUserItems(req.user.userId, "likedMeal");
  res.status(StatusCodes.OK).send({ likedMeals });
};

export const updateLikedMeals = async (req: Request, res: Response) => {
  console.log(req.body);
  let { mealId, infoLink } = req.body;
  if (!mealId) {
    console.log("Creating not existing meal for like");
    const id = infoLink.match(/\d+/)[0];
    const mealInfo = await getMealByIdAPI(id);
    mealId = await createMeal(mealInfo, "spoonacular");
  }

  const liked = await toggleLikedItem(req.user.userId, mealId, "likedMeal");
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
  const cookedMeals = await getUserItems(req.user.userId, "cookedMeal");
  res.status(StatusCodes.OK).send({ cookedMeals });
};

export const updateCookedMeals = async (req: Request, res: Response) => {
  console.log(req.body);
  await toggleLikedItem(req.user.userId, req.body.mealId, "cookedMeal");
  const user = await UserModel.findById(req.user.userId);
  if (user) {
    user.points += 10;
    await user.save();
  }

  res.status(StatusCodes.OK).send({ msg: "update cookedMeal" });
};
