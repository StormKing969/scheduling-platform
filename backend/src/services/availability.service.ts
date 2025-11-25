import { AppDataSource } from "../config/database.config";
import { User } from "../database/entities/user.entity";
import { NotFoundException } from "../utils/app-error";
import { UpdateAvailabilityDto } from "../database/dto/availability.dto";
import { Availability } from "../database/entities/availability.entity";
import { DayOfWeekEnum } from "../database/entities/day-availability.entity";
import { Event } from "../database/entities/event.entity";
import { addDays, addMinutes, format, parseISO } from "date-fns";

function getNextDateForDay(dayOfWeek: string): Date {
  const days = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const today = new Date();
  const todayDay = today.getDay();
  const targetDay = days.indexOf(dayOfWeek);
  const daysUntilTarget = (targetDay - todayDay + 7) % 7;

  return addDays(today, daysUntilTarget);
}

function generateAvailableTimeSlots(
  startTime: Date,
  endTime: Date,
  duration: number,
  meetings: { startTime: Date; endTime: Date }[],
  dateStr: string,
  timeGap: number = 30,
) {
  const slots = [];

  let slotStartTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`,
  );
  let slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`,
  );
  const now = new Date();
  const isToday = format(now, "yyyy-MM-dd") === dateStr;
  while (slotStartTime < slotEndTime) {
    if (!isToday || slotStartTime >= now) {
      const slotEnd = new Date(slotStartTime.getTime() + duration * 60000);
      if (isSlotAvailable(slotStartTime, slotEnd, meetings)) {
        slots.push(format(slotStartTime, "HH:mm"));
      }
    }

    slotStartTime = addMinutes(slotStartTime, timeGap);
  }

  return slots;
}

function isSlotAvailable(
  slotStart: Date,
  slotEnd: Date,
  meetings: { startTime: Date; endTime: Date }[],
): boolean {
  for (const meeting of meetings) {
    if (slotStart < meeting.endTime && slotEnd > meeting.startTime) {
      return false;
    }
  }

  return true;
}

export const getUserAvailabilityService = async (userId: string) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ["availability", "availability.days"],
  });
  if (!user || !user.availability) {
    throw new NotFoundException("User/Availability not found");
  }

  const formatTime = (date: Date) => date.toISOString().slice(11, 16);

  return {
    timeGap: user.availability.timeGap,
    days: user.availability.days.map(
      ({ day, startTime, endTime, isAvailable }) => ({
        day,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        isAvailable,
      }),
    ),
  };
};

export const updateAvailabilityService = async (
  userId: string,
  updateAvailabilityDto: UpdateAvailabilityDto,
) => {
  const userRepository = AppDataSource.getRepository(User);
  const availabilityRepository = AppDataSource.getRepository(Availability);
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ["availability", "availability.days"],
  });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  const dayAvailabilityData = updateAvailabilityDto.days.map(
    ({ day, isAvailable, startTime, endTime }) => {
      const baseDate = new Date().toISOString().split("T")[0];
      return {
        day: day.toUpperCase() as DayOfWeekEnum,
        startTime: new Date(`${baseDate}T${startTime}:00Z`),
        endTime: new Date(`${baseDate}T${endTime}:00Z`),
        isAvailable,
      };
    },
  );
  if (user.availability) {
    await availabilityRepository.save({
      id: user.availability.id,
      timeGap: updateAvailabilityDto.timeGap,
      days: dayAvailabilityData.map((ele) => ({
        ...ele,
        availability: { id: user.availability.id },
      })),
    });
  }

  return { success: true };
};

export const getAvailabilityForPublicEventService = async (eventId: string) => {
  const eventRepository = AppDataSource.getRepository(Event);
  const event = await eventRepository.findOne({
    where: { id: eventId, isPrivate: false },
    relations: [
      "user",
      "user.availability",
      "user.availability.days",
      "user.meetings",
    ],
  });
  if (!event || !event.user.availability) {
    return [];
  }

  const { availability, meetings } = event.user;
  const daysOfWeek = Object.values(DayOfWeekEnum);
  const availableDays = [];
  for (const dayOfWeek of daysOfWeek) {
    const nextDate = getNextDateForDay(dayOfWeek);
    const dayAvailability = availability.days.find((d) => d.day === dayOfWeek);
    if (dayAvailability) {
      const slots = dayAvailability.isAvailable
        ? generateAvailableTimeSlots(
            dayAvailability.startTime,
            dayAvailability.endTime,
            event.duration,
            meetings,
            format(nextDate, "yyyy-MM-dd"),
            availability.timeGap,
          )
        : [];

      availableDays.push({
        day: dayOfWeek,
        slots,
        isAvailable: dayAvailability.isAvailable,
      });
    }
  }

  return availableDays;
};