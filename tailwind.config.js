/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      zIndex: {
        base: "0",
        dock: "10",
        chrome: "20",
      },
    },
  },
  plugins: [],
}
