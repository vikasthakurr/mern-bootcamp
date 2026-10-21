import { useState, useEffect } from "react";

// A custom hook that returns the current time and updates every second.
// We use setInterval inside useEffect, and clean it up when the
// component unmounts so we don't leave a timer running.
export function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);

    // Cleanup: stop the timer when the component goes away.
    return () => clearInterval(timer);
  }, []);

  return now;
}
