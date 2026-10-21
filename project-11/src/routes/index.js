import { Router } from "express";
import authRoutes from "./authRoutes.js";
import jobRoutes from "./jobRoutes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ success: true, message: "TalentBridge API is running" });
});

router.use("/auth", authRoutes);
router.use("/jobs", jobRoutes);

export default router;
