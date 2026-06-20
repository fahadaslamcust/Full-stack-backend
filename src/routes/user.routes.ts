import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema, searchQuerySchema } from "../schemas/user.schema";

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

export default router;
