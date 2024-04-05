import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { Schema } from 'mongoose';


const secret: Secret = process.env.JWT_SECRET || '';
const expireIn: string | number | undefined = process.env.JWT_EXPIRES_IN;

export type Payload = {
    userId: string;
    role: string;
};

export const createJWT = (payload: Payload) => {
    const token = jwt.sign(payload, secret, {
        expiresIn: expireIn,
    } as SignOptions);
    return token;
};

export const verifyJWT = (token: string): Payload => {
    const decoded = jwt.verify(token, secret) as Payload;
    return decoded;
};
