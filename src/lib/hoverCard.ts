import { useCallback, useEffect, useRef, useState } from "react"

// Long enough that a pointer crossing the pill on its way elsewhere never
// summons the card; short enough that a deliberate hover feels immediate.
const OPEN_DELAY_MS = 260
// Covers the diagonal trip from pill to card without the card blinking out.
const CLOSE_DELAY_MS = 140

/**
 * Hover-and-focus state for a card anchored under a pill. Returns props for the
 * wrapper that holds both, so the card stays up while the pointer travels into
 * it and while focus sits anywhere inside the pair.
 */
export function useHoverCard() {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<number | undefined>(undefined)
  const anchorRef = useRef<HTMLElement | null>(null)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const schedule = useCallback((nextOpen: boolean, delay: number) => {
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setIsOpen(nextOpen), delay)
  }, [])

  const close = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return

      const anchor = anchorRef.current
      const activeElement = document.activeElement
      const trigger = anchor?.firstElementChild
      if (
        anchor?.contains(activeElement) &&
        activeElement !== trigger &&
        trigger instanceof HTMLElement
      ) {
        trigger.focus()
      }
      close()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, close])

  const hoverProps = {
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      // Touch and pen taps go straight to the link; only a mouse hovers.
      if (event.pointerType !== "mouse") return
      schedule(true, OPEN_DELAY_MS)
    },
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType !== "mouse") return
      schedule(false, CLOSE_DELAY_MS)
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      anchorRef.current = event.currentTarget
      window.clearTimeout(timeoutRef.current)
      setIsOpen(true)
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      if (event.currentTarget.contains(event.relatedTarget)) return
      close()
    },
  }

  return { isOpen, close, hoverProps }
}
