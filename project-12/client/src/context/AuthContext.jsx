import { createContext, useContext, useState } from "react";
import { api } from "../api/client.js";

// AuthContext remembers who is logged in across the whole app.
// It keeps the user + token in state AND in localStorage, so a page
// refresh keeps you logged in.
const AuthContext = createContext(null);

const TOKEN_KEY = "talentbridge:token";
const USER_KEY = "talentbridge:user";

export function AuthProvider({ children }) {
  // Start from whatever is saved in localStorage (if anything).
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  // Save the user + token everywhere after a successful login/register.
  function saveSession({ user, token }) {
    setUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
  }

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    saveSession(res.data);
  }

  async function register(name, email, password, role) {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    saveSession(res.data);
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  }

  // Replace the stored user after an edit (keeps the navbar in sync).
  function updateUser(nextUser) {
    setUser(nextUser);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  }

  const value = {
    user,
    role: user ? user.role : null,
    isLoggedIn: Boolean(user),
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A small helper so components can read auth info easily.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return context;
}
