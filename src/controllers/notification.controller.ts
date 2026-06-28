import { Response, NextFunction } from "express";
import * as notificationService from "../services/notification.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AuthenticatedRequest } from "../types";

export const getNotifications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const notifications = await notificationService.getUserNotifications(
      req.user!.id,
      page,
      limit,
    );

    // Calculate how many are unread for the UI badge
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id.toString(),
      req.user!.id,
    );
    res.status(HTTP_STATUS.OK).json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await notificationService.markAllAsRead(req.user!.id);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};
