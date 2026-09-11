export function isTuningCornerCurve() {
  if (!import.meta.env.DEV || typeof window === "undefined") return false

  const tuner = new URLSearchParams(window.location.search).get("tune")
  return tuner === null || tuner === "corners"
}
