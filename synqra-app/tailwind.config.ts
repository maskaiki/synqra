import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-poppins)", "Poppins", "sans-serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
      },
      colors: {
        canvas: "var(--canvas)",
        surface: "var(--surface)",
        soft: "var(--soft)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        line: "var(--line)",
        navy: "var(--navy)",
      },
    },
  },
  plugins: [],
} satisfies Config;
