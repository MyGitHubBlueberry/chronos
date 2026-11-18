import express from "express";
import { appConfig } from "./config/app.js";
import { connectDatabase } from "./database/connect.js";

const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "app is OK" });
});

async function start() {
  await connectDatabase();

  app.listen(appConfig.port, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${appConfig.port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start application:", error.message);
  process.exit(1);
});
