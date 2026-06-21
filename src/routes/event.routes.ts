import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createEventSchema } from "../schemas/event.schema";

const router = Router();

router.use(protect); // All event actions require login

router
  .route("/")
  .post(validate(createEventSchema), eventController.createEvent)
  .get(eventController.getEvents);

router
  .route("/:id")
  .get(eventController.getEvent)
  .delete(eventController.deleteEvent);

router.post("/:id/rsvp", eventController.rsvpEvent);
router.delete("/:id/rsvp", eventController.cancelRsvp);

export default router;
