import Notification, { NotificationType } from "../models/Notification";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { getIO } from "../socket";

// This is an internal function that your other controllers will call
export const createNotification = async (
  recipientId: string,
  senderId: string,
  type: NotificationType,
  entityId?: string,
) => {
  // Don't notify a user about their own actions
  if (recipientId === senderId) return null;

  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    entityId,
  });

  const populatedNotification = await notification.populate("sender", "name avatar profilePicture");

  getIO().to(recipientId).emit("new_notification", populatedNotification);

  return populatedNotification;
};

export const getUserNotifications = async (
  userId: string,
  page: number = 1,
  limit: number = 20,
) => {
  const skip = (page - 1) * limit;

  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 }) // Newest first
    .skip(skip)
    .limit(limit)
    .populate("sender", "name avatar");
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findById(notificationId);

  if (!notification)
    throw new AppError("Notification not found", HTTP_STATUS.NOT_FOUND);

  if (notification.recipient.toString() !== userId) {
    throw new AppError(
      "Unauthorized to update this notification",
      HTTP_STATUS.FORBIDDEN,
    );
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

export const markAllAsRead = async (userId: string) => {
  await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } },
  );
  return { success: true };
};
