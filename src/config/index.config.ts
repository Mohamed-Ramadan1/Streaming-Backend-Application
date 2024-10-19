// src/config/index.ts
import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const user = process.env.DATABASE_USER;
export const password = process.env.DATABASE_USER_PASSWORD;
export const host = process.env.DATABASE_HOST;
export const port = parseInt(process.env.DATABASE_PORT as string);
export const database = process.env.DATABASE_NAME;
export const connectionLimit = process.env.DATABASE_CONNECTION_LIMIT;
