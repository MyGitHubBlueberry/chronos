import dotenv from "dotenv";

dotenv.config({
  path: new URL("../../.env", import.meta.url),
});

export const appConfig = {
    port: process.env.API_PORT,
}