import { useState, useEffect } from "react";

// Custom hook: works just like useState,
// but it also saves the value in the browser's localStorage.
export function useLocalStorage(key, initialValue) {
  // When the app starts, read the saved value (if there is one).
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  // Every time the value changes, save it again.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
