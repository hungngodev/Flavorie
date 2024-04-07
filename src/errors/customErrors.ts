import { StatusCodes } from 'http-status-codes';

export class NotFoundError extends Error {
    statusCode: number; // Add the statusCode property
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}
export class BadRequestError extends Error {
    statusCode: number; // Add the statusCode property
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export class UnauthenticatedError extends Error {
    statusCode: number; // Add the statusCode property
    constructor(message: string) {
        super(message);
        this.name = 'UnauthenticatedError';
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export class UnauthorizedError extends Error {
    statusCode: number; // Add the statusCode property
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}
export class UserCreationError extends Error {
    statusCode: number; // Add the statusCode property
    constructor(message: string) {
        super(message);
        this.name = 'UserCreationError';
        this.statusCode = StatusCodes.CONFLICT;
    }
}

