import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HttpStatus } from "../config/http.config";
import { RegisterDto } from "../database/dto/auth.dto";
import {
  ValidationSource,
  withValidation,
} from "../middlewares/withValidation.middleware";

function asyncHandlerWithValidation<T extends object>(
  dto: new () => T,
  source: ValidationSource = "body",
  handler: (req: Request, res: Response, dto: T) => Promise<any>,
) {
  return asyncHandler(withValidation(dto, source)(handler));
}

export const registerController = asyncHandlerWithValidation(
  RegisterDto,
  "body",
  async (req: Request, res: Response, registerDto: RegisterDto) => {
    console.log("registerDto", registerDto);
    return res.status(HttpStatus.CREATED).json({
      message: "User created successfully",
    });
  },
);