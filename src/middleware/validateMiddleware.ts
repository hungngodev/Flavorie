import { NextFunction, Request, Response } from "express";
import z from "zod";
import { BadRequestError } from "../errors/customErrors.ts";

export const logInData = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export const validateLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    logInData.parse(req.body);
    next();
  } catch (error) {
    throw new BadRequestError("Invalid input");
  }
};
