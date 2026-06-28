import { Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AuthenticatedRequest } from "../types";

export const getMyProfile = async (
  req: any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: "Please upload a file" });
      return;
    }

    // req.file is automatically attached by the Multer middleware
    const user = await userService.updateAvatar(
      req.user!.id,
      req.file.filename,
    );

    res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (
  req: any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const updatedUser = await userService.updateProfile(req.user.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const searchStudents = async (
  req: any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const searchTerm = req.query.name as string;
    const students = await userService.searchUsersByName(searchTerm);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, count: students.length, data: students });
  } catch (error) {
    next(error);
  }
};

export const getStudentProfile = async (
  req: any,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
