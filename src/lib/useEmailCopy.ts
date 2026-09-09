import { useEffect, useRef, useState } from "react"

/** How long a copy stays confirmed before the address goes back to being an
    offer. Long enough to be read, short enough that the next hover is an
    invitation again rather than the tail of the last press. */
const CONFIRMATION_MS = 1600

/**
 * The press behind every copy of the address on this site: the corner chip,
 * the hero line, and the address inside the About sheet's prose all put the
 * same string on the clipboard and hold the same confirmation window, so the
 * timing and the fallback live here rather than being written out per wearer.
 */
export function useEmailCopy(email: string) {
  const [isCopied, setIsCopied] = useState(false)
  const resetTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimeoutRef.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      // No clipboard permission (or no clipboard at all): fall back to the
      // thing the address was for.
      window.location.href = `mailto:${email}`
      return
    }
    setIsCopied(true)
    // Restart the window on every copy so a second click always gets its own
    // full confirmation instead of inheriting the tail of the first one.
    window.clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = window.setTimeout(() => setIsCopied(false), CONFIRMATION_MS)
  }

  return { isCopied, copy }
}
