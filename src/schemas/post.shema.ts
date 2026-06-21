import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1, "Post content cannot be empty")
      .max(2000, "Post is too long"),
  }),
});

export const createCommentSchema = z.object({
  body: z.object({
    text: z
      .string()
      .min(1, "Comment cannot be empty")
      .max(500, "Comment is too long"),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>["body"];
export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];
