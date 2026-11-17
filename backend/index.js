import express from "express";
import mongoose from "mongoose";
import { appConfig } from "./config/app.js";
import { dbConfig } from "./config/database.js";

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "app is OK" });
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

async function start() {
  if (!dbConfig.mongoRootUser || !dbConfig.mongoRootPassword) {
    throw new Error("MONGO_ROOT_USERNAME and MONGO_ROOT_PASSWORD are required");
  }

  await mongoose.connect(
    dbConfig.mongoUrlDocker || dbConfig.mongoUrlWindows,
    {
      user: dbConfig.mongoRootUser,
      pass: dbConfig.mongoRootPassword,
      authSource: "admin",
      serverSelectionTimeoutMS: 10000,
    }
  );

  console.log("MongoDB connected");

  app.listen(appConfig.port, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start application:", error.message);
  process.exit(1);
});
