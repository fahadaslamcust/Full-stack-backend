import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { HTTP_STATUS } from "../constants/httpStatus";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
