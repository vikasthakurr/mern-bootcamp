import { ApiError } from "../utils/ApiError.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || "Something went wrong";

  if (statusCode === 500) {
    console.error("Unexpected error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}
