import { AppDataSource } from "../config/database.config";
import {
  Integration,
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum,
  IntegrationProviderEnum,
} from "../database/entities/integration.entity";
import { BadRequestException } from "../utils/app-error";
import { encodeState } from "../utils/helper";
import { googleOAuth2Client } from "../config/oauth.config";

const appTypeToProviderMap: Record<
  IntegrationAppTypeEnum,
  IntegrationProviderEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]:
    IntegrationProviderEnum.GOOGLE,
  [IntegrationAppTypeEnum.ZOOM_MEETING]: IntegrationProviderEnum.ZOOM,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationProviderEnum.MICROSOFT,
};

const appTypeToCategoryMap: Record<
  IntegrationAppTypeEnum,
  IntegrationCategoryEnum
> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]:
    IntegrationCategoryEnum.CALENDAR_AND_VIDEO_CONFERENCE,
  [IntegrationAppTypeEnum.ZOOM_MEETING]:
    IntegrationCategoryEnum.VIDEO_CONFERENCE,
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: IntegrationCategoryEnum.CALENDAR,
};

const appTypeToTitleMap: Record<IntegrationAppTypeEnum, string> = {
  [IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR]: "Google Meet & Calendar",
  [IntegrationAppTypeEnum.ZOOM_MEETING]: "Zoom Meeting",
  [IntegrationAppTypeEnum.OUTLOOK_CALENDAR]: "Outlook Calendar",
};

export const getUserIntegrationsService = async (userId: string) => {
  const integrationRepository = AppDataSource.getRepository(Integration);
  const userIntegrations = await integrationRepository.find({
    where: { user: { id: userId } },
  });
  const connectedMap = new Map(
    userIntegrations.map((integration) => [integration.app_type, true]),
  );

  return Object.values(IntegrationAppTypeEnum).flatMap(
    (appType: IntegrationAppTypeEnum) => {
      return {
        provider: appTypeToProviderMap[appType],
        title: appTypeToTitleMap[appType],
        app_type: appType,
        category: appTypeToCategoryMap[appType],
        isConnected: connectedMap.has(appType) || false,
      };
    },
  );
};

export const checkIntegrationService = async (
  userId: string,
  appType: IntegrationAppTypeEnum,
) => {
  const integrationRepository = AppDataSource.getRepository(Integration);

  const integration = await integrationRepository.findOne({
    where: { user: { id: userId }, app_type: appType },
  });

  return integration ? integration : false;
};

export const connectAppService = async (
  userId: string,
  appType: IntegrationAppTypeEnum,
) => {
  const state = encodeState({ userId, appType });
  let authUrl: string;
  switch (appType) {
    case IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR:
      authUrl = googleOAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/calendar.events"],
        prompt: "consent",
        state: state,
      });
      break;
    // case IntegrationAppTypeEnum.ZOOM_MEETING:
    //   break;
    // case IntegrationAppTypeEnum.OUTLOOK_CALENDAR:
    //   break;
    default:
      throw new BadRequestException("Unsupported app type");
  }

  return { url: authUrl };
};