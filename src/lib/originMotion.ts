import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

import { cssTimeToMilliseconds } from "./cssTime"

// Origin-aware open/close: a modal travels from (and back to) the thing that
// opened it, so it reads as that card or tile growing into place rather than as
// a surface appearing over the page. Shared by the project preview gallery and
// the writings sheet, which open on the same line and now leave the same way.
//
// The geometry is one Web Animations flight on the travelling surface, so the
// translate and the scale stay a single coordinated motion; the fade stays in
// CSS. Durations alias the shared CSS scale and are read from the element, so a
// token change retimes the flight with the transitions around it.

// The open is deliberately not an expo-out. A quintic curve is 97% done in its
// first third, which for a surface growing out of a card means the growth is
// over before the eye catches it and the rest of the duration is dead air. This
// one spends its time where the size change is actually visible, then settles.
export const originOpenEasePoints = [0.32, 0.8, 0.32, 1] as const
export const originCloseEasePoints = [0.4, 0, 1, 1] as const
export const toCssEasing = (points: readonly number[]) => `cubic-bezier(${points.join(", ")})`

// Not a full flight from the card to the centre. Replaying the whole distance
// reads as a journey — the modal has to cross the page, so it needs a long
// duration to not feel thrown, and the wait is worse than the payoff. Instead
// the travel is capped: enough to say "from over there" as the surface settles,
// then it is out of the way. The direction survives the cap, the distance does
// not.
const originMaxTravel = 44
const originScaleMin = 0.92
const originScaleMax = 1
// Used when the anchor is off-screen: a plain 20px lift, no travel.
const originFallback = { dx: 0, dy: 20, scale: 0.96 }

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

// An anchor scrolled out of view would send the surface flying off-screen, so
// only the ones the viewer can actually see get to aim a flight.
export function visibleOriginRect(element: Element | null | undefined): DOMRect | null {
  if (!element) return null

  const rect = element.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return null

  return rect.bottom > 0 && rect.top < window.innerHeight ? rect : null
}

function getOriginOffset(originRect: DOMRect, targetRect: DOMRect) {
  if (targetRect.width <= 0 || targetRect.height <= 0) return null
  if (originRect.width <= 0 || originRect.height <= 0) return null

  // Clamped rather than a strict FLIP: the point is to hint at the origin, not
  // to replay the geometry exactly.
  const scale = Math.min(Math.max(originRect.width / targetRect.width, originScaleMin), originScaleMax)
  const dx = originRect.left + originRect.width / 2 - (targetRect.left + targetRect.width / 2)
  const dy = originRect.top + originRect.height / 2 - (targetRect.top + targetRect.height / 2)

  // Keep the bearing, drop the distance: a card in the far corner and one just
  // below the fold should both nudge in by the same amount, differing only in
  // which way they come from.
  const distance = Math.hypot(dx, dy)
  const cap = distance > originMaxTravel ? originMaxTravel / distance : 1

  return { dx: dx * cap, dy: dy * cap, scale }
}

// cubic-bezier(x1, y1, x2, y2) evaluated as a progress function.
function cubicBezierEasing([x1, y1, x2, y2]: readonly number[]) {
  const axis = (a: number, b: number, t: number) =>
    3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t

  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1

    let low = 0
    let high = 1
    let t = x
    // Bisection: 24 rounds is far inside a sub-pixel and costs nothing at the
    // ~50 samples we take per open.
    for (let round = 0; round < 24; round += 1) {
      if (axis(x1, x2, t) < x) low = t
      else high = t
      t = (low + high) / 2
    }
    return axis(y1, y2, t)
  }
}

const easeOpen = cubicBezierEasing(originOpenEasePoints)
const easeClose = cubicBezierEasing(originCloseEasePoints)

// Enough samples that the linear interpolation between them is invisible at
// 120Hz over the longest of these animations.
const originSampleCount = 48

// Bake the easing into sampled keyframes so the origin-aware translation and
// scale remain one coordinated motion on the complete surface.
function buildOriginKeyframes(
  mode: "open" | "close",
  offset: { dx: number; dy: number; scale: number },
) {
  const ease = mode === "open" ? easeOpen : easeClose
  const keyframes: Keyframe[] = []

  for (let step = 0; step < originSampleCount; step += 1) {
    const time = step / (originSampleCount - 1)
    // `travel` is 0 at the origin card and 1 at the modal's resting place.
    const eased = ease(time)
    const travel = mode === "open" ? eased : 1 - eased
    const scale = offset.scale + (1 - offset.scale) * travel
    const dx = offset.dx * (1 - travel)
    const dy = offset.dy * (1 - travel)

    keyframes.push({
      offset: time,
      easing: "linear",
      transform: `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale.toFixed(5)})`,
    })
  }

  return keyframes
}

export type OriginTravelOptions = {
  /** The surface that flies. Null while the dialog's portal is unmounted. */
  node: HTMLElement | null
  /** Live geometry of the thing the surface comes out of, re-read per flight. */
  getOriginRect: () => DOMRect | null
  /** False leaves the surface's CSS pose in charge: reduced motion, or no anchor to aim at. */
  enabled: boolean
  /** Custom properties the two durations are read from, on the flying node. */
  openDurationProperty: string
  closeDurationProperty: string
  /** Raised for the length of a flight, for clipping and compositing hints. */
  onFlight?: (flying: boolean) => void
}

/**
 * Runs the flight on demand. The caller decides when a surface opens and closes
 * — Base UI keeps the popup mounted through its exit, so the close flight is
 * started from the same place the exit transition is.
 */
export function useOriginTravel(options: OriginTravelOptions) {
  const inputs = useRef(options)
  const animations = useRef<Animation[]>([])

  // A layout effect, so a click that re-aims the flight and opens in the same
  // commit animates from the new anchor.
  useIsomorphicLayoutEffect(() => {
    inputs.current = options
  })

  const cancel = useCallback(() => {
    for (const animation of animations.current) animation.cancel()
    animations.current = []
    inputs.current.onFlight?.(false)
  }, [])

  const run = useCallback((mode: "open" | "close") => {
    const { node, getOriginRect, enabled, onFlight, openDurationProperty, closeDurationProperty } =
      inputs.current
    if (!node || !enabled) return
    if (typeof node.animate !== "function") return

    cancel()

    // The node sits at rest here (any in-flight animation was cancelled), so
    // this is its untransformed target geometry.
    const originRect = getOriginRect()
    const offset = (originRect && getOriginOffset(originRect, node.getBoundingClientRect())) ?? originFallback
    const durationProperty = mode === "open" ? openDurationProperty : closeDurationProperty

    const flight = node.animate(buildOriginKeyframes(mode, offset), {
      duration: cssTimeToMilliseconds(getComputedStyle(node).getPropertyValue(durationProperty)),
      // The curve is already baked into the keyframes.
      easing: "linear",
      fill: mode === "open" ? "none" : "forwards",
    })
    animations.current = [flight]
    onFlight?.(true)

    // Only the open path lowers the flag on finish. On close the transform is
    // held by `fill: forwards` until the popup unmounts, so releasing early
    // would flash the very clipping the flag exists to suppress; the next
    // `cancel` clears it instead.
    if (mode === "open") flight.finished.then(() => onFlight?.(false)).catch(() => undefined)
  }, [cancel])

  useEffect(() => () => cancel(), [cancel])

  return { run, cancel }
}
