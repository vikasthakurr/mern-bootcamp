import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { jobModel } from "../models/jobModel.js";
import { proposalModel } from "../models/proposalModel.js";

export const listProposalsForJob = asyncHandler(async (req, res) => {
  const job = jobModel.findById(req.params.jobId);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  if (req.user.role === "client" && job.clientId !== req.user.id) {
    throw ApiError.forbidden("You can only view proposals on your own jobs");
  }

  const proposals = proposalModel.findByJob(job.id);

  res.json({ success: true, count: proposals.length, data: proposals });
});

export const createProposal = asyncHandler(async (req, res) => {
  const job = jobModel.findById(req.params.jobId);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  const { coverLetter, bidAmount } = req.body;

  const proposal = proposalModel.create({
    jobId: job.id,
    freelancerId: req.user.id,
    coverLetter,
    bidAmount,
  });

  res.status(201).json({ success: true, data: proposal });
});
