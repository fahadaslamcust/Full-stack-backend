import { Response, NextFunction } from "express";
import * as messageService from "../services/message.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AuthenticatedRequest } from "../types";

export const sendMessage = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const message = await messageService.sendMessage(
      req.user!.id,
      req.params.receiverId.toString(),
      req.body.text,
    );
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const messages = await messageService.getMessages(
      req.user!.id,
      req.params.targetUserId.toString(),
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    next(error);
  }
};

export const getInbox = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const conversations = await messageService.getMyConversations(req.user!.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};
