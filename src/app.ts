import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { HTTP_STATUS } from "./constants/httpStatus";
import { AppError } from "./utils/AppError";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json()); // Allows Express to read incoming JSON data bodies

// Health Check Route (To quickly confirm the server is running)
app.get("/health", (req: Request, res: Response) => {
  res.status(HTTP_STATUS.OK).json({ status: "healthy", timestamp: new Date() });
});

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
