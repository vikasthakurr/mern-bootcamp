import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/Job.js";
import { Proposal } from "../models/Proposal.js";

export const listProposalsForJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  if (String(job.client) !== req.user.id) {
    throw ApiError.forbidden("You can only view proposals on your own jobs");
  }

  const proposals = await Proposal.find({ job: job.id })
    .populate("freelancer", "name role")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: proposals.length, data: proposals });
});

export const createProposal = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  const { coverLetter, bidAmount } = req.body;

  const proposal = await Proposal.create({
    job: job.id,
    freelancer: req.user.id,
    coverLetter,
    bidAmount,
  });

  await proposal.populate("freelancer", "name role");

  res.status(201).json({ success: true, data: proposal });
});
