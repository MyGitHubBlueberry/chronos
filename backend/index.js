import express from "express";
import cors from "cors";

import { appConfig } from "./config/app.js";
import { connectDatabase } from "./database/connect.js";
import authRouter from "./routers/auth-router.js";
import errorHandler from "./middlewares/error-middleware.js"
import logger from "./utils/logger.js"

const app = express();

app.use(cors({ origin: `http://localhost:${process.env.CLIENT_PORT}` }));
app.use(express.json());

app.use('/api/auth', authRouter);

app.get("/health", (req, res) => {
    res.json({ status: "ok", app: "app is OK" });
});

app.use(errorHandler);


async function start() {
    await connectDatabase();

    app.listen(appConfig.port, "0.0.0.0", () => {
        logger.info(`Server is running on http://localhost:${appConfig.port}`);
    });
}

start().catch((error) => {
    logger.error("Failed to start application:", error.message);
    process.exit(1);
});
