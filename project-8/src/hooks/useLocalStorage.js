import { useState, useEffect } from "react";

// A custom hook that works just like useState,
// but it also saves the value in the browser's localStorage.
// So the data stays even after you refresh the page.
export function useLocalStorage(key, initialValue) {
  // When the component first loads, try to read the saved value.
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);

    // Nothing saved yet -> start with the value we were given.
    if (!saved) {
      return initialValue;
    }

    // The saved value is text, so we turn it back into a real
    // object/array with JSON.parse. We wrap it in try/catch because
    // if the saved text is broken, parsing would crash the whole app.
    try {
      return JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  // Every time the value changes, save it back to localStorage.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
