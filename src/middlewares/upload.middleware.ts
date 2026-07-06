import multer from "multer";
import path from "path";
import { Request } from "express";
import { AppError } from "../utils/AppError";
import { HTTP_STATUS } from "../constants/httpStatus";

// 1. Configure where and how to save the file
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "public/uploads/avatars");
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    // Generate a unique filename: avatar-<USER_ID>-<TIMESTAMP>.jpg
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  },
});

// 2. Ensure the user is only uploading images
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not an image! Please upload only images.",
        HTTP_STATUS.BAD_REQUEST,
      ),
    );
  }
};

// 3. Export the middleware (Limit file size to 2MB)
export const uploadAvatarMiddleware = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter,
});

const mediaStorage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, "public/uploads/avatars"); // Reuse the avatars folder for simplicity
  },
  filename: function (req: Request, file: Express.Multer.File, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `media-${uniqueSuffix}${ext}`);
  },
});

export const uploadMediaMiddleware = multer({
  storage: mediaStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: fileFilter,
});
