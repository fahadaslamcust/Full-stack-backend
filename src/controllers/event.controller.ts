import { Response, NextFunction } from "express";
import * as eventService from "../services/event.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AuthenticatedRequest } from "../types";

export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const event = await eventService.createEvent(req.user!.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const event = await eventService.updateEvent(
      req.params.id.toString(),
      req.user!.id,
      req.body,
    );
    res.status(HTTP_STATUS.OK).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await eventService.getUpcomingEvents(page, limit);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, count: events.length, data: events });
  } catch (error) {
    next(error);
  }
};

export const getEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const event = await eventService.getEventById(req.params.id.toString());
    res.status(HTTP_STATUS.OK).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await eventService.deleteEvent(req.params.id.toString(), req.user!.id);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const rsvpEvent = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await eventService.rsvpToEvent(req.params.id.toString(), req.user!.id);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "RSVP successful" });
  } catch (error) {
    next(error);
  }
};

export const cancelRsvp = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await eventService.cancelRsvp(req.params.id.toString(), req.user!.id);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "RSVP cancelled" });
  } catch (error) {
    next(error);
  }
};
