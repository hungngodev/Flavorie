import { StatusCodes } from 'http-status-codes';
import User from '../models/UserModel.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.ts';
import { UnauthenticatedError } from '../errors/customErrors.ts';
import { createJWT } from '../utils/tokenUtils.ts';
import { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
    const isFirstAccount = (await User.countDocuments()) === 0;
    (req.body as any).role = isFirstAccount ? 'admin' : 'user';

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    const token = createJWT({ userId: user._id.toString(), role: user.role });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(StatusCodes.CREATED).json({ msg: 'user created' });
};
export const login = async (req: Request, res: Response) => {
    const user = await User.findOne({ email: req.body.email });

    const isValidUser = user;

    if (!isValidUser) throw new UnauthenticatedError('Not Found');

    const isValidPassword = (await comparePassword(req.body.password, user.password ?? ''));

    if (!isValidPassword) throw new UnauthenticatedError('invalid credentials');

    const token = createJWT({ userId: user._id.toString(), role: user.role });

    const oneDay = 1000 * 60 * 60 * 24;

    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged in' });
};

export const logout = (req: Request, res: Response) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
