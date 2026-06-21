import { z } from "zod";

export const sendMessageSchema = z.object({
  body: z.object({
    text: z
      .string()
      .min(1, "Message cannot be empty")
      .max(1000, "Message is too long"),
  }),
  params: z.object({
    receiverId: z.string().length(24, "Invalid user ID"), // Validates MongoDB ObjectId length
  }),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>["body"];
