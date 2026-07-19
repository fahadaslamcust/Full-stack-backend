import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

interface FacebookDebugTokenResponse {
  data?: {
    is_valid?: boolean;
    app_id?: string;
  };
}

interface FacebookProfileResponse {
  id?: string;
  name?: string;
  email?: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
  error?: {
    message?: string;
  };
}

export const verifyFacebookToken = async (accessToken: string) => {
  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;

  if (!appId || !appSecret) {
    throw new AppError(
      "Facebook auth is not configured",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  }

  const appAccessToken = `${appId}|${appSecret}`;
  const debugUrl = new URL("https://graph.facebook.com/debug_token");
  debugUrl.searchParams.set("input_token", accessToken);
  debugUrl.searchParams.set("access_token", appAccessToken);

  const debugResponse = await fetch(debugUrl.toString());
  const debugData = (await debugResponse.json()) as FacebookDebugTokenResponse;

  if (
    !debugResponse.ok ||
    !debugData.data?.is_valid ||
    debugData.data.app_id !== appId
  ) {
    throw new AppError("Invalid Facebook token", HTTP_STATUS.UNAUTHORIZED);
  }

  const profileUrl = new URL("https://graph.facebook.com/me");
  profileUrl.searchParams.set("fields", "id,name,email,picture.type(large)");
  profileUrl.searchParams.set("access_token", accessToken);

  const profileResponse = await fetch(profileUrl.toString());
  const profile = (await profileResponse.json()) as FacebookProfileResponse;

  if (!profileResponse.ok || profile.error) {
    throw new AppError("Invalid Facebook token", HTTP_STATUS.UNAUTHORIZED);
  }

  if (!profile.email) {
    throw new AppError(
      "Facebook account must have an email address",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  return {
    email: profile.email,
    name: profile.name,
    picture: profile.picture?.data?.url,
    facebookId: profile.id,
  };
};
