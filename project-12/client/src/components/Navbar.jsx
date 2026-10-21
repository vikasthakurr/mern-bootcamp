import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { BriefcaseIcon, LogoutIcon, UserIcon } from "./Icons.jsx";
import NotificationBell from "../chat/NotificationBell.jsx";

// The top navigation bar. Links change based on whether the user
// is logged in and what their role is.
export default function Navbar() {
  const { user, role, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <BriefcaseIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold text-ink-900">
              TalentBridge
            </span>
          </Link>

          <div className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link to="/jobs" className="text-ink-700 hover:text-brand-500">
              Find Jobs
            </Link>
            {isLoggedIn && (
              <>
                <Link
                  to="/dashboard"
                  className="text-ink-700 hover:text-brand-500"
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  className="text-ink-700 hover:text-brand-500"
                >
                  Messages
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <NotificationBell />
              <Link
                to="/profile"
                className="hidden items-center gap-1.5 text-ink-700 hover:text-brand-500 sm:flex"
              >
                <UserIcon className="h-4 w-4" />
                {user.name}
                <span className="text-xs text-brand-500">({role})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-ink-700 transition hover:border-brand-200 hover:text-brand-500"
              >
                <LogoutIcon />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg border border-brand-200 px-4 py-2 text-brand-600 transition hover:bg-brand-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-brand-500 px-4 py-2 text-white transition hover:bg-brand-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
