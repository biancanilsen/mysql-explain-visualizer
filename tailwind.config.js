const { heroui } = require("@heroui/theme");
const { colors } = require("./../solicitacao-travel-frontend/src/shared/styles/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./node_modules/@heroui/react/**/*.{js,jsx,ts,tsx}", "./node_modules/@heroui/theme/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: colors,
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
