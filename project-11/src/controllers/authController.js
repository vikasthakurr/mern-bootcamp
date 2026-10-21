import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { userModel } from "../models/userModel.js";

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

function safeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (userModel.findByEmail(email)) {
    throw ApiError.conflict("Email is already registered");
  }

  const user = userModel.create({ name, email, password, role });
  const token = createToken(user);

  res.status(201).json({
    success: true,
    data: { user: safeUser(user), token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = userModel.findByEmail(email);
  if (!user || user.password !== password) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = createToken(user);

  res.json({
    success: true,
    data: { user: safeUser(user), token },
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = userModel.findById(req.user.id);
  if (!user) {
    throw ApiError.unauthorized("User no longer exists");
  }
  res.json({ success: true, data: { user: safeUser(user) } });
});
