import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    bio: z.string().max(250, "Bio cannot exceed 250 characters").optional(),
    avatar: z.string().url("Avatar must be a valid URL").optional(),
  }),
});

export const searchQuerySchema = z.object({
  query: z.object({
    name: z.string().optional(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
