import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import z, { string } from "zod";
import { BadRequestError } from "../errors/customErrors.ts";
import ExpressError from "../utils/ExpressError.ts";
import UserModel from "../models/UserModel.ts";
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
    next();
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
    next();
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
});

export const validateReview = async (req: Request, res: Response, next: NextFunction,) => {
  try {
    ReviewSchema.parse(req.body);
    const user = await UserModel.findById(req.user.userId);
    if(!user){
      throw new BadRequestError("User not found")
    }
    if(req.body.content.length == 0){
      throw new BadRequestError("No content")
    }
    next();
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.errors.map(err => err.message).join(",");
      next(new ExpressError(msg, 400));
    } else {
      next(error);
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
//     }
//     console.log('Registration successful');
// };

// validateRegisterInput(mockRequest, mockResponse, mockNext);
