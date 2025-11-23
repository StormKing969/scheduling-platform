import { Request, Response } from "express";
import { asyncHandlerWithValidation } from "../middlewares/withValidation.middleware";
import { CreateEventDto, EventIdDto } from "../database/dto/event.dto";
import { HttpStatus } from "../config/http.config";
import {
  createEventService,
  getUserEventsService,
  toggleEventPrivacyService,
} from "../services/event.service";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const createEventController = asyncHandlerWithValidation(
  CreateEventDto,
  "body",
  async (req: Request, res: Response, createEventDto: CreateEventDto) => {
    const userId = req.user?.id as string;
    const event = await createEventService(userId, createEventDto);

    return res.status(HttpStatus.CREATED).json({
      message: "Event created successfully",
      event,
    });
  },
);

export const getUserEventsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { events, username } = await getUserEventsService(userId);

    return res.status(HttpStatus.OK).json({
      message: "User's events fetched successfully",
      data: {
        events,
        username,
      },
    });
  },
);

export const toggleEventPrivacyController = asyncHandlerWithValidation(
  EventIdDto,
  "body",
  async (req: Request, res: Response, eventIdDto: EventIdDto) => {
    const userId = req.user?.id as string;
    const event = await toggleEventPrivacyService(userId, eventIdDto.eventId);

    return res.status(HttpStatus.OK).json({
      message: `Event was successfully set to ${event.isPrivate ? "Private" : "Public"}`,
    });
  },
);