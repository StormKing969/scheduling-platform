import {Router} from "express";
import {passportAuthenticateJwt} from "../config/passport.config";
import {getUserIntegrationsController} from "../controllers/integration.controller";

const integrationRoutes = Router();

integrationRoutes.get("/all", passportAuthenticateJwt, getUserIntegrationsController)

export default integrationRoutes;