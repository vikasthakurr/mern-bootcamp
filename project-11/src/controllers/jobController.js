import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { jobModel } from "../models/jobModel.js";

export const listJobs = asyncHandler(async (req, res) => {
  let jobs = jobModel.all();

  const { category, search, minBudget, maxBudget, sort } = req.query;

  if (category) {
    jobs = jobs.filter((job) => job.category === category);
  }

  if (search) {
    const term = String(search).toLowerCase();
    jobs = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term)
    );
  }

  if (minBudget) {
    jobs = jobs.filter((job) => job.budget >= Number(minBudget));
  }

  if (maxBudget) {
    jobs = jobs.filter((job) => job.budget <= Number(maxBudget));
  }

  if (sort === "budget_asc") {
    jobs = [...jobs].sort((a, b) => a.budget - b.budget);
  } else if (sort === "budget_desc") {
    jobs = [...jobs].sort((a, b) => b.budget - a.budget);
  } else {
    jobs = [...jobs].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Number(req.query.limit) || 10);
  const total = jobs.length;
  const start = (page - 1) * limit;
  const paged = jobs.slice(start, start + limit);

  res.json({
    success: true,
    count: paged.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: paged,
  });
});

export const getJob = asyncHandler(async (req, res) => {
  const job = jobModel.findById(req.params.id);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }
  res.json({ success: true, data: job });
});

export const createJob = asyncHandler(async (req, res) => {
  const { title, description, budget, category } = req.body;

  const job = jobModel.create({
    title,
    description,
    budget,
    category,
    clientId: req.user.id,
  });

  res.status(201).json({ success: true, data: job });
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = jobModel.findById(req.params.id);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  if (job.clientId !== req.user.id) {
    throw ApiError.forbidden("You can only update your own jobs");
  }

  const { title, description, budget, category } = req.body;
  const changes = {};
  if (title !== undefined) changes.title = title;
  if (description !== undefined) changes.description = description;
  if (budget !== undefined) changes.budget = budget;
  if (category !== undefined) changes.category = category;

  const updated = jobModel.update(job.id, changes);
  res.json({ success: true, data: updated });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = jobModel.findById(req.params.id);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  if (job.clientId !== req.user.id) {
    throw ApiError.forbidden("You can only delete your own jobs");
  }

  jobModel.remove(job.id);
  res.json({ success: true, message: "Job deleted" });
});
