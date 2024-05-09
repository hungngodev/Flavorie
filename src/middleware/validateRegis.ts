import z from "zod";
import { BadRequestError } from "@/errors/customErrors";
import { NextFunction } from "express";
import { register } from "module";

export const regisData = z.object({
    username: z.string().min(4),
    email: z.string().email(),
    password: z.string().min(6),
    reEnterPassword: z.string().min(6),
});

export const validateRegisterInput = (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = regisData.parse(req.body);
        if (data.password !== data.reEnterPassword) {
            throw new BadRequestError('Please re-enter your password correctly');
        }

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new BadRequestError('Invalid input');
        } else {
            throw new BadRequestError('Internal server error');
        }
    }
};

