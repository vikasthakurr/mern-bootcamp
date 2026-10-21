import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { users } from "../data/seed.js";

// AuthContext remembers which user is logged in.
// Any component can ask: "who is logged in?" and "what is their role?"
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // currentUser is null when nobody is logged in.
  // We save it in localStorage so a refresh keeps you logged in.
  const [currentUser, setCurrentUser] = useLocalStorage("medibook:user", null);

  // Check the email + password against our fake user list.
  // Returns true if login worked, false if it failed.
  function login(email, password) {
    const found = users.find(
      (u) => u.email === email && u.password === password,
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    role: currentUser ? currentUser.role : null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Small helper so components can read auth info easily.
// Instead of writing useContext(AuthContext) everywhere, we just call useAuth().
export function useAuth() {
  const context = useContext(AuthContext);

  // This will be null if we forgot to wrap the app in <AuthProvider>.
  // A clear message here is much easier to understand than a random crash.
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }

  return context;
}
