import Event from "../models/Event";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { CreateEventInput } from "../schemas/event.schema";
import { UpdateEventInput } from "../schemas/event.schema";
import { createNotification } from "./notification.service";
import { NotificationType } from "../models/Notification";

export const createEvent = async (userId: string, data: CreateEventInput) => {
  const event = await Event.create({
    ...data,
    organizer: userId,
    attendees: [userId], // The organizer is attending by default!
  });
  return await event.populate("organizer", "name avatar");
};

export const updateEvent = async (
  eventId: string,
  userId: string,
  data: UpdateEventInput,
) => {
  const event = await Event.findById(eventId);
  if (!event) throw new AppError("Event not found", HTTP_STATUS.NOT_FOUND);

  if (event.organizer.toString() !== userId) {
    throw new AppError(
      "You can only edit events you organized",
      HTTP_STATUS.FORBIDDEN,
    );
  }

  // Object.assign safely updates only the fields provided in 'data'
  Object.assign(event, data);
  await event.save();

  // Notify the event organizer that someone RSVP'd
  await createNotification(
    event.organizer.toString(),
    userId,
    NotificationType.EVENT_RSVP,
    event._id.toString() as string,
  );

  return event;
};

export const getUpcomingEvents = async (
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;
  return await Event.find({ date: { $gte: new Date() } }) // Only fetch future events
    .sort({ date: 1 }) // Sort by soonest first
    .skip(skip)
    .limit(limit)
    .populate("organizer", "name avatar")
    .populate("attendees", "name avatar");
};

export const getEventById = async (eventId: string) => {
  const event = await Event.findById(eventId)
    .populate("organizer", "name avatar")
    .populate("attendees", "name avatar");

  if (!event) throw new AppError("Event not found", HTTP_STATUS.NOT_FOUND);
  return event;
};

export const deleteEvent = async (eventId: string, userId: string) => {
  const event = await Event.findById(eventId);
  if (!event) throw new AppError("Event not found", HTTP_STATUS.NOT_FOUND);

  // Strict comparison
  if (event.organizer.toString() !== userId) {
    throw new AppError(
      "You can only delete events you created",
      HTTP_STATUS.FORBIDDEN,
    );
  }

  await event.deleteOne();
  return true;
};

export const rsvpToEvent = async (eventId: string, userId: string) => {
  const event = await Event.findById(eventId);
  if (!event) throw new AppError("Event not found", HTTP_STATUS.NOT_FOUND);

  // 1. Check if event has already passed
  if (event.date < new Date()) {
    throw new AppError("Cannot RSVP to a past event", HTTP_STATUS.BAD_REQUEST);
  }

  // 2. Check if user is already attending
  const isAttending = event.attendees.some((id) => id.toString() === userId);
  if (isAttending) {
    throw new AppError(
      "You are already attending this event",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  // 3. Check Capacity
  if (event.capacity && event.attendees.length >= event.capacity) {
    throw new AppError(
      "This event is at full capacity",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  event.attendees.push(userId as any);
  await event.save();
  return event;
};

export const cancelRsvp = async (eventId: string, userId: string) => {
  const event = await Event.findById(eventId);
  if (!event) throw new AppError("Event not found", HTTP_STATUS.NOT_FOUND);

  if (event.organizer.toString() === userId) {
    throw new AppError(
      "The organizer cannot cancel their RSVP. Delete the event instead.",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  event.attendees = event.attendees.filter(
    (id) => id.toString() !== userId,
  ) as any;
  await event.save();
  return event;
};
