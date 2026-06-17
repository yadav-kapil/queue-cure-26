import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables")
}

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables")
}

if (!process.env.JWT_SECRET) {
  throw new Error("PORT is not defined in environment variables")
}

if (!process.env.CLIENT_URI) {
  throw new Error("MONGO_URI is not defined in environment variables")
}

const config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  CLIENT_URI: process.env.CLIENT_URI,
};

export default config;
