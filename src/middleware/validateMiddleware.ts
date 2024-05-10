import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { BadRequestError } from '../errors/customErrors.ts';

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

// mock data
const sampleRegis = {
    username: "Sophie",
    email: "sophie.abc@gmail.com",
    password: "12345678",
    reEnterPassword: "12345605",
};

console.log(sampleRegis);
const mockRequest = { body: sampleRegis } as Request;
const mockResponse = {} as Response;
const mockNext: NextFunction = (error?: any) => {
    if (error) {
        console.error("Error caught in validateRegisterInput:", error);
        return; 
    }
    console.log('Registration successful'); 
};

validateRegisterInput(mockRequest, mockResponse, mockNext);


