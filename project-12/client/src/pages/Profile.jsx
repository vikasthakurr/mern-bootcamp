import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  UserIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  PenIcon,
} from "../components/Icons.jsx";

// Turn an ISO date into a friendly "October 2026".
function formatMonth(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export default function Profile() {
  const { logout } = useAuth();

  // "view" shows the profile; "edit" shows the edit form.
  const [mode, setMode] = useState("view");

  // Read the logged-in user from the backend (/auth/me).
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me"),
  });

  const user = data?.data?.user;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">My profile</h1>
          <p className="mt-1 text-sm text-ink-500">
            Your account details, loaded from the server.
          </p>
        </div>
        {user && mode === "view" && (
          <button
            onClick={() => setMode("edit")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-ink-700 transition hover:border-brand-200 hover:text-brand-500"
          >
            <PenIcon className="h-4 w-4" />
            Edit profile
          </button>
        )}
      </div>

      {isLoading && (
        <div className="mt-6 h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      )}

      {isError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error.message}
        </div>
      )}

      {user && mode === "view" && <ProfileView user={user} onLogout={logout} />}

      {user && mode === "edit" && (
        <ProfileEdit user={user} onDone={() => setMode("view")} />
      )}
    </div>
  );
}

// The read-only profile card.
function ProfileView({ user, onLogout }) {
  return (
    <>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white">
            {user.name.charAt(0)}
          </span>
          <div>
            <h2 className="text-xl font-bold text-ink-900">{user.name}</h2>
            {user.title ? (
              <p className="text-sm text-ink-500">{user.title}</p>
            ) : null}
            <span className="mt-1 inline-block rounded-full bg-brand-50 px-3 py-0.5 text-xs font-medium capitalize text-brand-700">
              {user.role}
            </span>
          </div>
        </div>

        {user.bio ? (
          <p className="mt-5 whitespace-pre-line text-ink-700">{user.bio}</p>
        ) : (
          <p className="mt-5 text-sm italic text-ink-500">
            No bio yet. Click "Edit profile" to add one.
          </p>
        )}

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail label="Full name" value={user.name} />
          <Detail label="Email" value={user.email} />
          <Detail label="Role" value={user.role} capitalize />
          <Detail label="Member since" value={formatMonth(user.createdAt)} />
        </dl>
      </div>

      {/* Role-based quick action */}
      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
            {user.role === "client" ? <BriefcaseIcon /> : <UserIcon />}
          </span>
          <div>
            <p className="font-semibold text-ink-900">
              {user.role === "client" ? "Post a new job" : "Find your next job"}
            </p>
            <p className="text-sm text-ink-500">
              {user.role === "client"
                ? "Create a listing and start receiving proposals."
                : "Browse open roles and send a proposal."}
            </p>
          </div>
        </div>
        <Link
          to={user.role === "client" ? "/dashboard" : "/jobs"}
          className="flex items-center gap-1.5 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          {user.role === "client" ? "Go to dashboard" : "Browse jobs"}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <button
        onClick={onLogout}
        className="mt-6 rounded-lg border border-slate-300 px-4 py-2 text-sm text-ink-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        Log out
      </button>
    </>
  );
}

// The edit form. Saves via PUT /auth/me and updates the cache + AuthContext.
function ProfileEdit({ user, onDone }) {
  const queryClient = useQueryClient();
  const { updateUser } = useAuth();

  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title || "");
  const [bio, setBio] = useState(user.bio || "");

  const mutation = useMutation({
    mutationFn: () => api.put("/auth/me", { name, title, bio }),
    onSuccess: (res) => {
      const updated = res.data.user;
      // Update the React Query cache so the view shows new data instantly.
      queryClient.setQueryData(["me"], { data: { user: updated } });
      // Keep the navbar name in sync.
      updateUser(updated);
      onDone();
    },
  });

  const field =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
    >
      <h2 className="font-semibold text-ink-900">Edit profile</h2>

      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700">
            Headline / title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Full-stack developer"
            className={field}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="A short introduction about yourself"
            className={field}
          />
        </div>

        {/* Email + role are shown but not editable here */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Detail label="Email (not editable)" value={user.email} />
          <Detail label="Role (not editable)" value={user.role} capitalize />
        </div>
      </div>

      {mutation.isError && (
        <p className="mt-3 text-sm text-red-600">{mutation.error.message}</p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600 disabled:opacity-60"
        >
          {mutation.isPending ? "Saving..." : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-ink-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// One label/value row in the details grid.
function Detail({ label, value, capitalize }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <dt className="text-xs font-medium uppercase text-ink-500">{label}</dt>
      <dd
        className={`mt-1 font-medium text-ink-900 ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
