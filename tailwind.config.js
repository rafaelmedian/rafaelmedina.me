/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Mirrors the --z-* ladder in src/index.css so both sides agree.
      zIndex: {
        base: "0",
        dock: "var(--z-dock)",
        chrome: "var(--z-chrome)",
      },
    },
  },
  plugins: [],
}
