// A small wrapper around fetch that talks to our backend API.
//
// It does three jobs:
//   1. Adds the base URL so we don't repeat it everywhere.
//   2. Attaches the JWT token (if we have one) as an Authorization header.
//   3. Unwraps the { success, data } envelope and throws on errors,
//      so React Query can show loading / error states cleanly.

// The backend runs on port 4000. Change this if your server moves.
const BASE_URL = "http://localhost:4000/api";

// We read the token straight from localStorage on each call.
// (AuthContext is what writes it there when you log in.)
function getToken() {
  return localStorage.getItem("talentbridge:token");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Try to read the JSON body (some responses may be empty).
  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  // The backend sends { success: false, error } on failure.
  if (!response.ok || (body && body.success === false)) {
    const message = body?.error || "Request failed";
    throw new Error(message);
  }

  // Return the whole body so callers can read data + pagination fields.
  return body;
}

// Shortcut helpers for each HTTP method.
export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: "POST", body: JSON.stringify(data) }),
  put: (path, data) => request(path, { method: "PUT", body: JSON.stringify(data) }),
  del: (path) => request(path, { method: "DELETE" }),
};
