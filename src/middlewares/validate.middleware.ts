import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { HTTP_STATUS } from "../constants/httpStatus";

export const validate =
  (schema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Validation Error",
          errors: error.issues.map((issue) => ({
            field: issue.path[1] || issue.path[0],
            message: issue.message,
          })),
        });
        return;
      }
      return next(error);
    }
  };
