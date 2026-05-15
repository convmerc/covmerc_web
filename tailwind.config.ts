import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        furni: {
          primary: "#3B5D50",
          accent: "#F9BF29",
          surface: "#EFF2F1",
          white: "#FFFFFF",
          ink: "#2F2F2F",
          muted: "#6A6E6C",
          success: "#2F855A",
          warning: "#D69E2E",
          danger: "#C53030"
        }
      },
      fontFamily: {
        sans: [
          "var(--font-plus-jakarta)",
          "Plus Jakarta Sans",
          "Inter",
          "system-ui",
          "sans-serif"
        ],
        display: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 35px rgba(47, 47, 47, 0.08)"
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;

