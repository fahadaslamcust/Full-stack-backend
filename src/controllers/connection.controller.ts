import { Response, NextFunction } from "express";
import * as connectionService from "../services/connection.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AuthenticatedRequest } from "../types";

export const followUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await connectionService.followUser(
      req.user!.id,
      req.params.targetId.toString(),
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Successfully followed user" });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await connectionService.unfollowUser(
      req.user!.id,
      req.params.targetId.toString(),
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Successfully unfollowed user" });
  } catch (error) {
    next(error);
  }
};

export const getMyNetwork = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const network = await connectionService.getNetwork(req.user!.id);
    res.status(HTTP_STATUS.OK).json({ success: true, data: network });
  } catch (error) {
    next(error);
  }
};
