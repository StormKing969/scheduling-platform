import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HttpStatus } from "../config/http.config";
import {
  getAvailabilityForPublicEventService,
  getUserAvailabilityService,
  updateAvailabilityService,
} from "../services/availability.service";
import { asyncHandlerWithValidation } from "../middlewares/withValidation.middleware";
import { UpdateAvailabilityDto } from "../database/dto/availability.dto";
import { EventIdDto } from "../database/dto/event.dto";

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

export const updateAvailabilityController = asyncHandlerWithValidation(
  UpdateAvailabilityDto,
  "body",
  async (
    req: Request,
    res: Response,
    updateAvailabilityDto: UpdateAvailabilityDto,
  ) => {
    const userId = req.user?.id as string;
    await updateAvailabilityService(userId, updateAvailabilityDto);

    return res.status(HttpStatus.OK).json({
      message: "Availability details successfully updated",
    });
  },
);

// For Public Event
export const getAvailabilityForPublicEventController =
  asyncHandlerWithValidation(
    EventIdDto,
    "params",
    async (req: Request, res: Response, eventIdDto: EventIdDto) => {
      const availability = await getAvailabilityForPublicEventService(
        eventIdDto.eventId,
      );

      return res.status(HttpStatus.OK).json({
        message: "Event details successfully fetched",
        data: availability,
      });
    },
  );