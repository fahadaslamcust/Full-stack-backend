import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../constants/httpStatus";
import { ENV } from "../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  if (ENV.NODE_ENV === "development") {
    res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    // Production mode: Hide ugly stack traces from regular users
    res.status(statusCode).json({
      success: false,
      message: err.isOperational
        ? err.message
        : "Something went wrong on our end!",
    });
  }
};
