import { AppDataSource } from "../config/database.config";
import { User } from "../database/entities/user.entity";
import { NotFoundException } from "../utils/app-error";

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