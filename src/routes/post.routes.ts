import { Router } from "express";
import * as postController from "../controllers/post.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createPostSchema, createCommentSchema } from "../schemas/post.shema";

const router = Router();

// Every route below this line requires a valid JWT token
router.use(protect);

// Routes grouped by path
router
  .route("/")
  .post(validate(createPostSchema), postController.createPost)
  .get(postController.getFeed);

router
  .route("/:id")
  .get(postController.getPost)
  .delete(postController.deletePost);

router.post("/:id/like", postController.toggleLike);
router.post(
  "/:id/comment",
  validate(createCommentSchema),
  postController.addComment,
);

export default router;
