import UserModel, { User } from "../models/UserModel.ts";
import { hashPassword, comparePassword } from "../utils/passwordUtils.ts";
import { UnauthenticatedError, UserCreationError } from '../errors/customErrors.ts';
import { createJWT } from '../utils/tokenUtils.ts';

export async function createUser(userDocument: User): Promise<string> {
    const { email, name } = userDocument;
    if (!email || !name) throw new UserCreationError('Email and Name are required');

    const isEmailExist = await UserModel.findOne({ email: email });
    const isNameExist = await UserModel.findOne({ name: name });
    if (isEmailExist || isNameExist) throw new UserCreationError('User already exists');

    const user = await UserModel.create(userDocument);
    const token = createJWT({ userId: user._id.toString(), role: user.role });

    return token;
}


export async function checkLogin(userDocument: User): Promise<string> {
    const { email, password } = userDocument;
    if (!email || !password) throw new UnauthenticatedError('Email and Password are required');

    const user = await UserModel.findOne({ email: email });

    const isValidUser = user;
    if (!isValidUser) throw new UnauthenticatedError('Not Found');
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) throw new UnauthenticatedError('invalid credentials');

    const token = createJWT({ userId: user._id.toString(), role: user.role });

    return token;
}

type UserValueTypes = {
    [K in keyof User]: User[K];
}[keyof User];


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


export async function modifyLeftOver(userId: string, reqInfo: User): Promise<void> {
    let user = await UserModel.findById(userId);
    if (!user) throw new UnauthenticatedError('User not found');
    for (let i = 0; i < reqInfo.leftOver.length; i++) {
        user.leftOver.push(reqInfo.leftOver[i]);
    }
    await user.save();
}