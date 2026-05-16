import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css"
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
        },
        covmerc: {
          primary: "#3B5D50",
          secondary: "#F9BF29",
          black: "#2F2F2F",
          textLight: "#6A6E6C",
          grayLight: "#EFF2F1",
          error: "#C53030"
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
        soft: "0 18px 35px rgba(47, 47, 47, 0.08)",
        card: "0 8px 24px rgba(59, 93, 80, 0.08)",
        lift: "0 20px 40px rgba(47, 47, 47, 0.12)"
      },
      animation: {
        shimmer: "shimmer 2s ease-in-out infinite"
      },
      keyframes: {
        shimmer: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" }
        }
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

