import { AppDataSource } from "../config/database.config";
import { CreateEventDto } from "../database/dto/event.dto";
import {
  Event,
  EventLocationEnumType,
} from "../database/entities/event.entity";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { slugify } from "../utils/helper";
import { User } from "../database/entities/user.entity";

export const createEventService = async (
  userId: string,
  createEventDto: CreateEventDto,
) => {
  const eventRepository = AppDataSource.getRepository(Event);
  if (
    !Object.values(EventLocationEnumType)?.includes(createEventDto.locationType)
  ) {
    throw new BadRequestException("Invalid location type");
  }

  const slug = slugify(createEventDto.title);
  const event = eventRepository.create({
    ...createEventDto,
    slug,
    user: { id: userId },
  });
  await eventRepository.save(event);

  return event;
};

export const getUserEventsService = async (userId: string) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.events", "event")
    .loadRelationCountAndMap("event._count.meetings", "event.meetings")
    .where("user.id = :userId", { userId })
    .orderBy("event.createdAt", "DESC")
    .getOne();
  if (!user) {
    throw new NotFoundException("User not found");
  }

  return {
    events: user.events,
    username: user.username,
  };
};

export const toggleEventPrivacyService = async (
  userId: string,
  eventId: string,
) => {
  const eventRepository = AppDataSource.getRepository(Event);
  const event = await eventRepository.findOne({
    where: { id: eventId, user: { id: userId } },
  });
  if (!event) {
    throw new NotFoundException("Event not found");
  }

  event.isPrivate = !event.isPrivate;
  await eventRepository.save(event);

  return event;
};