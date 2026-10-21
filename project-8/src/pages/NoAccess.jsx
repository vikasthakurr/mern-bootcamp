import { Link } from "react-router-dom";

// Shown when a logged-in user tries to open a page
// that their role is not allowed to see.
export default function NoAccess() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold text-red-500">403</h1>
      <p className="mt-3 text-lg font-semibold text-slate-800">
        Access denied
      </p>
      <p className="mt-1 text-slate-500">
        Your role does not have permission to view this page.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700"
      >
        Back to home
      </Link>
    </div>
  );
}
