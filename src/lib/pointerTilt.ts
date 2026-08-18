/**
 * Pointer-relative tilt for floating hover surfaces.
 *
 * Normalizes the pointer to -0.5…+0.5 within a reference box, then writes the
 * result as CSS custom properties so the tilt stays in the compositor. Panels
 * lean toward whichever edge of the word the cursor is nearest: right of centre
 * tilts right, left of centre tilts left.
 *
 * The reference box and the element carrying the variables are separate on
 * purpose — a popover anchored as a sibling of its trigger needs the pointer
 * measured against the trigger but the variables set on a shared ancestor.
 */

/**
 * Each value is the full edge-to-edge sweep, so hovering either edge yields
 * half of it: `tiltY: 8` leans ±4deg.
 */
export type PointerTiltScales = {
  /** Horizontal slide toward the cursor, in px. */
  anchorX: number
  /** Vertical slide toward the cursor, in px. */
  anchorY: number
  /** rotateX in degrees. Applied inverted, so the edge nearest the cursor dips. */
  tiltX: number
  /** rotateY in degrees. This is the left/right lean. */
  tiltY: number
  /** Extra scale as a fraction: 0.01 grows up to 0.5% at an edge. */
  lift: number
}

/** The original inline-logo-chip feel, kept as the default. */
export const logoChipTilt: PointerTiltScales = {
  anchorX: 12,
  anchorY: 4,
  tiltX: 4,
  tiltY: 8,
  lift: 0.01,
}

/** Half-strength values for elements nested inside a surface that already tilts. */
export const nestedChipTilt: PointerTiltScales = {
  anchorX: 12,
  anchorY: 4,
  tiltX: 2,
  tiltY: 4,
  lift: 0.006,
}

// Built once and reused: `applyPointerTilt` runs on every pointermove, and
// constructing a MediaQueryList per event is pure overhead on the hot path.
// The list stays live, so `.matches` still tracks preference changes.
let reducedMotionQuery: MediaQueryList | null = null

function prefersReducedMotion() {
  if (typeof window === "undefined") return false
  reducedMotionQuery ??= window.matchMedia("(prefers-reduced-motion: reduce)")
  return reducedMotionQuery.matches
}

function names(prefix: string) {
  return {
    anchorX: `--${prefix}-anchor-x`,
    anchorY: `--${prefix}-anchor-y`,
    tiltX: `--${prefix}-tilt-x`,
    tiltY: `--${prefix}-tilt-y`,
    lift: `--${prefix}-lift`,
  }
}

/**
 * Measure `pointer` against `box` and write the tilt variables onto `target`.
 *
 * `prefix` picks the variable namespace, e.g. `mosaic-hover` writes
 * `--mosaic-hover-tilt-y`.
 */
export function applyPointerTilt({
  target,
  box,
  pointer,
  scales,
  prefix,
}: {
  target: HTMLElement
  box: DOMRect
  pointer: { clientX: number; clientY: number }
  scales: PointerTiltScales
  prefix: string
}) {
  // Inline styles outrank a stylesheet media query, so the reduced-motion
  // opt-out has to happen here rather than in CSS.
  if (prefersReducedMotion()) {
    resetPointerTilt(target, prefix)
    return
  }

  const relativeX = box.width === 0 ? 0 : (pointer.clientX - box.left) / box.width - 0.5
  const relativeY = box.height === 0 ? 0 : (pointer.clientY - box.top) / box.height - 0.5
  const property = names(prefix)

  target.style.setProperty(property.anchorX, `${(relativeX * scales.anchorX).toFixed(2)}px`)
  target.style.setProperty(property.anchorY, `${(relativeY * scales.anchorY).toFixed(2)}px`)
  target.style.setProperty(property.tiltX, `${(-relativeY * scales.tiltX).toFixed(2)}deg`)
  target.style.setProperty(property.tiltY, `${(relativeX * scales.tiltY).toFixed(2)}deg`)
  target.style.setProperty(property.lift, `${(1 + Math.abs(relativeX) * scales.lift).toFixed(3)}`)
}

/**
 * Wrap a tilt handler so it runs at most once per frame.
 *
 * `pointermove` fires well above refresh rate, and each call reads a rect and
 * then writes five custom properties -- a read-after-write on every event, which
 * forces a synchronous layout each time. Coalescing into rAF caps that at one
 * per frame while still measuring fresh geometry (so it stays correct if the
 * page scrolled since the last move).
 */
export function coalescePointerMove<T extends HTMLElement>(
  apply: (element: T, pointer: { clientX: number; clientY: number }) => void,
) {
  let frame = 0
  let pending: { element: T; clientX: number; clientY: number } | null = null

  const handlePointerMove = (event: { currentTarget: T; clientX: number; clientY: number }) => {
    pending = { element: event.currentTarget, clientX: event.clientX, clientY: event.clientY }
    if (frame) return

    frame = requestAnimationFrame(() => {
      frame = 0
      const next = pending
      pending = null
      if (next) apply(next.element, next)
    })
  }

  handlePointerMove.cancel = () => {
    pending = null
    cancelAnimationFrame(frame)
    frame = 0
  }

  return handlePointerMove
}

/** Return the tilt variables in `prefix` to their resting values. */
export function resetPointerTilt(target: HTMLElement, prefix: string) {
  const property = names(prefix)

  target.style.setProperty(property.anchorX, "0px")
  target.style.setProperty(property.anchorY, "0px")
  target.style.setProperty(property.tiltX, "0deg")
  target.style.setProperty(property.tiltY, "0deg")
  target.style.setProperty(property.lift, "1")
}
