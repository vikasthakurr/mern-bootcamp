import { Router } from "express";
import {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import {
  listProposalsForJob,
  createProposal,
} from "../controllers/proposalController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.get("/", listJobs);
router.get("/:id", getJob);

router.post(
  "/",
  authenticate,
  authorize("client"),
  validate({
    title: { required: true, type: "string" },
    description: { required: true, type: "string" },
    budget: { required: true, type: "number" },
    category: { required: true, type: "string" },
  }),
  createJob
);

router.put("/:id", authenticate, authorize("client"), updateJob);
router.delete("/:id", authenticate, authorize("client"), deleteJob);

router.get(
  "/:jobId/proposals",
  authenticate,
  authorize("client"),
  listProposalsForJob
);

router.post(
  "/:jobId/proposals",
  authenticate,
  authorize("freelancer"),
  validate({
    coverLetter: { required: true, type: "string" },
    bidAmount: { required: true, type: "number" },
  }),
  createProposal
);

export default router;
