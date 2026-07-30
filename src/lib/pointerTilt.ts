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

/**
 * Gentler values for the work-history popover. It is roughly ten times the
 * width of a logo chip, so the chip's sweep reads as a slot machine rather
 * than a lean. This lands at about ±1.75deg at the edges.
 */
export const popoverTilt: PointerTiltScales = {
  anchorX: 6,
  anchorY: 2,
  tiltX: 1.5,
  tiltY: 3.5,
  lift: 0.004,
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
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

/** Return the tilt variables in `prefix` to their resting values. */
export function resetPointerTilt(target: HTMLElement, prefix: string) {
  const property = names(prefix)

  target.style.setProperty(property.anchorX, "0px")
  target.style.setProperty(property.anchorY, "0px")
  target.style.setProperty(property.tiltX, "0deg")
  target.style.setProperty(property.tiltY, "0deg")
  target.style.setProperty(property.lift, "1")
}
