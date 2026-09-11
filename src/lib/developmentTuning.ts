export function isTuningCornerCurve() {
  return import.meta.env.DEV
    && typeof window !== "undefined"
    && new URLSearchParams(window.location.search).get("tune") === "corners"
}
