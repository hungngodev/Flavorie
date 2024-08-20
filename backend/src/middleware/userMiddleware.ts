import { ServerError } from "@src/errors/customErrors";
import ItemModel from "@src/models/ItemModel";
import UserModel from "@src/models/UserModel";
import { NextFunction, Request, Response } from "express";

export async function getDietAndAllergy(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const allergy = [];
  const diet = [];
  if ((req as any).user) {
    const thisUser = await UserModel.findOne({ _id: (req as any).user.userId });
    if (thisUser) {
      allergy.push(...thisUser.allergy);
      diet.push(...thisUser.diet);
    }
  }
  req.body.allergy = allergy;
  req.body.diet = diet;
  next();
}

export async function getLeftOver(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = (req as any).user?.userId ?? "";
    const items = await ItemModel.find({
      userId: userId,
      type: "leftover",
    }).populate("itemId");
    const leftOver = items ?? [];
    req.body.leftOver = leftOver.map(item => item.itemId);
  } catch (error) {}
  next();
}

export async function calculatePoint(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = (req as any).user?.userId || "";
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ServerError("User not found");
  }
  next();
}
