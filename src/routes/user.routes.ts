import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema, searchQuerySchema } from "../schemas/user.schema";

import * as userController from "../controllers/user.controller";
import * as connectionController from "../controllers/connection.controller";

const router = Router();

// Apply the protect middleware to ALL routes in this file automatically
router.use(protect);

router.get("/me", userController.getMyProfile);
router.put(
  "/me",
  validate(updateProfileSchema),
  userController.updateMyProfile,
);

// Search must come before /:id route
router.get(
  "/search",
  validate(searchQuerySchema),
  userController.searchStudents,
);
router.get("/:id", userController.getStudentProfile);

// Connection Routes
router.get("/network/me", connectionController.getMyNetwork);
router.post("/:targetId/follow", connectionController.followUser);
router.delete("/:targetId/unfollow", connectionController.unfollowUser);

export default router;
