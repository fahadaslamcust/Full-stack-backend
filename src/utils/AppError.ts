export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Identifies this as an expected validation/auth error, not a system crash

    Error.captureStackTrace(this, this.constructor);
  }
}
