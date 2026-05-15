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
        covmerc: {
          primary: "#4E5A37",
          secondary: "#36B4C9",
          light: "#BCE6ED",
          textLight: "#868C9C",
          grayLight: "#F6F8FA",
          blue: "#375DFB",
          gray: "#808080",
          white: "#ffffff",
          black: "#303030",
          success: "#27AE60",
          warning: "#F4C790",
          error: "#DF1C41"
        }
      },
      fontFamily: {
        clash: ["ClashDisplay", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 35px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};

export default config;

