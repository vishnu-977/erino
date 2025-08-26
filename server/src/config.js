import dotenv from "dotenv";
dotenv.config();

export const {
  PORT = 8080,
  MONGO_URI,
  JWT_SECRET,
  CLIENT_ORIGIN,
  COOKIE_NAME = "erino_token",
  NODE_ENV = "development"
} = process.env;

export const IS_PROD = NODE_ENV === "production";
