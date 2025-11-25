import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HttpStatus } from "../config/http.config";
import {
  checkIntegrationService,
  connectAppService,
  getUserIntegrationsService,
} from "../services/integration.service";
import { asyncHandlerWithValidation } from "../middlewares/withValidation.middleware";
import { AppTypeDtO } from "../database/dto/integration.dto";

export const getUserIntegrationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const integrations = await getUserIntegrationsService(userId);

    return res.status(HttpStatus.OK).json({
      message: "User integration fetched successfully",
      integrations,
    });
  },
);

export const checkIntegrationController = asyncHandlerWithValidation(
  AppTypeDtO,
  "params",
  async (req: Request, res: Response, appTypeDto: AppTypeDtO) => {
    const userId = req.user?.id as string;
    const isConnected = await checkIntegrationService(
      userId,
      appTypeDto.appType,
    );

    return res.status(HttpStatus.OK).json({
      message: "Integration check successful",
      isConnected,
    });
  },
);

export const connectAppController = asyncHandlerWithValidation(
  AppTypeDtO,
  "params",
  async (req: Request, res: Response, appTypeDto: AppTypeDtO) => {
    const userId = req.user?.id as string;
    const { url } = await connectAppService(userId, appTypeDto.appType);

    return res.status(HttpStatus.OK).json({
      message: `Integration for ${appTypeDto.appType} completed`,
      url,
    });
  },
);