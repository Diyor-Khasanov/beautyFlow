/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "var(--color-bg-primary)",
        "bg-secondary": "var(--color-bg-secondary)",
        "text-default": "var(--color-text-default)",
        "text-muted": "var(--color-text-muted)",
        "accent-blue": "var(--color-accent-blue)",
        "accent-red": "var(--color-accent-red)",
        "border-color": "var(--color-border-color)",
      },
      boxShadow: {
        "card-dark":
          "0 4px 6px rgba(0, 0, 0, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
