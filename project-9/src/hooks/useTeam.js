import { useQuery } from "@tanstack/react-query";
import { fetchTeam } from "../api/team.js";

// A custom hook that wraps React Query's useQuery.
// Keeping it here means components just call useTeam() and get
// back the data, loading flag, and error — no fetch details needed.
export function useTeam() {
  return useQuery({
    // queryKey: a unique name for this data. React Query uses it to
    // cache the result, so visiting again is instant (no refetch).
    queryKey: ["team"],

    // queryFn: the function that actually fetches the data.
    queryFn: fetchTeam,

    // staleTime: how long the data is considered "fresh".
    // For 1 minute React Query won't refetch in the background.
    staleTime: 1000 * 60,
  });
}
