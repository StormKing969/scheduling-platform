import { Router } from "express";
import {
  getAvailabilityForPublicEventController,
  getUserAvailabilityController,
  updateAvailabilityController,
} from "../controllers/availability.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const availabilityRoutes = Router();

availabilityRoutes.get(
  "/",
  passportAuthenticateJwt,
  getUserAvailabilityController,
);
availabilityRoutes.get(
  "/public/:eventId",
  getAvailabilityForPublicEventController,
);

availabilityRoutes.put(
  "/update",
  passportAuthenticateJwt,
  updateAvailabilityController,
);

export default availabilityRoutes;