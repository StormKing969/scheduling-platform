import {v4 as uuidv4} from "uuid";
import {RegisterDto} from "../database/dto/auth.dto";
import {AppDataSource} from "../config/database.config";
import {User} from "../database/entities/user.entity";
import {BadRequestException} from "../utils/app-error";
import {Availability} from "../database/entities/availability.entity";
import {DayAvailability, DayOfWeekEnum,} from "../database/entities/day-availability.entity";

async function generateUsername(name: string): Promise<string> {
    const baseUsername = name.replace(/\s+/g, "").toLowerCase();

  const uuidSuffix = uuidv4().replace(/\s+/g, "").slice(0, 4);
  const userRepository = AppDataSource.getRepository(User);

  let username = `${baseUsername}${uuidSuffix}`;
  let existingUser = await userRepository.findOne({
    where: { username },
  });

  while (existingUser) {
    username = `${baseUsername}${uuidv4().replace(/\s+/g, "").slice(0, 4)}`;
    existingUser = await userRepository.findOne({
      where: { username },
    });
  }

  return username;
}

export const registerService = async (registerDto: RegisterDto) => {
  const userRepository = AppDataSource.getRepository(User);
  const availabilityRepository = AppDataSource.getRepository(Availability);
  const dayAvailabilityRepository =
    AppDataSource.getRepository(DayAvailability);
  const doesUserExist = await userRepository.findOne({
    where: { email: registerDto.email },
  });
  if (doesUserExist) {
    throw new BadRequestException("User already exists");
  }

  const username = await generateUsername(registerDto.name);
  const user = userRepository.create({
    ...registerDto,
    username,
  });

  user.availability = availabilityRepository.create({
      timeGap: 30,
      days: Object.values(DayOfWeekEnum).map((day) => {
          return dayAvailabilityRepository.create({
              day: day,
              startTime: new Date(`2025-03-01T08:00:00Z`), //8:00am
              endTime: new Date(`2025-03-01T21:00:00Z`), //9:00pm
          });
      }),
  });
  await userRepository.save(user);

  return { user: user.omitPassword() };
};