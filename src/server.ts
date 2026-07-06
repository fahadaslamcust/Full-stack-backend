import app from "./app";
import { ENV } from "./config/env";
import { connectDB } from "./config/db";
import { initSocket } from "./socket";

const bootEngine = async () => {
  // 1. Establish connection to your MongoDB
  await connectDB();

  // 2. Turn on the Express network server listener
  const server = app.listen(ENV.PORT, () => {
    console.log(
      `🚀 Engine is live in [${ENV.NODE_ENV}] mode on port ${ENV.PORT}`,
    );
  });

  // Initialize Socket.io
  initSocket(server);

  // 3. Prevent sudden catastrophic server crashes
  process.on("unhandledRejection", (err: Error) => {
    console.error("⚠️ UNHANDLED REJECTION MET! Closing down gracefully...");
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

bootEngine();
