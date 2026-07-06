import { Router } from "express";
import * as postController from "../controllers/post.controller";
import { protect } from "../middlewares/auth.middleware";
import { uploadMediaMiddleware } from "../middlewares/upload.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createPostSchema,
  createCommentSchema,
  updatePostSchema,
} from "../schemas/post.shema";

const router = Router();

// Every route below this line requires a valid JWT token
router.use(protect);

// Routes grouped by path
router
  .route("/")
  .post(
    uploadMediaMiddleware.single("media"),
    validate(createPostSchema),
    postController.createPost
  )
  .get(postController.getFeed);

router
  .route("/:id")
  .get(postController.getPost)
  .put(validate(updatePostSchema), postController.updatePost)
  .delete(postController.deletePost);

router.post("/:id/like", postController.toggleLike);
router.post(
  "/:id/comment",
  validate(createCommentSchema),
  postController.addComment,
);

export default router;
