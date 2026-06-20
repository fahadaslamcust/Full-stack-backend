import User from "../models/User";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { UpdateProfileInput } from "../schemas/user.schema";

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }
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

export const searchUsersByName = async (searchTerm: string) => {
  const users = await User.find({
    name: { $regex: searchTerm, $options: "i" },
  })
    .select("name avatar bio")
    .limit(20); // Protects the database from massive queries

  return users;
};
