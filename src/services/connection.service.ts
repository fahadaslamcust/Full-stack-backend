import User from "../models/User";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

export const followUser = async (
  currentUserId: string,
  targetUserId: string,
) => {
  if (currentUserId === targetUserId) {
    throw new AppError("You cannot follow yourself", HTTP_STATUS.BAD_REQUEST);
  }

  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  // Strict check using .toString()
  const isFollowing = currentUser.following.some(
    (id) => id.toString() === targetUserId,
  );
  if (isFollowing) {
    throw new AppError(
      "You are already following this student",
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  currentUser.following.push(targetUserId as any);
  targetUser.followers.push(currentUserId as any);

  await Promise.all([currentUser.save(), targetUser.save()]);
  return { success: true };
};

export const unfollowUser = async (
  currentUserId: string,
  targetUserId: string,
) => {
  const currentUser = await User.findById(currentUserId);
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) {
    throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);
  }

  // Remove using strict string comparison
  currentUser.following = currentUser.following.filter(
    (id) => id.toString() !== targetUserId,
  ) as any;
  targetUser.followers = targetUser.followers.filter(
    (id) => id.toString() !== currentUserId,
  ) as any;

  await Promise.all([currentUser.save(), targetUser.save()]);
  return { success: true };
};

export const getNetwork = async (userId: string) => {
  const user = await User.findById(userId)
    .populate("followers", "name avatar bio")
    .populate("following", "name avatar bio");

  if (!user) throw new AppError("User not found", HTTP_STATUS.NOT_FOUND);

  return {
    followers: user.followers,
    following: user.following,
    followerCount: user.followers.length,
    followingCount: user.following.length,
  };
};
