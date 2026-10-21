import { v2 as cloudinary } from "cloudinary";
import { env } from "./env.js";

let configured = false;

export function configureCloudinary() {
  const { cloudName, apiKey, apiSecret } = env.cloudinary;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("[cloudinary] credentials not set - image uploads disabled");
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  configured = true;
  console.log("[cloudinary] configured");
  return cloudinary;
}

export function isCloudinaryReady() {
  return configured;
}

export async function uploadImage(filePath, folder = "talentbridge") {
  if (!configured) {
    throw new Error("Cloudinary is not configured");
  }
  return cloudinary.uploader.upload(filePath, { folder });
}

export { cloudinary };
