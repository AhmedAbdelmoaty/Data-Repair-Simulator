import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#0f1115",
        panel: "#161920",
        accent: "#68d391",
        border: "#1f2430"
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0,0,0,0.35)",
      }
    },
  },
  plugins: [],
};

export default config;
