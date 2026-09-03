import { useEffect, useState } from "react"

/**
 * Live subscription to the reduced-motion preference. SSR and pre-hydration
 * renders report false; the first effect pass corrects it and a mid-session
 * preference change re-renders. Carries the legacy addListener fallback for
 * the Safari versions that predate MediaQueryList's EventTarget interface.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setPrefersReducedMotion(mediaQuery.matches)
    sync()

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", sync)
      return () => mediaQuery.removeEventListener("change", sync)
    }

    mediaQuery.addListener(sync)
    return () => mediaQuery.removeListener(sync)
  }, [])

  return prefersReducedMotion
}
