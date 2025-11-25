import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HttpStatus } from "../config/http.config";
import { getUserIntegrationsService } from "../services/integration.service";

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