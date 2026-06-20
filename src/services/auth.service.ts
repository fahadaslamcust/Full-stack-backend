import User from "../models/User";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { RegisterInput, LoginInput } from "../schemas/auth.schema";

const signToken = (id: string): string => {
  return jwt.sign({ id }, ENV.JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (userData: RegisterInput) => {
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new AppError("Email is already registered", HTTP_STATUS.BAD_REQUEST);
  }

  const newUser = await User.create(userData);
  const token = signToken(newUser._id.toString() as string);

  return {
    token,
    user: { id: newUser._id, name: newUser.name, email: newUser.email },
  };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  // Explicitly select password since schema flag blocks default selection retrieval
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password!))) {
    throw new AppError("Incorrect email or password", HTTP_STATUS.UNAUTHORIZED);
  }

  const token = signToken(user._id.toString() as string);
  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};
