/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Chakra Petch", "sans-serif"],
        ui: ["Oxanium", "sans-serif"],
        body: ["Exo 2", "sans-serif"],
      },
    },
  },
  plugins: [],
};
