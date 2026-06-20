import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import User from "../models/User";
import { AuthenticatedRequest } from "../types"; // assuming custom types folder or declared alias

interface JwtPayload {
  id: string;
}

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in.", HTTP_STATUS.UNAUTHORIZED),
      );
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

    const currentUser = await User.findById(decoded.id).select("-password");
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token no longer exists.",
          HTTP_STATUS.UNAUTHORIZED,
        ),
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return next(
      new AppError("Invalid or expired token.", HTTP_STATUS.UNAUTHORIZED),
    );
  }
};
