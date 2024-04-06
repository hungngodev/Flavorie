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