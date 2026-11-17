import express from "express";
import mongoose from "mongoose";
import { appConfig } from "./config/app.js";

const app = express();
const PORT = 3000;

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "app is OK" });
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

async function start() {
  if (!appConfig.mongoRootUser || !appConfig.mongoRootPassword) {
    throw new Error("MONGO_ROOT_USERNAME and MONGO_ROOT_PASSWORD are required");
  }

  await mongoose.connect(
    appConfig.mongoUrlDocker || appConfig.mongoUrlWindows,
    {
      user: appConfig.mongoRootUser,
      pass: appConfig.mongoRootPassword,
      authSource: "admin",
      serverSelectionTimeoutMS: 10000,
    }
  );

  console.log("MongoDB connected");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start application:", error.message);
  process.exit(1);
});
