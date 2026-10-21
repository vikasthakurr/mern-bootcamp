import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.js";

export async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return next(
      ApiError.unauthorized("Missing or invalid Authorization header"),
    );
  }

  const token = header.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    return next(ApiError.unauthorized("Invalid or expired token"));
  }

  try {
    const user = await User.findById(payload.id);
    if (!user) {
      return next(ApiError.unauthorized("User no longer exists"));
    }
    req.user = { id: user.id, name: user.name, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
}
