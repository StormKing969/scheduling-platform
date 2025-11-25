import { IntegrationAppTypeEnum } from "../entities/integration.entity";
import { IsEnum, IsNotEmpty } from "class-validator";

export class AppTypeDtO {
  @IsEnum(IntegrationAppTypeEnum)
  @IsNotEmpty()
  appType: IntegrationAppTypeEnum;
}