import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { userModel } from "../models/userModel.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing or invalid Authorization header"));
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = userModel.findById(payload.id);

    if (!user) {
      return next(ApiError.unauthorized("User no longer exists"));
    }

    req.user = { id: user.id, name: user.name, role: user.role };
    next();
  } catch (error) {
    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
