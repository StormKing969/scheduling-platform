import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HttpStatus } from "../config/http.config";
import { getUserAvailabilityService } from "../services/availability.service";

export const getUserAvailabilityController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const availability = await getUserAvailabilityService(userId);

    return res.status(HttpStatus.OK).json({
      message: "Availability details successfully fetched",
      availability,
    });
  },
);