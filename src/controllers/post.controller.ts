import { Response, NextFunction } from "express";
import * as postService from "../services/post.service";
import { HTTP_STATUS } from "../constants/httpStatus";
import { AuthenticatedRequest } from "../types";

export const createPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const post = await postService.createPost(req.user!.id, req.body);
    res.status(HTTP_STATUS.CREATED).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const post = await postService.updatePost(
      req.params.id.toString(),
      req.user!.id,
      req.body.content,
    );
    res.status(HTTP_STATUS.OK).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const posts = await postService.getFeed(page, limit);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const post = await postService.getPostById(req.params.id.toString());
    res.status(HTTP_STATUS.OK).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await postService.deletePost(req.params.id.toString(), req.user!.id);
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const toggleLike = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const post = await postService.toggleLike(
      req.params.id.toString(),
      req.user!.id,
    );
    res
      .status(HTTP_STATUS.OK)
      .json({ success: true, message: "Like status updated", data: post });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const post = await postService.addComment(
      req.params.id.toString(),
      req.user!.id,
      req.body,
    );
    res
      .status(HTTP_STATUS.CREATED)
      .json({ success: true, message: "Comment added", data: post });
  } catch (error) {
    next(error);
  }
};
