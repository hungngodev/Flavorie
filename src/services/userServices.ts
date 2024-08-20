import { Types } from "mongoose";
import {
  NotFoundError,
  UnauthenticatedError,
  UserCreationError,
} from "../errors/customErrors";
import ItemModel, { Item } from "../models/ItemModel";
import UserModel, { User } from "../models/UserModel";
import { comparePassword, hashPassword } from "../utils/passwordUtils";

export async function createUser(userDocument: User): Promise<string> {
  const { email, name } = userDocument;
  if (!email || !name)
    throw new UserCreationError("Email and Name are required");

  const isEmailExist = await UserModel.findOne({ email: email });
  const isNameExist = await UserModel.findOne({ name: name });
  if (isEmailExist || isNameExist)
    throw new UserCreationError("User already exists");

  const user = await UserModel.create(userDocument);
  return (user._id as Types.ObjectId).toString();
}

export async function authenticateCheck(userDocument: User): Promise<string> {
  const { email, password } = userDocument;
  if (!email || !password)
    throw new UnauthenticatedError("Email and Password are required");

  const user = await UserModel.findOne({ email: email });
  const isValidUser = user;
  if (!isValidUser) throw new NotFoundError("User not found");
  const isValidPassword = await comparePassword(password, user.password);

  if (!isValidPassword) throw new UnauthenticatedError("invalid credentials");

  return (user._id as Types.ObjectId).toString();
}

export async function modifyOrdinaryInfo(
  userId: string,
  reqInfo: User,
): Promise<void> {
  const user = await UserModel.findById(userId);
  if (!user) throw new UnauthenticatedError("User not found");
  // if (reqInfo.role !== "admin") throw new UnauthenticatedError("Not Allowed");
  if ("name" in reqInfo) user.name = reqInfo.name;
  if ("email" in reqInfo) user.email = reqInfo.email;
  if ("password" in reqInfo)
    user.password = await hashPassword(reqInfo.password);
  if ("lastName" in reqInfo) user.lastName = reqInfo.lastName;
  if ("city" in reqInfo) user.city = reqInfo.city;
  if ("country" in reqInfo) user.country = reqInfo.country;
  if ("description" in reqInfo) user.description = reqInfo.description;

  if ("role" in reqInfo) user.role = reqInfo.role;
  if ("avatar" in reqInfo) user.avatar = reqInfo.avatar;
  if ("avatarPublicId" in reqInfo) user.avatarPublicId = reqInfo.avatarPublicId;
  if ("preferences" in reqInfo) user.preferences = reqInfo.preferences;
  if ("allergy" in reqInfo) user.allergy = reqInfo.allergy;
  if ("diet" in reqInfo) user.diet = reqInfo.diet;
  await user.save();
}

export async function getUserItems(userId: string, type: string) {
  const items = await ItemModel.find({ userId: userId, type: type })
    .populate(type)
    .populate("userId");
  return items;
}

export async function modifyUserItems(
  userId: string,
  items: Item[],
  type: string,
): Promise<void> {
  if (!items || items.length === 0 || items === undefined || items === null) {
    const existingItems = await ItemModel.find({ userId: userId, type: type });
    for (const existingItem of existingItems) {
      await ItemModel.findByIdAndDelete(existingItem._id);
    }
  }
  try {
    for (const item of items) {
      const existingItem = await ItemModel.findOne({
        userId: userId,
        itemId: item.itemId,
        type: type,
      });
      if (existingItem) {
        existingItem.quantity = item.quantity;
        // existingItem.unit = item.unit;
        await existingItem.save();
      } else {
        await ItemModel.create({ ...item, userId: userId, type: type });
      }
    }
    const existingItems = await ItemModel.find({ userId: userId, type: type });
    for (const existingItem of existingItems) {
      const item = items.find(
        item => item.itemId.toString() === existingItem.itemId.toString(),
      );
      if (!item) {
        console.log("deleting item", type);
        await ItemModel.findByIdAndDelete(existingItem._id);
      }
    }
  } catch (e) {}
}

export async function changeItemTypes(
  userId: string,
  items: Item[],
  previousType: string,
  newType: string,
) {
  for (const item of items) {
    const currentNewTypeItem = await ItemModel.findOne({
      userId: userId,
      itemId: item.itemId,
      type: newType,
    });
    if (currentNewTypeItem) {
      currentNewTypeItem.quantity =
        parseInt(`${currentNewTypeItem.quantity}`) +
        parseInt(`${item.quantity}`);
      await currentNewTypeItem.save();
    } else {
      await ItemModel.create({
        ...item,
        userId: userId,
        type: newType,
      });
    }
  }
  const existingItems = await ItemModel.find({
    userId: userId,
    type: previousType,
  });
  for (const existingItem of existingItems) {
    await ItemModel.findByIdAndDelete(existingItem._id);
  }
}

export async function toggleLikedItem(
  userId: string,
  itemId: string,
  type: string,
) {
  const existingItem = await ItemModel.findOne({
    userId: userId,
    itemId: itemId,
    type: type,
  });
  if (existingItem) {
    await ItemModel.findByIdAndDelete(existingItem._id);
    return 0;
  } else {
    await ItemModel.create({ userId: userId, itemId: itemId, type: type });
    return 1;
  }
}
