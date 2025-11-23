import { Request, Response } from "express";
import { asyncHandlerWithValidation } from "../middlewares/withValidation.middleware";
import {
  CreateEventDto,
  EventIdDto,
  UsernameAndSlugDto,
  UsernameDto,
} from "../database/dto/event.dto";
import { HttpStatus } from "../config/http.config";
import {
  createEventService,
  deleteEventService,
  getPublicEventByUsernameAndSlugService,
  getPublicEventsByUsernameService,
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
      message: "User events fetched successfully",
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
      message: `Event was successfully set to ${event.isPrivate ? "private" : "public"}`,
    });
  },
);

// Public Events
export const getPublicEventsByUsernameController = asyncHandlerWithValidation(
  UsernameDto,
  "params",
  async (req: Request, res: Response, usernameDto: UsernameDto) => {
    const { user, events } = await getPublicEventsByUsernameService(
      usernameDto.username,
    );

    return res.status(HttpStatus.OK).json({
      message: "Public events details fetched successfully",
      user,
      events,
    });
  },
);

export const getPublicEventByUsernameAndSlugController =
  asyncHandlerWithValidation(
    UsernameAndSlugDto,
    "params",
    async (
      req: Request,
      res: Response,
      usernameAndSlugDto: UsernameAndSlugDto,
    ) => {
      const event = await getPublicEventByUsernameAndSlugService(
        usernameAndSlugDto.username,
        usernameAndSlugDto.slug,
      );

      return res.status(HttpStatus.OK).json({
        message: "Event details fetched successfully",
        event,
      });
    },
  );

export const deleteEventController = asyncHandlerWithValidation(
  EventIdDto,
  "params",
  async (req: Request, res: Response, eventIdDto: EventIdDto) => {
    const userId = req.user?.id as string;
    await deleteEventService(userId, eventIdDto.eventId);

    return res.status(HttpStatus.OK).json({
      message: "Event deleted successfully",
    });
  },
);