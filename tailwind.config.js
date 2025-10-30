/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'bg-card-light',
    'text-text-light',
    'text-text-dark',
    'border-light',
    'bg-primary',
    'text-primary',
    'shadow-soft',
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a",
        "primary-light": "#22c55e",
        "primary-dark": "#15803d",
        "text-dark": "#1f2937",
        "text-light": "#4b5563",
        "card-light": "#f9fafb",
        "border-light": "#e5e7eb",
      },
      borderRadius: {
        xl: "1rem",
      },
      boxShadow: {
        soft: "0 2px 6px rgba(0,0,0,0.05)",
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
