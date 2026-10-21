import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";

// A small feature card used lower down on the page.
function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-left">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

// The landing page. Shows a big hero section and a button
// that takes the user to the right place for their role.
export default function Home() {
  const { currentUser, role } = useAuth();
  const { doctors, appointments } = useData();

  // Decide where the main button should go, based on role.
  let dashboardLink = "/login";
  if (role === "admin") dashboardLink = "/admin";
  if (role === "doctor") dashboardLink = "/doctor";
  if (role === "patient") dashboardLink = "/patient";

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-slate-50">
        {/* Soft colored blobs in the background for a modern look */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          {/* Small pill badge above the headline */}
          <span className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            🩺 Your health, booked in seconds
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Book trusted doctors with{" "}
            <span className="text-blue-600">MediBook</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            A simple appointment portal for patients, doctors, and admins. Find
            a specialist, request a slot, and track your visit — all in one
            place.
          </p>

          {/* Call-to-action buttons (change based on login state) */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {currentUser ? (
              <Link
                to={dashboardLink}
                className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-blue-700"
              >
                Go to my dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-blue-700"
              >
                Get started
              </Link>
            )}
            <Link
              to="/doctors"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Browse doctors
            </Link>
          </div>

          {/* Quick live stats pulled from our data */}
          <div className="mx-auto mt-14 grid max-w-xl grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-extrabold text-blue-600">
                {doctors.length}
              </p>
              <p className="text-sm text-slate-500">Doctors</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-600">
                {appointments.length}
              </p>
              <p className="text-sm text-slate-500">Appointments</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-600">3</p>
              <p className="text-sm text-slate-500">User roles</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900">
          Everything you need in one portal
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <FeatureCard
            icon="📅"
            title="Easy booking"
            text="Patients pick a doctor, choose a date, and send a request in seconds."
          />
          <FeatureCard
            icon="✅"
            title="Doctor approvals"
            text="Doctors see their requests and approve or reject them with one click."
          />
          <FeatureCard
            icon="📊"
            title="Admin overview"
            text="Admins track every appointment and see live stats across the system."
          />
        </div>
      </section>
    </div>
  );
}
