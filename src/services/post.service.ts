import Post from "../models/Post";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";
import { CreatePostInput, CreateCommentInput } from "../schemas/post.shema";
import { createNotification } from "./notification.service";
import { NotificationType } from "../models/Notification";
import { getIO } from "../socket";

export const createPost = async (userId: string, data: CreatePostInput & { mediaUrl?: string; taggedUsers?: string[] }) => {
  const post = await Post.create({ 
    author: userId, 
    content: data.content,
    mediaUrl: data.mediaUrl,
    taggedUsers: data.taggedUsers || []
  });
  const populatedPost = await post.populate("author", "name profilePicture");
  
  getIO().emit("new_post", populatedPost);

  return populatedPost;
};

export const updatePost = async (
  postId: string,
  userId: string,
  content: string,
) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);

  if (post.author.toString() !== userId) {
    throw new AppError(
      "You can only edit your own posts",
      HTTP_STATUS.FORBIDDEN,
    );
  }

  post.content = content;
  post.isEdited = true; // Flag it as edited
  await post.save();
  
  const populatedPost = await post.populate("author", "name profilePicture");
  getIO().emit("post_updated", populatedPost);

  return populatedPost;
};

export const getFeed = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  return await Post.find()
    .sort({ createdAt: -1 }) // Newest posts first
    .skip(skip)
    .limit(limit)
    .populate("author", "name profilePicture")
    .populate("comments.user", "name profilePicture")
    .populate("taggedUsers", "name profilePicture");
};

export const getPostById = async (postId: string) => {
  const post = await Post.findById(postId)
    .populate("author", "name profilePicture")
    .populate("comments.user", "name profilePicture")
    .populate("taggedUsers", "name profilePicture");

  if (!post) throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);
  return post;
};

export const deletePost = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);

  // Strict comparison using .toString()
  if (post.author.toString() !== userId) {
    throw new AppError(
      "You can only delete your own posts",
      HTTP_STATUS.FORBIDDEN,
    );
  }

  await post.deleteOne();
  return true;
};

export const toggleLike = async (postId: string, userId: string) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);

  // Check if user already liked the post
  const isLiked = post.likes.some((id) => id.toString() === userId);

  if (isLiked) {
    // Remove like
    post.likes = post.likes.filter((id) => id.toString() !== userId);
  } else {
    // Add like
    post.likes.push(userId as any);
  }

  await post.save();

  // LIKE Notification
  await createNotification(
    post.author.toString(),
    userId,
    NotificationType.LIKE,
    post._id.toString() as string,
  );

  const populatedPost = await post.populate([
    { path: "author", select: "name profilePicture" },
    { path: "comments.user", select: "name profilePicture" },
    { path: "taggedUsers", select: "name profilePicture" }
  ]);
  
  getIO().emit("post_updated", populatedPost);

  return populatedPost;
};

export const addComment = async (
  postId: string,
  userId: string,
  data: CreateCommentInput,
) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError("Post not found", HTTP_STATUS.NOT_FOUND);

  post.comments.push({
    user: userId as any,
    text: data.text,
    createdAt: new Date(),
  });

  await post.save();

  // Notification
  await createNotification(
    post.author.toString(),
    userId,
    NotificationType.COMMENT,
    post._id.toString() as string,
  );

  // Return the post with the newly added user populated
  const populatedPost = await post.populate([
    { path: "author", select: "name profilePicture" },
    { path: "comments.user", select: "name profilePicture" },
    { path: "taggedUsers", select: "name profilePicture" }
  ]);

  getIO().emit("post_updated", populatedPost);

  return populatedPost;
};
