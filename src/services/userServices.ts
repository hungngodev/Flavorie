import { NotFoundError, UnauthenticatedError, UserCreationError } from '../errors/customErrors.ts';
import { Ingredient } from "../models/IngredientsModel.ts";
import ItemModel, { Item } from "../models/Item.ts";
import UserModel, { User } from "../models/UserModel.ts";
import { comparePassword, hashPassword } from "../utils/passwordUtils.ts";

interface UserItem extends Omit<Item, 'itemId'> {
    itemId: Ingredient;
}

export async function createUser(userDocument: User): Promise<string> {
    const { email, name } = userDocument;
    if (!email || !name) throw new UserCreationError('Email and Name are required');

    const isEmailExist = await UserModel.findOne({ email: email });
    const isNameExist = await UserModel.findOne({ name: name });
    if (isEmailExist) throw new UserCreationError('User already exists');

    const user = await UserModel.create(userDocument);
    return user._id.toString();
}


export async function authenticateCheck(userDocument: User): Promise<string> {
    const { email, password } = userDocument;
    if (!email || !password) throw new UnauthenticatedError('Email and Password are required');

    const user = await UserModel.findOne({ email: email });
    const isValidUser = user;
    if (!isValidUser) throw new NotFoundError('User not found');
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) throw new UnauthenticatedError('invalid credentials');

    return user._id.toString();
}

export async function modifyOrdinaryInfo(userId: string, reqInfo: User): Promise<void> {
    let user = await UserModel.findById(userId);
    if (!user) throw new UnauthenticatedError('User not found');
    if (reqInfo.role !== 'admin') throw new UnauthenticatedError('Not Allowed');
    if ("name" in reqInfo) user.name = reqInfo.name;
    if ("email" in reqInfo) user.email = reqInfo.email;
    if ("password" in reqInfo) user.password = await hashPassword(reqInfo.password);
    if ("lastName" in reqInfo) user.lastName = reqInfo.lastName;
    if ("location" in reqInfo) user.location = reqInfo.location;
    if ("role" in reqInfo) user.role = reqInfo.role;
    if ("avatarPublicId" in reqInfo) user.avatarPublicId = reqInfo.avatarPublicId;
    if ("preferences" in reqInfo) user.preferences = reqInfo.preferences;
    if ("allergy" in reqInfo) user.allergy = reqInfo.allergy;
    if ("diet" in reqInfo) user.diet = reqInfo.diet;
    await user.save();
}


export async function getUserItems(userId: string, type: string): Promise<UserItem[]> {
    const items = await ItemModel.find({ userId: userId, type: type }).populate<
        {
            itemId: Ingredient
        }
    >('itemId');
    return items;
}

export async function modifyUserItems(userId: string, items: Item[], type: string): Promise<void> {
    for (let item of items) {
        let existingItem = await ItemModel.findOne({ userId: userId, itemId: item.itemId, type: type });
        if (existingItem) {
            existingItem.quantity = item.quantity;
            existingItem.unit = item.unit;
            await existingItem.save();
        } else {
            await ItemModel.create({ ...item, userId: userId, type: type });
        }
    }
}