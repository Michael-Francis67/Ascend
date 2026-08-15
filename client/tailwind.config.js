/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#0F4C4C", // Deep sea green
        "brand-secondary": "#1A6B6B",
        "brand-light": "#E8F0F0",
        charcoal: "#2D2D2D",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"], // Or a premium font
      },
    },
  },
  plugins: [],
};
