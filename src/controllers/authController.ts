import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.ts";
import UserModel from "../models/UserModel.ts";
import { authenticateCheck, createUser } from "../services/userServices.ts";
import { createJWT } from "../utils/tokenUtils.ts";

function createCookie(token: string, res: Response) {
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("flavorie_session_token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    sameSite: "lax",
  });
}

export const checkAuth = async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(StatusCodes.OK).send({ msg: "Unauthorized" });
    return;
  }
  const user = await UserModel.findById(req.user.userId);
  if (user) {
    res.status(StatusCodes.OK).send({ user });
  } else {
    throw new NotFoundError("User not found");
  }
};

export const register = async (req: Request, res: Response) => {
  req.body.role = "user";
  const userId = await createUser(req.body);
  const token = createJWT({ userId, role: "user" });
  createCookie(token, res);
  res.status(StatusCodes.CREATED).json({ msg: "user created" });
};

export const login = async (req: Request, res: Response) => {
  const userId = await authenticateCheck(req.body);
  const token = createJWT({ userId, role: "user" });
  createCookie(token, res);
  res.status(StatusCodes.OK).json({ msg: "user logged in" });
};

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
