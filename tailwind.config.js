/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "SF Pro Rounded",
          "SF Pro Text",
          "SF Pro Display",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      zIndex: {
        base: "0",
        dock: "10",
        chrome: "20",
        overlay: "30",
        modal: "40",
        toast: "50",
      },
    },
  },
  plugins: [],
}
