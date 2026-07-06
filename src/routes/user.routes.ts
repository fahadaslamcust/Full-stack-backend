import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema, searchQuerySchema } from "../schemas/user.schema";

import * as userController from "../controllers/user.controller";
import * as connectionController from "../controllers/connection.controller";
import { uploadAvatarMiddleware } from "../middlewares/upload.middleware";

const router = Router();

// Apply the protect middleware to ALL routes in this file automatically
router.use(protect);

router.get("/me", userController.getMyProfile);
router.put(
  "/me",
  validate(updateProfileSchema),
  userController.updateMyProfile,
);
router.put(
  "/me/avatar",
  uploadAvatarMiddleware.single("avatar"),
  userController.uploadAvatar,
);

// Search must come before /:id route
router.get(
  "/search",
  validate(searchQuerySchema),
  userController.searchStudents,
);
// Connection Routes
router.get("/network/me", connectionController.getMyNetwork);
router.post("/:targetId/follow", connectionController.followUser);
router.delete("/:targetId/unfollow", connectionController.unfollowUser);

router.get("/:id", userController.getStudentProfile);

export default router;
