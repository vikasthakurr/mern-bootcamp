import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { WalletIcon, TagIcon, UserIcon } from "../components/Icons.jsx";

// A button that opens (or creates) a chat between the client and a
// freelancer for this job, then jumps to the messages page.
function MessageButton({ jobId, freelancerId }) {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => api.post("/chat/conversations", { jobId, freelancerId }),
    onSuccess: (res) => {
      navigate(`/messages?c=${res.data.id}`);
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50 disabled:opacity-60"
    >
      {mutation.isPending ? "Opening..." : "Message"}
    </button>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const { user, role, isLoggedIn } = useAuth();
  const queryClient = useQueryClient();

  // Load the single job.
  const jobQuery = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.get(`/jobs/${id}`),
  });

  const job = jobQuery.data?.data;

  // Is the logged-in client the owner of this job?
  const isOwner =
    isLoggedIn && role === "client" && job && job.client?.id === user.id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/jobs" className="text-sm text-brand-500 hover:text-brand-600">
        &larr; Back to jobs
      </Link>

      {jobQuery.isLoading && (
        <div className="mt-4 h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      )}

      {jobQuery.isError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {jobQuery.error.message}
        </div>
      )}

      {job && (
        <>
          {/* Job header */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-ink-900">{job.title}</h1>
              <span className="flex items-center gap-1 rounded-lg bg-brand-50 px-3 py-1.5 font-semibold text-brand-600">
                <WalletIcon />${job.budget}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                <TagIcon className="h-3.5 w-3.5" />
                {job.category}
              </span>
              {job.client && (
                <span className="flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5" />
                  Posted by {job.client.name}
                </span>
              )}
            </div>

            <p className="mt-5 whitespace-pre-line text-ink-700">
              {job.description}
            </p>
          </div>

          {/* Freelancer: proposal form */}
          {role === "freelancer" && (
            <ProposalForm jobId={job.id} freelancerId={user.id} />
          )}

          {/* Client owner: proposals list */}
          {isOwner && <ProposalsList jobId={job.id} />}

          {/* Not logged in prompt */}
          {!isLoggedIn && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-sm text-ink-500">
              <Link to="/login" className="font-medium text-brand-500">
                Log in
              </Link>{" "}
              as a freelancer to submit a proposal.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// A form freelancers use to submit a proposal on this job.
function ProposalForm({ jobId, freelancerId }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [done, setDone] = useState(false);

  // useMutation handles the POST, with loading + error states.
  const mutation = useMutation({
    mutationFn: () =>
      api.post(`/jobs/${jobId}/proposals`, {
        coverLetter,
        bidAmount: Number(bidAmount),
      }),
    onSuccess: () => {
      setDone(true);
      setCoverLetter("");
      setBidAmount("");
    },
  });

  if (done) {
    return (
      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5 text-sm text-green-700">
        <p>Your proposal was submitted. Good luck!</p>
        <p className="mt-2 text-green-800">
          You can now message the client about this job.
        </p>
        <div className="mt-3">
          <MessageButton jobId={jobId} freelancerId={freelancerId} />
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
    >
      <h2 className="font-semibold text-ink-900">Submit a proposal</h2>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink-700">
          Cover letter
        </label>
        <textarea
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="Tell the client why you're a good fit"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-ink-700">
          Your bid ($)
        </label>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="mt-1 w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          placeholder="450"
        />
      </div>

      {mutation.isError && (
        <p className="mt-3 text-sm text-red-600">{mutation.error.message}</p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-5 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
      >
        {mutation.isPending ? "Submitting..." : "Submit proposal"}
      </button>
    </form>
  );
}

// The owning client sees the proposals submitted on their job.
function ProposalsList({ jobId }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["proposals", jobId],
    queryFn: () => api.get(`/jobs/${jobId}/proposals`),
  });

  const proposals = data?.data || [];

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h2 className="font-semibold text-ink-900">
        Proposals {data ? `(${data.count})` : ""}
      </h2>

      {isLoading && <p className="mt-3 text-sm text-ink-500">Loading...</p>}
      {isError && <p className="mt-3 text-sm text-red-600">{error.message}</p>}

      {data && proposals.length === 0 && (
        <p className="mt-3 text-sm text-ink-500">No proposals yet.</p>
      )}

      <div className="mt-4 space-y-3">
        {proposals.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 font-medium text-ink-900">
                <UserIcon className="h-4 w-4 text-ink-500" />
                {p.freelancer?.name || "Freelancer"}
              </p>
              <span className="rounded-md bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-600">
                ${p.bidAmount}
              </span>
            </div>
            <p className="mt-2 text-sm text-ink-700">{p.coverLetter}</p>
            {p.freelancer && (
              <div className="mt-3">
                <MessageButton jobId={jobId} freelancerId={p.freelancer.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
