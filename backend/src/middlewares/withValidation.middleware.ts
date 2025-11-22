import { Request, Response, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { HttpStatus } from "../config/http.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";

export type ValidationSource = "body" | "params" | "query";

function formatValidationError(res: Response, errors: ValidationError[]) {
  return res.status(HttpStatus.BAD_REQUEST).json({
    message: "Validation failed.",
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
    errors: errors.map((e) => ({
      field: e.property,
      message: e.constraints,
    })),
  });
}

export function withValidation<T extends object>(
  DtoClass: new () => T,
  source: ValidationSource,
) {
  return function (
    handler: (req: Request, res: Response, dto: T) => Promise<any>,
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dtoInstance = plainToInstance(DtoClass, req[source]);
        const errors = await validate(dtoInstance);
        if (errors?.length > 0) {
          return formatValidationError(res, errors);
        }

        return handler(req, res, dtoInstance);
      } catch (error) {
        next(error);
      }
    };
  };
}