import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
  createEventController,
  getUserEventsController,
  toggleEventPrivacyController,
} from "../controllers/event.controller";

const eventRoutes = Router();

eventRoutes.post("/create", passportAuthenticateJwt, createEventController);
eventRoutes.get("/all", passportAuthenticateJwt, getUserEventsController);

eventRoutes.put(
  "/toggle-privacy",
  passportAuthenticateJwt,
  toggleEventPrivacyController,
);

export default eventRoutes;