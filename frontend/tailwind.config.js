/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "restaurant-cream": "#fdf6e3",
        "restaurant-dark": "#1a202c",
        "restaurant-gold": "#d4af37",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0.97)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out forwards",
        "scale-in": "scale-in 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};
