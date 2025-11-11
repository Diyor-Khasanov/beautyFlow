export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#193A53",
          light: "#254E69",
          dark: "#0F2533",
        },
        accent: {
          DEFAULT: "#00D1FF",
          dark: "#00B8E0",
        },
        "dark-bg": "#10172A",
        "card-bg": "#192038",
        "text-light": "#F8F9FA",
        "text-muted": "#B0B9C9",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        "lg-dark":
          "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
