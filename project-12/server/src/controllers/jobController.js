import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/Job.js";

const CLIENT_FIELDS = "name role";

export const listJobs = asyncHandler(async (req, res) => {
  const { category, search, minBudget, maxBudget, sort } = req.query;

  const filter = {};

  if (category) {
    filter.category = String(category).toLowerCase();
  }

  if (search) {
    const term = String(search);
    filter.$or = [
      { title: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } },
    ];
  }

  if (minBudget || maxBudget) {
    filter.budget = {};
    if (minBudget) filter.budget.$gte = Number(minBudget);
    if (maxBudget) filter.budget.$lte = Number(maxBudget);
  }

  let sortBy = { createdAt: -1 };
  if (sort === "budget_asc") sortBy = { budget: 1 };
  else if (sort === "budget_desc") sortBy = { budget: -1 };

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .populate("client", CLIENT_FIELDS)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    count: jobs.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: jobs,
  });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "client",
    CLIENT_FIELDS,
  );
  if (!job) {
    throw ApiError.notFound("Job not found");
  }
  res.json({ success: true, data: job });
});

export const createJob = asyncHandler(async (req, res) => {
  const { title, description, budget, category } = req.body;

  const job = await Job.create({
    title,
    description,
    budget,
    category,
    client: req.user.id,
  });

  await job.populate("client", CLIENT_FIELDS);

  res.status(201).json({ success: true, data: job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  if (String(job.client) !== req.user.id) {
    throw ApiError.forbidden("You can only update your own jobs");
  }

  const { title, description, budget, category } = req.body;
  if (title !== undefined) job.title = title;
  if (description !== undefined) job.description = description;
  if (budget !== undefined) job.budget = budget;
  if (category !== undefined) job.category = category;

  await job.save();
  await job.populate("client", CLIENT_FIELDS);

  res.json({ success: true, data: job });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  if (String(job.client) !== req.user.id) {
    throw ApiError.forbidden("You can only delete your own jobs");
  }

  await job.deleteOne();

  res.json({ success: true, message: "Job deleted" });
});
