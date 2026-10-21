import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// ProtectedRoute is a wrapper that guards a page.
// It checks two things before showing the page:
//   1. Is the user logged in?
//   2. Is their role allowed here?
//
// "allow" is a list of roles that may see this page, e.g. ["admin"].
export default function ProtectedRoute({ allow, children }) {
  const { currentUser, role } = useAuth();

  // Not logged in -> send to the login page.
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role -> send to a "not allowed" page.
  if (allow && !allow.includes(role)) {
    return <Navigate to="/no-access" replace />;
  }

  // All good -> show the page.
  return children;
}
