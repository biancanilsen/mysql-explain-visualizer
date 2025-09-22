import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Caminhos para os arquivos do seu projeto
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

    // Caminho para os componentes da HeroUI (único caminho necessário)
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};