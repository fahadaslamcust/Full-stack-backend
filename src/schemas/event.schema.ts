import { z } from "zod";

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().min(10, "Provide a bit more detail").max(1000),
    date: z.coerce.date().refine((date) => date > new Date(), {
      message: "Event date must be in the future",
    }),
    location: z.string().min(2, "Location is required"),
    capacity: z.number().int().positive().optional(),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).max(1000).optional(),
    date: z.coerce
      .date()
      .refine((date) => date > new Date(), {
        message: "Event date must be in the future",
      })
      .optional(),
    location: z.string().min(2).optional(),
    capacity: z.number().int().positive().optional(),
  }),
});

export type UpdateEventInput = z.infer<typeof updateEventSchema>["body"];
export type CreateEventInput = z.infer<typeof createEventSchema>["body"];
