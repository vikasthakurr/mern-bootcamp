import { Router } from "express";
import {
  startConversation,
  listConversations,
  getMessages,
} from "./chatController.js";
import { authenticate } from "../middleware/authenticate.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/conversations", authenticate, listConversations);

router.post(
  "/conversations",
  authenticate,
  validate({
    jobId: { required: true, type: "string" },
    freelancerId: { type: "string" },
  }),
  startConversation
);

router.get("/conversations/:id/messages", authenticate, getMessages);

export default router;
