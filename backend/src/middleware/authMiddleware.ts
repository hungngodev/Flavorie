import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "@src/errors/customErrors";
import Review from "@src/models/Review";
import { verifyJWT } from "@src/utils/tokenUtils";
import { NextFunction, Request, Response } from "express";

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { flavorie_session_token } = req.cookies;
  const token = flavorie_session_token;
  if (!token) {
    throw new UnauthenticatedError("authentication invalid");
  }

  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === "64b2c07ccac2efc972ab0eca";
    (req as any).user = { userId, role, testUser };
    return next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

export const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const { flavorie_session_token } = req.cookies;
  const token = flavorie_session_token;
  if (token) {
    try {
      const { userId, role, ...res } = verifyJWT(token);
      const testUser = userId === "64b2c07ccac2efc972ab0eca";
      (req as any).user = { userId, role, testUser };
    } catch (error) {}
  }

  next();
};

export const authorizePermissions = (...roles: string[]) => {
  return (
    req: Request & { user: { role: string } },
    res: Response,
    next: NextFunction,
  ) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError("Unauthorized to access this route");
    }
    next();
  };
};

export const checkForTestUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if ((req as any).user?.testUser) {
    throw new BadRequestError("Demo User. Read Only!");
  }
  next();
};

export const authorizeReviewOwner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { reviewId } = req.params;
  const userId = (req as any).user?.userId;

  if (!userId) {
    return res.status(401).send("Authentication invalid"); // Use 401 for unauthorized access
  }

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).send({ error: "Review not found" });
    }

    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .send("You do not have permission to perform this action");
    }

    return next();
  } catch (error) {
    return res.status(500).send("Server error");
  }
};
