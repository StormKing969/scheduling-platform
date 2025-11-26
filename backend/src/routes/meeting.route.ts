import { Router } from "express";
import {
  cancelMeetingController,
  createMeetingBookingForGuestController,
  getUserMeetingsController,
} from "../controllers/meeting.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const meetingRoutes = Router();

meetingRoutes.get(
  "/user/all",
  passportAuthenticateJwt,
  getUserMeetingsController,
);

meetingRoutes.post("/public/create", createMeetingBookingForGuestController);

meetingRoutes.put(
  "/cancel/:meetingId",
  passportAuthenticateJwt,
  cancelMeetingController,
);

export default meetingRoutes;