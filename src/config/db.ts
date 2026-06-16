import mongoose from "mongoose";
import { ENV } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(ENV.MONGO_URI);
    console.log("🟩 MongoDB Connected Successfully...");
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${(error as Error).message}`);
    process.exit(1); // Crash the app immediately if the database is down
  }
};
