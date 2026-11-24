import mongoose from "mongoose";

import { dbConfig } from "../config/database.js";
import logger from "../utils/logger.js"

mongoose.connection.on("error", (error) => {
  logger.error({ err: error }, "MongoDB connection error");
});

export async function connectDatabase() {
    if (!dbConfig.mongoUrl) {
        throw new Error("MONGO_URL is required");
    }

    if (!dbConfig.mongoRootUser || !dbConfig.mongoRootPassword) {
        throw new Error("MongoDB username and password are required");
    }

    await mongoose.connect(dbConfig.mongoUrl, {
        user: dbConfig.mongoRootUser,
        pass: dbConfig.mongoRootPassword,
        authSource: "admin",
        serverSelectionTimeoutMS: 10000,
    });

    logger.info("MongoDB connected")
}
