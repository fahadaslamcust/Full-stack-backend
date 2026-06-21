import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { HTTP_STATUS } from "./constants/httpStatus";
import { AppError } from "./utils/AppError";
import { errorHandler } from "./middlewares/errorHandler.middleware";

// Route Imports
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import messageRoutes from "./routes/message.routes";
import eventRoutes from "./routes/event.routes";

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json()); // Allows Express to read incoming JSON data bodies

// Health Check Route (To quickly confirm the server is running)
app.get("/health", (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({ status: "healthy", timestamp: new Date() });
});

// Main Root Endpoint Setup
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/events", eventRoutes);

// Catch-All Route for routes that don't exist
app.all("/*splat", (req: Request, res: Response, next: NextFunction) => {
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      HTTP_STATUS.NOT_FOUND,
    ),
  );
});

// Centralized Global Error Treatment Middleware
app.use(errorHandler);

export default app;
