import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  if (!env.mongoUri) {
    console.warn("[db] MONGO_URI not set - running with in-memory data");
    return null;
  }

  try {
    const connection = await mongoose.connect(env.mongoUri);
    console.log(`[db] MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("[db] MongoDB connection failed:", error.message);
    throw error;
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
