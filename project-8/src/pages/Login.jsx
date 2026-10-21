import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// A list of demo logins so students can try each role quickly.
const demoLogins = [
  { label: "Admin", email: "admin@med.com", password: "admin" },
  { label: "Doctor", email: "rao@med.com", password: "doctor" },
  { label: "Patient", email: "sam@med.com", password: "patient" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Controlled inputs: React holds the value of each field.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault(); // stop the page from reloading

    const ok = login(email, password);
    if (ok) {
      navigate("/"); // success -> go home
    } else {
      setError("Wrong email or password. Try a demo login below.");
    }
  }

  // Clicking a demo button fills the form for you.
  function fillDemo(demo) {
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Login</h1>
      <p className="mt-1 text-sm text-slate-500">
        Pick a demo role or type the details yourself.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="you@med.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="••••••"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-white font-medium hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      <div className="mt-6">
        <p className="text-xs font-medium text-slate-400 uppercase">
          Demo logins
        </p>
        <div className="mt-2 flex gap-2">
          {demoLogins.map((demo) => (
            <button
              key={demo.label}
              onClick={() => fillDemo(demo)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
