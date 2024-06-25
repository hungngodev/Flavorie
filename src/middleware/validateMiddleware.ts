import { NextFunction, Request, Response } from "express";
import z from "zod";
import { BadRequestError } from "../errors/customErrors.ts";
import { ReviewSchema } from "../models/Review.ts"
import ExpressError from "../utils/ExpressError.ts";

// login
export const logInData = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const validateLoginInput = (req: Request, res: Response, next: NextFunction) => {
    try {
        logInData.parse(req.body);
        next();
    }
    catch (error) {
        throw new BadRequestError('Invalid input');
    }

}

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
    } 
        catch (error) {
            console.error("Error caught in validateRegisterInput:", error);
            throw new BadRequestError('Password does not match');
        } 
};

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
    const { error } = ReviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
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

