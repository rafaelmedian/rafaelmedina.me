/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Match the layout thresholds documented by /design-system.
    screens: {
      xs: "328px",
      sm: "480px",
      compact: "640px",
      md: "700px",
      lg: "900px",
      xl: "1320px",
    },
    fontSize: {
      xs: "var(--text-xs)",
      sm: "var(--text-sm)",
      base: "var(--text-md)",
      md: "var(--text-md)",
      lg: "var(--text-lg)",
    },
    borderRadius: {
      none: "0",
      sm: "var(--radius-sm)",
      md: "var(--radius-md)",
      lg: "var(--radius-lg)",
      full: "var(--radius-full)",
    },
    extend: {
      colors: {
        canvas: "var(--canvas)",
        ink: "var(--ink)",
        body: "var(--body-color)",
        beneath: "var(--body-bg)",
        tile: "var(--mosaic-card-surface)",
        muted: "var(--muted)",
        "muted-soft": "var(--muted-soft)",
        focus: "var(--focus-ring)",
        accent: "var(--accent)",
      },
      fontFamily: {
        ui: "var(--font-ui)",
        body: "var(--font-body)",
      },
      boxShadow: { overlay: "var(--shadow-overlay)" },
      transitionDuration: {
        fast: "var(--duration-fast)",
        quick: "var(--duration-quick)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        smooth: "var(--ease-smooth)",
        exit: "var(--ease-exit)",
      },
      // CSS remains the source of truth for every global stacking layer.
      zIndex: {
        base: "0",
        dock: "var(--z-dock)",
        chrome: "var(--z-chrome)",
        corner: "var(--z-corner)",
        overlay: "var(--z-overlay)",
        social: "var(--z-social)",
        "dialog-backdrop": "var(--z-dialog-backdrop)",
        dialog: "var(--z-dialog)",
        reaction: "var(--z-reaction)",
        "skip-link": "var(--z-skip-link)",
      },
    },
  },
  plugins: [],
}
