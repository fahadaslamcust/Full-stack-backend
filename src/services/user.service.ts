import User from "../models/User";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UpdateProfileInput } from "../schemas/user.schema";
import { ENV } from "../config/env";

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }
  return user;
};

export const updateAvatar = async (userId: string, filename: string) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);

  // Construct the URL to the image (In production, replace localhost with your actual domain)
  const avatarUrl = `${ENV.FRONTEND_DOMAIN}/uploads/avatars/${filename}`;

  user.avatar = avatarUrl;
  await user.save();

  return user;
};

export const updateProfile = async (
  userId: string,
  updateData: UpdateProfileInput,
) => {
  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true, // Returns the updated document instead of the old one
    runValidators: true,
  }).select("-password");

  return updatedUser;
};

export const searchUsersByName = async (searchTerm: string = "", currentUserId?: string) => {
  const query: any = {
    name: { $regex: searchTerm, $options: "i" },
  };
  
  if (currentUserId) {
    query._id = { $ne: currentUserId };
  }

  const users = await User.find(query)
    .select("name avatar bio")
    .limit(20); // Protects the database from massive queries

  return users;
};
