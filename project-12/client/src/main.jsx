import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./chat/NotificationContext.jsx";
import "./index.css";

// React Query's client holds all cached server data.
const queryClient = new QueryClient();

// We wrap the app in these providers:
// 1. BrowserRouter        -> page routing
// 2. QueryClientProvider  -> server data (jobs, proposals) via React Query
// 3. AuthProvider         -> who is logged in
// 4. NotificationProvider -> the shared chat socket + bell notifications
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
