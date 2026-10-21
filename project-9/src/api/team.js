// This file talks to a real API over the internet.
// We use JSONPlaceholder, a free fake API that needs no API key.
// It returns a list of users, which we treat as our "team members".

const API_URL = "https://jsonplaceholder.typicode.com/users";

// fetchTeam gets the team list from the server.
// It returns a Promise, which React Query will handle for us
// (loading, error, caching — all done by React Query).
export async function fetchTeam() {
  const response = await fetch(API_URL);

  // If the server responds with an error (like 404 or 500),
  // fetch does NOT throw by itself, so we throw here.
  // React Query will catch this and give us an "error" state.
  if (!response.ok) {
    throw new Error("Could not load the team. Please try again.");
  }

  const data = await response.json();

  // The API sends a lot of fields. We only keep what we need
  // and shape it nicely for our app.
  return data.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company.name,
  }));
}
