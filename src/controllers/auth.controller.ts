import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "../utils/AppError";

export const facebookAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AppError("Facebook token is required", HTTP_STATUS.BAD_REQUEST);
    }

    const result = await authService.facebookSignUp(token);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Facebook authentication successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.body;
    
    if (!token) {
      throw new AppError('Google token is required', HTTP_STATUS.BAD_REQUEST);
    }
    
    const result = await authService.googleSignUp(token);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Google authentication successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

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

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.verifyEmail(
      req.params.token.toString() as string,
    );
    res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    next(error);
  }
};
