/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--ink)",
        primary: "var(--orange)",
        "primary-bright": "var(--orange-bright)",
        rust: "var(--rust)",
        success: "var(--success)",
        error: "var(--error)",
        white: "var(--surface)",
        black: "var(--ink)",
        gray: {
          50: "var(--surface-3)",
          100: "var(--surface-2)",
          150: "var(--surface-2)",
          200: "var(--line)",
          300: "var(--line-2)",
          400: "var(--ink-3)",
          500: "var(--ink-2)",
          600: "var(--ink-2)",
          700: "var(--ink-2)",
          800: "var(--ink)",
          900: "var(--ink)",
          950: "var(--ink)",
        },
      },
      fontFamily: {
        sans: ["var(--font)", "system-ui", "sans-serif"],
        deva: ["var(--font-deva)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

