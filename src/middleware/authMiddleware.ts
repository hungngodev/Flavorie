import {
    UnauthenticatedError,
    UnauthorizedError,
    BadRequestError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/tokenUtils.js';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            user: {
                userId: string;
                role: string;
                testUser: boolean;
            };
        }
    }
}

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) throw new UnauthenticatedError('authentication invalid');

    try {
        const { userId, role, ...res } = verifyJWT(token);
        console.log(userId, role, res);
        const testUser = userId === '64b2c07ccac2efc972ab0eca';
        req.user = { userId, role, testUser };
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
        try {
            const { userId, role, ...res } = verifyJWT(token);
            const testUser = userId === '64b2c07ccac2efc972ab0eca';
            req.user = { userId, role, testUser };
        } catch (error) {
        }
    };
    next();
}

export const authorizePermissions = (...roles: string[]) => {
    return (req: Request & { user: { role: string } }, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};

export const checkForTestUser = (req: Request, res: Response, next: NextFunction) => {
    if ((req as any).user?.testUser) throw new BadRequestError('Demo User. Read Only!');
    next();
};
