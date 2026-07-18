import { OAuth2Client } from 'google-auth-library';
import { AppError } from '../utils/AppError';
import { HTTP_STATUS } from '../constants/httpStatus';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const verifyGoogleToken = async (token: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    return {
      email: payload?.email,
      name: payload?.name,
      picture: payload?.picture,
      googleId: payload?.sub,
    };
  } catch (error) {
    throw new AppError('Invalid Google token', HTTP_STATUS.UNAUTHORIZED);
  }
};
