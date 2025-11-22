import { Request, Response } from "express";
import { HttpStatus } from "../config/http.config";
import { RegisterDto } from "../database/dto/auth.dto";
import { asyncHandlerWithValidation } from "../middlewares/withValidation.middleware";
import { registerService } from "../services/auth.service";

export const registerController = asyncHandlerWithValidation(
  RegisterDto,
  "body",
  async (req: Request, res: Response, registerDto: RegisterDto) => {
    const { user } = await registerService(registerDto);

    return res.status(HttpStatus.CREATED).json({
      message: "User created successfully",
      user,
    });
  },
);