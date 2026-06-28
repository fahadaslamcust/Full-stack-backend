import { Router } from "express";
import * as notificationController from "../controllers/notification.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.use(protect); // Must be logged in

router.get("/", notificationController.getNotifications);
router.put("/read-all", notificationController.markAllAsRead);
router.put("/:id/read", notificationController.markAsRead);

export default router;
