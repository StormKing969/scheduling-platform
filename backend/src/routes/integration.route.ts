import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
  checkIntegrationController,
  connectAppController,
  getUserIntegrationsController,
} from "../controllers/integration.controller";

const integrationRoutes = Router();

integrationRoutes.get(
  "/all",
  passportAuthenticateJwt,
  getUserIntegrationsController,
);
integrationRoutes.get(
  "/check/:appType",
  passportAuthenticateJwt,
  checkIntegrationController,
);
integrationRoutes.get(
  "/connect/:appType",
  passportAuthenticateJwt,
  connectAppController,
);

export default integrationRoutes;