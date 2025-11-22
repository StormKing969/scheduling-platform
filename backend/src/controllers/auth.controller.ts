import { Request, Response } from "express";
import { HttpStatus } from "../config/http.config";
import { LoginDto, RegisterDto } from "../database/dto/auth.dto";
import { asyncHandlerWithValidation } from "../middlewares/withValidation.middleware";
import { loginService, registerService } from "../services/auth.service";

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

export const loginController = asyncHandlerWithValidation(
  LoginDto,
  "body",
  async (req: Request, res: Response, loginDto: LoginDto) => {
    const { user, accessToken, expiresAt } = await loginService(loginDto);

    return res.status(HttpStatus.CREATED).json({
      message: "User logged in successfully",
      user,
      accessToken,
      expiresAt,
    });
  },
);