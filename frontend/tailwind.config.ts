import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          light: "#A78BFA",
          dark: "#5B21B6",
        },
        accent: {
          pink: "#EC4899",
          blue: "#06B6D4",
          purple: "#8B5CF6",
        },
      },
    },
  },
  plugins: [],
};

export default config;

