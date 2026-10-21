import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchIcon,
  LayersIcon,
  PenIcon,
  PhoneIcon,
  MegaphoneIcon,
  BriefcaseIcon,
  ArrowRightIcon,
} from "../components/Icons.jsx";

// The categories shown as tiles on the landing page.
// Clicking one jumps to the jobs page pre-filtered by that category.
const categories = [
  { key: "web", label: "Web Development", Icon: LayersIcon },
  { key: "design", label: "Design", Icon: PenIcon },
  { key: "mobile", label: "Mobile Apps", Icon: PhoneIcon },
  { key: "marketing", label: "Marketing", Icon: MegaphoneIcon },
];

export default function Home() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  // The hero search sends the keyword to the jobs page as a query param.
  function handleSearch(e) {
    e.preventDefault();
    const query = term.trim()
      ? `?search=${encodeURIComponent(term.trim())}`
      : "";
    navigate(`/jobs${query}`);
  }

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-brand-50">
        {/* Animated decorative blobs in the background */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-200/50 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-brand-100/60 blur-3xl animate-blob [animation-delay:3s]" />
        {/* Soft dotted grid overlay */}
        <div className="pointer-events-none absolute inset-0 hero-grid opacity-60" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
          {/* Left: copy + search */}
          <div>
            <span className="inline-block animate-fade-up rounded-full bg-white px-4 py-1.5 text-sm font-medium text-brand-600 shadow-card">
              No. 1 freelance marketplace
            </span>

            <h1 className="mt-6 animate-fade-up text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl">
              Find a job that suits
              <br />
              your{" "}
              <span className="text-brand-500">interest &amp; skills.</span>
            </h1>

            <p className="mt-4 max-w-xl animate-fade-up-delay text-lg text-ink-500">
              Browse thousands of freelance jobs from clients around the world.
              Post a role or send a proposal in minutes.
            </p>

            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="mt-8 flex max-w-xl animate-fade-up-delay2 items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-hover"
            >
              <span className="pl-3 text-ink-500">
                <SearchIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Job title, keyword, or company"
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Search
              </button>
            </form>

            {/* Quick stats strip */}
            <div className="mt-10 grid max-w-xl animate-fade-up-delay2 grid-cols-3 gap-4">
              <Stat value="1,75,324" label="Live jobs" />
              <Stat value="97,354" label="Companies" />
              <Stat value="38,47,154" label="Candidates" />
            </div>
          </div>

          {/* Right: floating illustration made of cards */}
          <div className="relative hidden h-80 lg:block">
            <div className="absolute left-6 top-4 w-60 animate-float rounded-2xl border border-slate-200 bg-white p-4 shadow-hover">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 font-bold text-brand-500">
                  W
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    Web Developer
                  </p>
                  <p className="text-xs text-ink-500">Remote · Full time</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-ink-700">
                  web
                </span>
                <span className="text-sm font-semibold text-brand-600">
                  $500
                </span>
              </div>
            </div>

            <div className="absolute right-2 top-28 w-56 animate-float-slow rounded-2xl border border-slate-200 bg-white p-4 shadow-hover">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 font-bold text-green-600">
                  D
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-900">
                    Logo Designer
                  </p>
                  <p className="text-xs text-ink-500">Contract</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-ink-700">
                  design
                </span>
                <span className="text-sm font-semibold text-brand-600">
                  $150
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 left-10 w-52 animate-float rounded-2xl border border-slate-200 bg-white p-4 shadow-hover [animation-delay:1.5s]">
              <p className="text-xs text-ink-500">This week</p>
              <p className="mt-1 text-2xl font-extrabold text-ink-900">1,240</p>
              <p className="text-xs text-ink-500">new proposals sent</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold text-ink-900">
            Popular categories
          </h2>
          <Link
            to="/jobs"
            className="flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            View all jobs <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ key, label, Icon }) => (
            <Link
              key={key}
              to={`/jobs?category=${key}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-hover"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500 transition group-hover:bg-brand-500 group-hover:text-white">
                <Icon />
              </span>
              <h3 className="mt-4 font-semibold text-ink-900">{label}</h3>
              <p className="mt-1 text-sm text-ink-500">Browse open roles</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-500 p-10 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-white">
              <BriefcaseIcon />
            </span>
            <div>
              <h3 className="text-xl font-bold text-white">
                Ready to start hiring?
              </h3>
              <p className="mt-1 text-sm text-brand-100">
                Post a job and reach skilled freelancers today.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-600 transition hover:bg-brand-50"
          >
            Post a job
          </Link>
        </div>
      </section>
    </div>
  );
}

// A single stat in the hero strip.
function Stat({ value, label }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-500 shadow-card">
        <BriefcaseIcon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-lg font-bold text-ink-900">{value}</p>
        <p className="text-xs text-ink-500">{label}</p>
      </div>
    </div>
  );
}
