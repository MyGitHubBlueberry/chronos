import dotenv from "dotenv";

dotenv.config({
  path: new URL("../../.env", import.meta.url),
});

export const dbConfig = {
    mongoUrlWindows: process.env.MONGO_URL_WINDOWS,
    mongoUrlDocker: process.env.MONGO_URL_DOCKER,
    mongoRootUser: process.env.MONGO_ROOT_USERNAME,
    mongoRootPassword: process.env.MONGO_ROOT_PASSWORD
}