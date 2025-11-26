import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HttpStatus } from "../config/http.config";
import {
  MeetingFilterEnum,
  MeetingFilterEnumType,
} from "../enums/meeting.enum";
import {
  cancelMeetingService,
  createMeetingBookingForGuestService,
  getUserMeetingsService,
} from "../services/meeting.service";
import { asyncHandlerWithValidation } from "../middlewares/withValidation.middleware";
import { CreateMeetingDto, MeetingIdDtO } from "../database/dto/meeting.dto";

export const getUserMeetingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const filter =
      (req.query.filter as MeetingFilterEnumType) || MeetingFilterEnum.UPCOMING;
    const meetings = await getUserMeetingsService(userId, filter);

    return res.status(HttpStatus.OK).json({
      message: "User meetings fetched successfully",
      meetings,
    });
  },
);

// Public Use
export const createMeetingBookingForGuestController =
  asyncHandlerWithValidation(
    CreateMeetingDto,
    "body",
    async (req: Request, res: Response, createMeetingDto: CreateMeetingDto) => {
      const { meeting, meetLink } =
        await createMeetingBookingForGuestService(createMeetingDto);

      return res.status(HttpStatus.OK).json({
        message: "Meeting scheduled successfully",
        data: {
          meeting,
          meetLink,
        },
      });
    },
  );

export const cancelMeetingController = asyncHandlerWithValidation(
  MeetingIdDtO,
  "params",
  async (req: Request, res: Response, meetingIdDto: MeetingIdDtO) => {
    await cancelMeetingService(meetingIdDto.meetingId);
    return res.status(HttpStatus.OK).json({
      message: "Meeting cancelled successfully",
    });
  },
);