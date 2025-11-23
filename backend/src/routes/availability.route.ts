import { Router } from "express";
import { getUserAvailabilityController } from "../controllers/availability.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const availabilityRoutes = Router();

availabilityRoutes.get(
  "/",
  passportAuthenticateJwt,
  getUserAvailabilityController,
);

export default availabilityRoutes;