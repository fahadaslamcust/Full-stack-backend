import dotenv from "dotenv";
import path from "path";

// Locate the .env file at the project root
dotenv.config({ path: path.join(__dirname, "../../.env") });

const requiredEnv = ["PORT", "MONGO_URI", "JWT_SECRET", "NODE_ENV"] as const;

// Verify every required variable exists
for (const env of requiredEnv) {
  if (!process.env[env]) {
    console.error(`❌ CRITICAL CONFIG ERROR: ${env} is missing in .env file.`);
    process.exit(1);
  }
}

export const ENV = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  NODE_ENV: process.env.NODE_ENV || "development",
};
