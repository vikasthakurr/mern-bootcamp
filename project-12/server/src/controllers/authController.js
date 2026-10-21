import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";

function createToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict("Email is already registered");
  }

  const user = await User.create({ name, email, password, role });
  const token = createToken(user);

  res.status(201).json({
    success: true,
    data: { user: user.toJSON(), token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.matchPassword(password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = createToken(user);

  res.json({
    success: true,
    data: { user: user.toJSON(), token },
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw ApiError.unauthorized("User no longer exists");
  }
  res.json({ success: true, data: { user: user.toJSON() } });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw ApiError.unauthorized("User no longer exists");
  }

  const { name, title, bio } = req.body;
  if (name !== undefined) user.name = name;
  if (title !== undefined) user.title = title;
  if (bio !== undefined) user.bio = bio;

  await user.save();

  res.json({ success: true, data: { user: user.toJSON() } });
});
