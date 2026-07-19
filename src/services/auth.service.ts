import crypto from "crypto";
import User from "../models/User";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";
import { sendEmail } from "../utils/sendEmail";
import * as googleAuth from "./google-auth.service";
import * as facebookAuth from "./facebook-auth.service";
const signToken = (id: string): string => {
  return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: "1d" });
};
export const facebookSignUp = async (facebookToken: string) => {
  try {
    const facebookData = await facebookAuth.verifyFacebookToken(facebookToken);

    let user = await User.findOne({ email: facebookData.email });

    if (!user) {
      user = new User({
        email: facebookData.email,
        name: facebookData.name,
        avatar: facebookData.picture,
        password: "facebook_oauth",
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, ENV.JWT_SECRET, {
      expiresIn: "7d",
    });

    return {
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  } catch (error) {
    throw error;
  }
};

export const googleSignUp = async (googleToken: string) => {
  try {
    // Verify the Google token
    const googleData = await googleAuth.verifyGoogleToken(googleToken);
    
    // Check if user already exists
    let user = await User.findOne({ email: googleData.email });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email: googleData.email,
        name: googleData.name,
        avatar: googleData.picture,
        password: 'google_oauth', // Placeholder - Google users don't have passwords
      });
      await user.save();
    }
    
    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );
    return {
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  } catch (error) {
    throw error;
  }
};
export const registerUser = async (data: RegisterInput) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError("Email already in use", HTTP_STATUS.BAD_REQUEST);
  }

  // 1. Create user
  const user = await User.create(data);

  // 2. Generate Verification Token
  const verifyToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false }); // Save the token fields

  // 3. Send the Email
  // Construct the verification URL (assuming frontend runs on port 3000)
  const verificationUrl = `${ENV.FRONTEND_DOMAIN}/verify-email/${verifyToken}`;
  const message = `Welcome to CampusConnect! \n\nPlease verify your email by clicking this link: \n${verificationUrl} \n\nThis link expires in 24 hours.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Verify Your CampusConnect Account",
      message,
    });
  } catch (error) {
    // If email fails, clear the token so they can try again later
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new AppError(
      "There was an error sending the email. Try again later.",
      500,
    );
  }

  // TEMPORARILY MODIFIED FOR DEVELOPMENT: Return token to allow auto-login
  return {
    user: { id: user._id, name: user.name, email: user.email },
    token: signToken(user._id.toString() as string)
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await User.findOne({ email: data.email }).select("+password");

  if (!user || !(await user.correctPassword(data.password, user.password!))) {
    throw new AppError("Incorrect email or password", HTTP_STATUS.UNAUTHORIZED);
  }

  // ADD THIS BLOCK: Prevent login if email is not verified
  // TEMPORARILY DISABLED FOR DEVELOPMENT:
  // if (!user.isEmailVerified) {
  //   throw new AppError(
  //     "Please verify your email address before logging in.",
  //     HTTP_STATUS.FORBIDDEN,
  //   );
  // }

  return {
    user: { id: user._id, name: user.name, email: user.email },
    token: signToken(user._id.toString() as string), // Your existing token logic
  };
};

// NEW FUNCTION: Verify the email
export const verifyEmail = async (token: string) => {
  // 1. Hash the incoming token to compare it with the database
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // 2. Find user with that token AND check if it hasn't expired yet
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }, // Expiry must be strictly greater than current time
  });

  if (!user) {
    throw new AppError(
      "Token is invalid or has expired",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  // 3. Mark user as verified and clear token fields
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return {
    success: true,
    message: "Email verified successfully! You can now log in.",
  };
};
