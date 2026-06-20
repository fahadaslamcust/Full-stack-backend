import { Request } from "express";
import { IUser } from "../models/User";

// This extends the standard Express Request to include our custom user payload
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
