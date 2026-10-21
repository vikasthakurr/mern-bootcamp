import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import { store } from "./store/store.js";
import "./index.css";

// The QueryClient is React Query's "brain". It stores all the
// cached server data and knows when to refetch it.
const queryClient = new QueryClient();

// We wrap the app with TWO providers:
// 1. Redux <Provider>        -> our own app state (the board).
// 2. <QueryClientProvider>   -> server data fetched from the API.
// This is a clean split: Redux for local state, React Query for server state.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
