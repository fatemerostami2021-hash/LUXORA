import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)", surface: "var(--surface)", fg: "var(--fg)",
        muted: "var(--muted)", line: "var(--line)", accent: "var(--accent)",
      },
      fontFamily: { sans: ["var(--font-sans)"] },
    },
  },
  plugins: [],
};
export default config;
