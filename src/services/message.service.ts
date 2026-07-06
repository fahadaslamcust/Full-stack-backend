import Conversation from "../models/Conversation";
import Message from "../models/Message";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { createNotification } from "./notification.service";
import { NotificationType } from "../models/Notification";
import { getIO } from "../socket";

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  text: string,
) => {
  if (senderId === receiverId) {
    throw new AppError("You cannot message yourself", HTTP_STATUS.BAD_REQUEST);
  }

  // 1. Check if a conversation already exists between these two users
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  // 2. If not, create a new conversation
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }

  // 3. Create the actual message
  const newMessage = await Message.create({
    conversationId: conversation._id,
    sender: senderId,
    text,
  });

  // 4. Update the conversation with the latest message for the inbox preview
  conversation.lastMessage = newMessage._id as any;
  await conversation.save();

  // Notify the receiver about the new DM
  await createNotification(
    receiverId,
    senderId,
    NotificationType.MESSAGE,
    newMessage._id.toString() as string,
  );

  const populatedMessage = await newMessage.populate("sender", "name avatar profilePicture");

  // Real-time socket emission
  const io = getIO();
  io.to(receiverId).emit("new_message", populatedMessage);
  io.to(senderId).emit("new_message", populatedMessage);

  return populatedMessage;
};

export const getMessages = async (userId: string, targetUserId: string) => {
  const conversation = await Conversation.findOne({
    participants: { $all: [userId, targetUserId] },
  });

  if (!conversation) return []; // No chat history yet

  // Fetch messages and sort by oldest to newest (standard chat behavior)
  const messages = await Message.find({ conversationId: conversation._id })
    .sort({ createdAt: 1 })
    .populate("sender", "name avatar");

  return messages;
};

export const getMyConversations = async (userId: string) => {
  const conversations = await Conversation.find({
    participants: { $in: [userId] },
  })
    .sort({ updatedAt: -1 }) // Most recently active chats first
    .populate("participants", "name avatar")
    .populate("lastMessage");

  return conversations;
};
