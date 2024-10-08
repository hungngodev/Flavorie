import { BadRequestError, ExpressError } from "@src/errors/customErrors";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { default as z } from "zod";

// login
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
    return next();
  } catch (error) {
    throw new BadRequestError("Invalid input");
  }
};

// register
export const registerData = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(6),
  reEnterPassword: z.string().min(6),
});

export const validateRegisterInput = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = registerData.parse(req.body);
    if (data.password !== data.reEnterPassword) {
      throw new BadRequestError("Please re-enter your password correctly");
    }
    return next();
  } catch (error) {
    console.error("Error caught in validateRegisterInput:", error);
    throw new BadRequestError("Password does not match");
  }
};

// reivew
const ReviewSchema = z.object({
  userId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid userId",
  }),
  postId: z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid postId",
  }),
  content: z.string().nonempty({ message: "Content is required" }),
  timestamp: z.date().default(new Date()),
  childrenReview: z
    .array(
      z.string().refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid childrenReview id",
      }),
    )
    .optional(),
  parentReview: z
    .string()
    .nullable()
    .refine(val => val === null || mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid parentReview id",
    })
    .optional(),
});

export const validateReview = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    ReviewSchema.parse(req.body);
    return next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.errors.map(err => err.message).join(",");
      return next(new ExpressError(msg, 400));
    } else {
      return next(error);
    }
  }
};

// mock data for register
// const sampleRegis = {
//     username: "Sophie",
//     email: "sophie.abc@gmail.com",
//     password: "12345678",
//     reEnterPassword: "12345678",
// };

// console.log(sampleRegis);
// const mockRequest = { body: sampleRegis } as Request;
// const mockResponse = {} as Response;
// const mockNext: NextFunction = (error?: any) => {
//     if (error) {
//         console.error("Error caught in validateRegisterInput:", error);
//         return;
//         return;
//     }
//     console.log('Registration successful');
//     console.log('Registration successful');
// };

// validateRegisterInput(mockRequest, mockResponse, mockNext);
