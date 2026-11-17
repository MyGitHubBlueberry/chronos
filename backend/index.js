const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 3000;

app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "app is OK" });
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

async function start() {
  if (!process.env.MONGO_USERNAME || !process.env.MONGO_PASSWORD) {
    throw new Error("MONGO_USERNAME and MONGO_PASSWORD are required");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    authSource: "admin",
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB connected");

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start application:", error.message);
  process.exit(1);
});
