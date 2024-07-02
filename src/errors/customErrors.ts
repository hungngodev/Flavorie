import { StatusCodes } from "http-status-codes";

interface CustomError extends Error {
  statusCode: number;
}

export class NotFoundError extends Error {
  statusCode: number; // Add the statusCode property
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

export class ServerError extends Error {
  statusCode: number; // Add the statusCode property
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
export class BadRequestError extends Error {
  statusCode: number; // Add the statusCode property
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export class UnauthenticatedError extends Error {
  statusCode: number; // Add the statusCode property
  constructor(message: string) {
    super(message);
    this.name = "UnauthenticatedError";
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number; // Add the statusCode property
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
export class UserCreationError extends Error {
  statusCode: number; // Add the statusCode property
  constructor(message: string) {
    super(message);
    this.name = "UserCreationError";
    this.statusCode = StatusCodes.CONFLICT;
  }
}

export class ForbiddenError extends Error {
  statusCode: number; // Add the statusCode property
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenError";
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
export class PostError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.name = "PostError";
    this.statusCode = StatusCodes.NOT_ACCEPTABLE;
  }
}

export class ExpressError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
