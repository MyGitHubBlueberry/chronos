import "./env.js";

export const dbConfig = {
    mongoUrl: process.env.MONGO_URL,
    mongoRootUser: process.env.MONGO_ROOT_USERNAME,
    mongoRootPassword: process.env.MONGO_ROOT_PASSWORD
}