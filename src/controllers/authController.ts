import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.ts";
import { checkLogin, createUser } from "../services/userServices.ts";

export const register = async (req: Request, res: Response) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  (req.body as any).role = "user";

  const token = await createUser(req.body);
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });
  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};
export const login = async (req: Request, res: Response) => {
  const token = await checkLogin(req.body);

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ msg: "user logged in" });
};

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
