import { Router } from "express";
import * as messageController from "../controllers/message.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { sendMessageSchema } from "../schemas/message.schema";

const router = Router();

router.use(protect); // All messaging requires auth

// Get all active conversations (Inbox view)
router.get("/inbox", messageController.getInbox);

// Get chat history with a specific user
router.get("/:targetUserId", messageController.getMessages);

// Send a message to a specific user
router.post(
  "/send/:receiverId",
  validate(sendMessageSchema),
  messageController.sendMessage,
);

export default router;
