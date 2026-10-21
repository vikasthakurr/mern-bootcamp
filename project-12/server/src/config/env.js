import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || "development",

  jwtSecret: process.env.JWT_SECRET || "super-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",

  rateLimitWindowMinutes: Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15,
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,

  mongoUri:
    process.env.MONGO_URI ||
    "mongodb+srv://vikaskumar20012001_db_user:Vikas123@savourykitchen.ntybdvc.mongodb.net/dummy",

  redisUrl: process.env.REDIS_URL || "",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
};
