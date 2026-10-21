/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // MyJob-style palette: a strong blue primary on cool grays.
        brand: {
          50: "#e7f0fb",
          100: "#cfe1f7",
          200: "#9fc3ef",
          500: "#0a65cc",
          600: "#0a5bb8",
          700: "#084d9c",
        },
        ink: {
          900: "#18191c",
          700: "#474c54",
          500: "#767f8c",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04)",
        hover: "0 10px 30px rgba(10, 101, 204, 0.12)",
      },
      keyframes: {
        "fade-up": {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, -20px) scale(1.1)" },
          "66%": { transform: "translate(-15px, 10px) scale(0.95)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-up-delay": "fade-up 0.6s ease-out 0.15s both",
        "fade-up-delay2": "fade-up 0.6s ease-out 0.3s both",
        float: "float 4s ease-in-out infinite",
        "float-slow": "float 6s ease-in-out infinite",
        blob: "blob 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
