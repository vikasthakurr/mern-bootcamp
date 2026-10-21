import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { PlusIcon, TrashIcon } from "../components/Icons.jsx";

export default function Dashboard() {
  const { user, role } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-ink-900">
        Welcome, {user.name}
      </h1>
      <p className="mt-1 text-sm text-ink-500 capitalize">
        {role} dashboard
      </p>

      {role === "client" ? <ClientDashboard /> : <FreelancerDashboard />}
    </div>
  );
}

// Client view: post a job + see your own jobs (with delete).
function ClientDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Load all jobs, then keep only the ones this client posted.
  const { data, isLoading } = useQuery({
    queryKey: ["jobs", "all-for-dashboard"],
    queryFn: () => api.get("/jobs?limit=100"),
  });

  const myJobs = (data?.data || []).filter((j) => j.client?.id === user.id);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <PostJobForm
          onPosted={() => queryClient.invalidateQueries({ queryKey: ["jobs"] })}
        />
      </div>

      <div className="lg:col-span-3">
        <h2 className="font-semibold text-ink-900">Your posted jobs</h2>

        {isLoading && (
          <p className="mt-3 text-sm text-ink-500">Loading...</p>
        )}

        {data && myJobs.length === 0 && (
          <p className="mt-3 text-sm text-ink-500">
            You haven't posted any jobs yet.
          </p>
        )}

        <div className="mt-3 space-y-3">
          {myJobs.map((job) => (
            <MyJobRow key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}

// One row in the client's "my jobs" list, with a delete button.
function MyJobRow({ job }) {
  const queryClient = useQueryClient();

  const del = useMutation({
    mutationFn: () => api.del(`/jobs/${job.id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
  });

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <div className="min-w-0">
        <Link
          to={`/jobs/${job.id}`}
          className="font-medium text-ink-900 hover:text-brand-500"
        >
          {job.title}
        </Link>
        <p className="text-xs text-ink-500">
          {job.category} · ${job.budget}
        </p>
      </div>
      <button
        onClick={() => del.mutate()}
        disabled={del.isPending}
        className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-ink-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
      >
        <TrashIcon />
        Delete
      </button>
    </div>
  );
}

// The form a client uses to post a new job.
function PostJobForm({ onPosted }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [category, setCategory] = useState("web");

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/jobs", {
        title,
        description,
        budget: Number(budget),
        category,
      }),
    onSuccess: () => {
      setTitle("");
      setDescription("");
      setBudget("");
      onPosted();
    },
  });

  const field =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
    >
      <h2 className="flex items-center gap-2 font-semibold text-ink-900">
        <PlusIcon />
        Post a job
      </h2>

      <div className="mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-ink-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={field}
            placeholder="e.g. Build a landing page"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={field}
            placeholder="What needs to be done?"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-ink-700">
              Budget ($)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className={field}
              placeholder="500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-ink-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={field}
            >
              <option value="web">web</option>
              <option value="design">design</option>
              <option value="mobile">mobile</option>
              <option value="marketing">marketing</option>
              <option value="writing">writing</option>
            </select>
          </div>
        </div>
      </div>

      {mutation.isError && (
        <p className="mt-3 text-sm text-red-600">{mutation.error.message}</p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-4 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {mutation.isPending ? "Posting..." : "Post job"}
      </button>
    </form>
  );
}

// Freelancer view: a simple prompt to go browse jobs.
function FreelancerDashboard() {
  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <h2 className="text-lg font-semibold text-ink-900">
        Ready to find work?
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        Browse open jobs and submit proposals to clients.
      </p>
      <Link
        to="/jobs"
        className="mt-5 inline-block rounded-lg bg-brand-500 px-6 py-2.5 font-semibold text-white transition hover:bg-brand-600"
      >
        Browse jobs
      </Link>
    </div>
  );
}
