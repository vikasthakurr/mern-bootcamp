import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useData } from "../context/DataContext.jsx";

// The top navigation bar.
// The links we show depend on the logged-in user's role.
export default function Navbar() {
  const { currentUser, role, logout } = useAuth();
  const { resetData } = useData();
  const navigate = useNavigate();

  // Restore the original seed data (helpful during a live demo).
  function handleReset() {
    resetData();
    navigate("/");
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="bg-white border-b border-slate-200">
      <nav className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-extrabold text-blue-600">
          🩺 MediBook
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          {/* Reset the demo data back to seed.js values */}
          <button
            onClick={handleReset}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-slate-600 hover:bg-slate-100"
          >
            Reset data
          </button>

          {/* Every logged-in user can see the doctors list */}
          {currentUser && (
            <Link to="/doctors" className="text-slate-600 hover:text-blue-600">
              Doctors
            </Link>
          )}

          {/* Patient-only link */}
          {role === "patient" && (
            <Link to="/patient" className="text-slate-600 hover:text-blue-600">
              My Appointments
            </Link>
          )}

          {/* Doctor-only link */}
          {role === "doctor" && (
            <Link to="/doctor" className="text-slate-600 hover:text-blue-600">
              My Patients
            </Link>
          )}

          {/* Admin-only link */}
          {role === "admin" && (
            <Link to="/admin" className="text-slate-600 hover:text-blue-600">
              Admin Panel
            </Link>
          )}

          {/* Show name + logout, or a login link */}
          {currentUser ? (
            <>
              <span className="text-slate-400">|</span>
              <span className="text-slate-700">
                {currentUser.name}{" "}
                <span className="text-xs text-blue-500">({role})</span>
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
