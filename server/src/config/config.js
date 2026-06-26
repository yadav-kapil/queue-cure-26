import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables")
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables")
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables")
}

if (!process.env.CLIENT_URI) {
  throw new Error("CLIENT_URI is not defined in environment variables")
}

if (!process.env.COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET is not defined in environment variables")
}

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not defined in environment variables")
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not defined in environment variables")
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not defined in environment variables")
}

if (!process.env.EMAIL_USER) {
  throw new Error("EMAIL_USER is not defined in environment variables")
}

if (!process.env.EMAIL_PASS) {
  throw new Error("EMAIL_PASS is not defined in environment variables")
}

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URI: process.env.CLIENT_URI,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};

export default config;
