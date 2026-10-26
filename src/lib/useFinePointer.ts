import { useEffect, useState } from "react"

const finePointerQuery = "(hover: hover) and (pointer: fine)"

/**
 * Whether the primary input is a mouse or trackpad that can hover. SSR and
 * pre-hydration renders report false, so touch-first markup is what ships in
 * the HTML; the first effect pass upgrades it, and docking a tablet to a
 * trackpad mid-session re-renders.
 */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return

    const mediaQuery = window.matchMedia(finePointerQuery)
    const sync = () => setFine(mediaQuery.matches)
    sync()
    mediaQuery.addEventListener("change", sync)
    return () => mediaQuery.removeEventListener("change", sync)
  }, [])

  return fine
}
