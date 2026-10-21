import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Keep a predictable dev URL so the backend CORS origin always matches.
    port: 5173,
    strictPort: true,
  },
});
