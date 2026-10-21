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
// Match the gallery's full-screen layout. There the gallery is the whole
// screen, so a capped nudge has nothing to say; it zooms out of the tile
// instead, the way iOS opens an App Store card or a Photos thumbnail. Without
// a tile to zoom from it lifts and lowers, without scaling the viewport.
const fullScreenQuery = "(max-width: 699.98px), (hover: none), (pointer: coarse)"
const verticalOffset = { dx: 0, dy: originFallback.dy, scale: 1 }

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

// An anchor scrolled out of view would send the surface flying off-screen, so
// only the ones the viewer can actually see get to aim a flight.
export function visibleOriginRect(element: Element | null | undefined): DOMRect | null {
  if (!element) return null

  const rect = element.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return null

  return rect.bottom > 0 && rect.top < window.innerHeight ? rect : null
}

// The corner a tile shows, which is not always its own: several tiles round an
// inner frame that fills them. The first element filling the tile's box with a
// radius is the outline the eye reads.
export function originCornerRadius(element: Element | null | undefined): number {
  if (!element) return 0

  const { width, height } = element.getBoundingClientRect()
  const candidates = [element, ...Array.from(element.querySelectorAll("*")).slice(0, 24)]
  for (const candidate of candidates) {
    const rect = candidate.getBoundingClientRect()
    if (Math.abs(rect.width - width) > 1 || Math.abs(rect.height - height) > 1) continue
    const radius = parseFloat(getComputedStyle(candidate).borderTopLeftRadius)
    if (radius > 0) return radius
  }
  return 0
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

// The zoom runs on a spring rather than a bezier, as UIKit's does: it leaves
// the tile fast and spends its tail easing into the edges of the screen, with
// no visible overshoot. Expressed in normalised time so the duration still
// comes from CSS -- `settle` is how many time constants fit in the duration,
// enough that the last sample is within a fraction of a pixel of rest.
function springEasing(dampingRatio: number, settle: number) {
  const zeta = dampingRatio
  const omega = settle / zeta

  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1

    const decay = Math.exp(-zeta * omega * x)
    if (zeta >= 1) return 1 - decay * (1 + omega * x)

    const damped = omega * Math.sqrt(1 - zeta * zeta)
    return 1 - decay * (Math.cos(damped * x) + (zeta * omega / damped) * Math.sin(damped * x))
  }
}

// Open: 0.86 damping, the bounce-free feel of a system sheet (a 0.5% overshoot
// at most, under a pixel on a phone). Close: critically damped, because a
// surface going back into its tile must not overshoot past the tile's edge.
const zoomOpen = springEasing(0.86, 6.5)
const zoomClose = springEasing(1, 8)

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

type ZoomGeometry = {
  /** The tile, relative to the viewport. */
  origin: DOMRect
  /** The tile's corner radius, so the clip starts on the tile's own outline. */
  radius: number
  /** The surface at rest. */
  target: DOMRect
  /** The part of the surface that lands on the tile, at rest: the artwork the
   *  tile is a thumbnail of, or the surface itself when there is none. */
  anchor: DOMRect
  /** The full-screen element the clip is applied to, at rest. */
  frame: DOMRect
}

// The zoom is two coordinated tracks: the surface scales so its artwork sits
// exactly on the tile, the way a Photos thumbnail becomes the photo, and grows
// from there to rest; and the full-screen frame around it
// is clipped from the tile's rounded rectangle out to the screen edges. The
// scaled surface is taller than the tile (a phone is taller than a 4:3 tile),
// so the clip is what gives the moving shape the tile's proportions.
function buildZoomKeyframes(mode: "open" | "close", geometry: ZoomGeometry) {
  const { origin, radius, target, anchor, frame } = geometry
  const ease = mode === "open" ? zoomOpen : zoomClose
  const scaleFrom = origin.width / anchor.width
  // Scaled about the surface's top-left corner, the anchor's corner lands at
  // target + (anchor - target) * scale; this translate moves it onto the tile.
  const dx = origin.left - target.left - (anchor.left - target.left) * scaleFrom
  const dy = origin.top - target.top - (anchor.top - target.top) * scaleFrom
  const clip = {
    top: origin.top - frame.top,
    right: frame.right - origin.right,
    bottom: frame.bottom - origin.bottom,
    left: origin.left - frame.left,
  }

  const surface: Keyframe[] = []
  const frameKeyframes: Keyframe[] = []

  for (let step = 0; step < originSampleCount; step += 1) {
    const time = step / (originSampleCount - 1)
    // `grown` is 0 at the tile and 1 at full screen.
    const grown = mode === "open" ? ease(time) : 1 - ease(time)
    const rest = 1 - grown
    const scale = scaleFrom + (1 - scaleFrom) * grown

    surface.push({
      offset: time,
      easing: "linear",
      transformOrigin: "0 0",
      transform: `translate3d(${(dx * rest).toFixed(2)}px, ${(dy * rest).toFixed(2)}px, 0) scale(${scale.toFixed(5)})`,
    })
    frameKeyframes.push({
      offset: time,
      easing: "linear",
      clipPath: `inset(${(clip.top * rest).toFixed(2)}px ${(clip.right * rest).toFixed(2)}px ${(clip.bottom * rest).toFixed(2)}px ${(clip.left * rest).toFixed(2)}px round ${(radius * rest).toFixed(2)}px)`,
    })
  }

  return { surface, frame: frameKeyframes }
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
  /** The element whose CSS opacity fade the open flight starts with. */
  getFadeNode?: () => Element | null
  /** The tile's corner radius in px, for the full-screen zoom's clip. */
  getOriginRadius?: () => number
  /** The element inside the surface that should land on the tile. */
  getZoomAnchor?: () => Element | null
  /** The full-screen element the zoom clips. Without one, the full-screen
   *  layout falls back to a plain lift. */
  getZoomFrame?: () => HTMLElement | null
  /** Duration properties for the full-screen zoom, read from the frame. */
  zoomOpenDurationProperty?: string
  zoomCloseDurationProperty?: string
}

// Long enough for Base UI to lift `data-starting-style` and the fade to begin
// on a 30fps frame, short enough that a surface with no fade still moves.
const fadeWaitMs = 150

/**
 * Runs the flight on demand. The caller decides when a surface opens and closes
 * — Base UI keeps the popup mounted through its exit, so the close flight is
 * started from the same place the exit transition is.
 */
export function useOriginTravel(options: OriginTravelOptions) {
  const inputs = useRef(options)
  const animations = useRef<Animation[]>([])
  const pendingStart = useRef<(() => void) | null>(null)
  const zoomFrameRef = useRef<HTMLElement | null>(null)

  // A layout effect, so a click that re-aims the flight and opens in the same
  // commit animates from the new anchor.
  useIsomorphicLayoutEffect(() => {
    inputs.current = options
  })

  const cancel = useCallback(() => {
    pendingStart.current?.()
    pendingStart.current = null
    for (const animation of animations.current) animation.cancel()
    animations.current = []
    zoomFrameRef.current?.removeAttribute("data-origin-zoom")
    zoomFrameRef.current = null
    inputs.current.onFlight?.(false)
  }, [])

  const run = useCallback((mode: "open" | "close") => {
    const {
      node, getOriginRect, enabled, onFlight, openDurationProperty, closeDurationProperty, getFadeNode,
      getOriginRadius, getZoomAnchor, getZoomFrame, zoomOpenDurationProperty, zoomCloseDurationProperty,
    } = inputs.current
    if (!node || !enabled) return
    if (typeof node.animate !== "function") return

    cancel()

    // The node sits at rest here (any in-flight animation was cancelled), so
    // this is its untransformed target geometry.
    const fullScreen = window.matchMedia(fullScreenQuery).matches
    const originRect = getOriginRect()
    const zoomFrame = fullScreen && originRect ? getZoomFrame?.() ?? null : null
    const durationOf = (element: Element, property: string) =>
      cssTimeToMilliseconds(getComputedStyle(element).getPropertyValue(property))

    let flights: Animation[]
    if (zoomFrame && originRect && zoomOpenDurationProperty && zoomCloseDurationProperty) {
      const target = node.getBoundingClientRect()
      const anchor = getZoomAnchor?.()?.getBoundingClientRect()
      const keyframes = buildZoomKeyframes(mode, {
        origin: originRect,
        radius: getOriginRadius?.() ?? 0,
        target,
        anchor: anchor && anchor.width > 0 ? anchor : target,
        frame: zoomFrame.getBoundingClientRect(),
      })
      const timing: KeyframeAnimationOptions = {
        duration: durationOf(zoomFrame, mode === "open" ? zoomOpenDurationProperty : zoomCloseDurationProperty),
        easing: "linear",
        fill: mode === "open" ? "none" : "forwards",
      }
      // Raised for the flight, so the frame's own fill and the popup's fades
      // can step aside for the clip; lowered with the flight's other flags.
      zoomFrame.setAttribute("data-origin-zoom", "true")
      zoomFrameRef.current = zoomFrame
      flights = [node.animate(keyframes.surface, timing), zoomFrame.animate(keyframes.frame, timing)]
    } else {
      const offset = fullScreen
        ? verticalOffset
        : (originRect && getOriginOffset(originRect, node.getBoundingClientRect())) ?? originFallback
      const durationProperty = mode === "open" ? openDurationProperty : closeDurationProperty

      flights = [node.animate(buildOriginKeyframes(mode, offset), {
        duration: durationOf(node, durationProperty),
        // The curve is already baked into the keyframes.
        easing: "linear",
        fill: mode === "open" ? "none" : "forwards",
      })]
    }
    const [flight] = flights
    animations.current = flights
    onFlight?.(true)

    // The open is created here, in the commit that mounts the dialog, but the
    // popup's fade only begins once Base UI lifts `data-starting-style`, a
    // frame or two later. Left to run, the flight led the fade by a frame, and
    // over the home grid that frame is 33ms (the tile videos pace the page at
    // 30fps): 19 of its 44px went by under a popup still at opacity 0, so the
    // visible motion was a fade-in with a twitch at the end. Held at its first
    // keyframe, it takes the fade's own start time instead, and the two run as
    // one. It is created now rather than then, so anything waiting on
    // `getAnimations()` still finds it.
    const fadeNode = mode === "open" ? getFadeNode?.() : null
    if (fadeNode) {
      for (const animation of flights) animation.pause()
      const start = () => {
        release()
        for (const animation of flights) if (animation.playState === "paused") animation.play()
      }
      const onFadeRun = (event: Event) => {
        if (event.target !== fadeNode || (event as TransitionEvent).propertyName !== "opacity") return
        const fade = fadeNode.getAnimations().find((animation) => (
          animation instanceof CSSTransition && animation.transitionProperty === "opacity"
        ))
        if (!fade) return start()
        release()
        // A fade cancelled before it is ready rejects this, and the fallback is
        // already released: start the flight rather than leave it paused at the
        // origin. A cancelled flight is `idle`, so the close path stays put.
        void fade.ready.then(() => {
          if (flight.playState !== "paused") return
          for (const animation of flights) {
            if (fade.startTime === null) animation.play()
            else animation.startTime = fade.startTime
          }
        }, start)
      }
      const timeout = window.setTimeout(start, fadeWaitMs)
      const release = () => {
        window.clearTimeout(timeout)
        fadeNode.removeEventListener("transitionrun", onFadeRun)
        pendingStart.current = null
      }
      fadeNode.addEventListener("transitionrun", onFadeRun)
      pendingStart.current = release
    }

    // Only the open path lowers the flag on finish. On close the transform is
    // held by `fill: forwards` until the popup unmounts, so releasing early
    // would flash the very clipping the flag exists to suppress; the next
    // `cancel` clears it instead.
    if (mode === "open") {
      flight.finished.then(() => {
        zoomFrameRef.current?.removeAttribute("data-origin-zoom")
        zoomFrameRef.current = null
        onFlight?.(false)
      }).catch(() => undefined)
    }
  }, [cancel])

  useEffect(() => () => cancel(), [cancel])

  return { run, cancel }
}
