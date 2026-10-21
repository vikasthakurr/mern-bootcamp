import { Router } from "express";
import { register, login, me } from "../controllers/authController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate({
    name: { required: true, type: "string" },
    email: { required: true, type: "string" },
    password: { required: true, type: "string" },
    role: { required: true, type: "string", enum: ["client", "freelancer"] },
  }),
  register
);

router.post(
  "/login",
  authLimiter,
  validate({
    email: { required: true, type: "string" },
    password: { required: true, type: "string" },
  }),
  login
);

router.get("/me", authenticate, me);

export default router;
