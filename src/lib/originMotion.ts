import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

import { cssTimeToMilliseconds } from "./cssTime"

// Origin-aware open/close: the preview gallery zooms out of (and back into) the
// tile that opened it, so the tile reads as opening rather than a surface
// appearing over the page. With no tile in view it lifts in instead.
//
// Every track is a Web Animations flight sharing one timing, so the scale, the
// clip and the hand-off with the tile stay a single coordinated motion; the
// surface's own fade stays in CSS. Durations alias the shared CSS scale and are
// read from computed style, so a token change retimes the flight with the
// transitions around it.

// The open is deliberately not an expo-out. A quintic curve is 97% done in its
// first third, which for a surface growing out of a card means the growth is
// over before the eye catches it and the rest of the duration is dead air. This
// one spends its time where the size change is actually visible, then settles.
export const originOpenEasePoints = [0.32, 0.8, 0.32, 1] as const
export const originCloseEasePoints = [0.4, 0, 1, 1] as const
export const toCssEasing = (points: readonly number[]) => `cubic-bezier(${points.join(", ")})`

// Used when the anchor is off-screen (or there is none, as for a shared link):
// a plain 20px lift, no travel. The full-screen layout lifts without scaling,
// since scaling the whole viewport reads as a glitch rather than an entrance.
const originFallback = { dx: 0, dy: 20, scale: 0.96 }
const fullScreenQuery = "(max-width: 699.98px), (hover: none), (pointer: coarse)"
const verticalOffset = { dx: 0, dy: originFallback.dy, scale: 1 }

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

// An anchor scrolled out of view would send the surface flying off-screen, so
// only the ones the viewer can actually see get to aim a flight.
function visibleOriginRect(element: Element | null | undefined): DOMRect | null {
  if (!element) return null

  const rect = element.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return null

  return rect.bottom > 0 && rect.top < window.innerHeight ? rect : null
}

// The corner a tile shows, which is not always its own: several tiles round an
// inner frame that fills them. The first element filling the tile's box with a
// radius is the outline the eye reads.
function originCornerRadius(element: Element | null | undefined): number {
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
  /** The tile's outline, relative to the viewport: where the clip starts. */
  origin: DOMRect
  /** The tile's corner radius, so the clip starts on the tile's own outline. */
  radius: number
  /** The tile's painted artwork, which the surface's artwork lands on. The
   *  tile itself when it marks none. */
  artwork: DOMRect
  /** The surface at rest. */
  target: DOMRect
  /** The part of the surface that lands on the tile, at rest: the artwork the
   *  tile is a thumbnail of, or the surface itself when there is none. */
  anchor: DOMRect
  /** Artwork lands on artwork covering it, centred, the way the tile crops its
   *  own image; a surface with no artwork lands width-for-width, top-aligned,
   *  so the tile turns into the top of the page. */
  fit: "cover" | "top"
}

type Corners = [number, number, number, number]

// How far past a floating card the clip ends up, so the card's shadow (which
// reaches ~100px below it) is whole by the time the flight lets go of the clip.
const cardClipBleed = 120

const insetPath = (inset: Corners, radii: Corners) =>
  `inset(${inset.map((value) => `${value.toFixed(2)}px`).join(" ")} round ${radii.map((value) => `${Math.max(value, 0).toFixed(2)}px`).join(" ")})`

// The zoom, after iOS's App Store cards and Photos thumbnails: the tile becomes
// the surface rather than the surface arriving from the tile's direction. Two
// coordinated tracks:
//
// - The surface scales so its artwork covers the tile's artwork, and grows from
//   there to rest, pinned at its top-left corner.
// - A clip starts on the tile's rounded rectangle and opens out to the surface's
//   real outline, so the first frame shows the artwork and nothing around it:
//   no title text, no toolbar, just the image the eye was already on.
//
// Both tracks are one keyframe list on one element, the clip in the surface's
// own (pre-transform) coordinates. They used to be two -- the full-screen
// layout clipped the shell around the scaling surface -- and the browser ran
// the transform on the compositor while the clip waited for the main thread,
// which a close keeps busy (the dialog unmounting, the tile videos resuming):
// the surface outran its clip and the bottom of the card flickered out past
// it. A clip-path in the same effect keeps the transform on the main thread
// with it, so a busy frame stutters both together instead of tearing them.
//
// The clip opens to the surface's resting outline: flush and square where the
// gallery fills the screen, just past the card's rounded corners where it
// floats.
function buildZoomKeyframes(
  mode: "open" | "close",
  geometry: ZoomGeometry,
  rest: { radii: Corners; bleed: number },
) {
  const { origin, radius, artwork, target, anchor, fit } = geometry
  const ease = mode === "open" ? zoomOpen : zoomClose
  const scaleFrom = fit === "cover"
    ? Math.max(artwork.width / anchor.width, artwork.height / anchor.height)
    : artwork.width / anchor.width
  // Scaled about the surface's top-left corner, a point at `local` px into the
  // surface lands at target + translate + local * scale. These translates put
  // the anchor's centre on the tile's (cover) or its top-left corner on the
  // tile's (top).
  const dx = fit === "cover"
    ? artwork.left + artwork.width / 2 - target.left - (anchor.left - target.left + anchor.width / 2) * scaleFrom
    : artwork.left - target.left - (anchor.left - target.left) * scaleFrom
  const dy = fit === "cover"
    ? artwork.top + artwork.height / 2 - target.top - (anchor.top - target.top + anchor.height / 2) * scaleFrom
    : artwork.top - target.top - (anchor.top - target.top) * scaleFrom

  // Clip insets as [top, right, bottom, left] and radii as [tl, tr, br, bl]:
  // the tile's rectangle, mapped back through the starting pose into the
  // surface's own coordinates.
  const localX = (x: number) => (x - target.left - dx) / scaleFrom
  const localY = (y: number) => (y - target.top - dy) / scaleFrom
  const insetFrom: Corners = [
    localY(origin.top),
    target.width - localX(origin.right),
    target.height - localY(origin.bottom),
    localX(origin.left),
  ]
  const insetTo: Corners = [-rest.bleed, -rest.bleed, -rest.bleed, -rest.bleed]
  const local = radius / scaleFrom
  const radiiFrom: Corners = [local, local, local, local]
  const radiiTo = rest.radii.map((value) => value + rest.bleed) as Corners

  const keyframes: Keyframe[] = []

  for (let step = 0; step < originSampleCount; step += 1) {
    const time = step / (originSampleCount - 1)
    // `grown` is 0 at the tile and 1 at rest.
    const grown = mode === "open" ? ease(time) : 1 - ease(time)
    const rest = 1 - grown
    const scale = scaleFrom + (1 - scaleFrom) * grown
    // The clip runs ahead of the scale, on the square of the progress: closing,
    // it is down to the artwork while the surface is still shrinking, so what
    // lands is the image alone; at an even pace a band of the card's body hung
    // under the tile until the last frames and then blinked out with the
    // hand-off. Opening mirrors it: the image grows, then the card unfolds.
    const opened = grown * grown
    const mix = (from: Corners, to: Corners) => from.map((value, index) => value * (1 - opened) + to[index] * opened) as Corners
    const transform = `translate3d(${(dx * rest).toFixed(2)}px, ${(dy * rest).toFixed(2)}px, 0) scale(${scale.toFixed(5)})`
    const clipPath = insetPath(mix(insetFrom, insetTo), mix(radiiFrom, radiiTo))

    keyframes.push({ offset: time, easing: "linear", transformOrigin: "0 0", transform, clipPath })
  }

  return keyframes
}

// A surface that lands whole: its card scales down onto the tile, centred
// and contained, corners and shadow and all, with nothing clipped. For a
// tile whose artwork is itself a small page (a paper in the notes folder), a
// clip that started on the page cut the card's shadow off and left its
// bottom corners square while it grew.
function buildWholeKeyframes(mode: "open" | "close", origin: DOMRect, target: DOMRect, card: DOMRect) {
  const ease = mode === "open" ? zoomOpen : zoomClose
  const scaleFrom = Math.min(origin.width / card.width, origin.height / card.height)
  // Scaled about the surface's top-left corner: these put the card's centre
  // on the tile's.
  const dx = origin.left + origin.width / 2 - target.left - (card.left - target.left + card.width / 2) * scaleFrom
  const dy = origin.top + origin.height / 2 - target.top - (card.top - target.top + card.height / 2) * scaleFrom
  const keyframes: Keyframe[] = []
  for (let step = 0; step < originSampleCount; step += 1) {
    const time = step / (originSampleCount - 1)
    const grown = mode === "open" ? ease(time) : 1 - ease(time)
    const scale = scaleFrom + (1 - scaleFrom) * grown
    const rest = 1 - grown
    keyframes.push({
      offset: time,
      easing: "linear",
      transformOrigin: "0 0",
      transform: `translate3d(${(dx * rest).toFixed(2)}px, ${(dy * rest).toFixed(2)}px, 0) scale(${scale.toFixed(5)})`,
    })
  }
  return keyframes
}

// The tile hands off to the surface rather than staying under it: two copies of
// the same artwork, one growing out of the other, is what made the zoom read as
// a surface flying over the page instead of the tile opening. It goes as the
// surface appears, stays hidden while the surface is presented (iOS leaves the
// same gap in the grid), and comes back under the surface as it lands, before
// the surface fades off it. `handoff` is the share of the flight one fade takes.
function buildSourceKeyframes(mode: "open" | "close", handoff: number): Keyframe[] {
  return mode === "open"
    ? [{ opacity: 1, offset: 0 }, { opacity: 0, offset: handoff }, { opacity: 0, offset: 1 }]
    // Back in full before the surface on top of it starts to fade: crossing
    // the two at once let the page show through both at the midpoint, a dip
    // in the artwork right as it landed.
    : [
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: Math.max(1 - 2 * handoff, 0) },
      { opacity: 1, offset: Math.max(1 - handoff, 0) },
      { opacity: 1, offset: 1 },
    ]
}

const transparent = (color: string) => color === "transparent" || /rgba\(.*,\s*0\)$/.test(color)

// Everything on the surface that is not the artwork, and every fill between
// the artwork and the surface's edge. Matching the tile means the surface
// lands as the tile does: the artwork on the tile's own fill, inside its
// outline, with no card body, title, or controls around it.
function surroundings(root: Element, keep: Element) {
  const chrome: Element[] = []
  const fills: { element: Element; color: string }[] = []
  const fill = (candidate: Element) => {
    const color = getComputedStyle(candidate).backgroundColor
    if (!transparent(color)) fills.push({ element: candidate, color })
  }
  fill(keep)
  let element: Element = keep
  while (element !== root && element.parentElement) {
    const parent: Element = element.parentElement
    for (const sibling of Array.from(parent.children)) if (sibling !== element) chrome.push(sibling)
    if (parent !== root) fill(parent)
    element = parent
  }
  return { chrome, fills }
}

// Closing, the card's body and controls are gone and its fills are the tile's
// a third of the way down, so what lands is the tile. Opening holds the
// tile's look while the image grows, then unfolds the card around it.
function buildMatchKeyframes(mode: "open" | "close", tile: string, rest: string, property: "opacity" | "backgroundColor"): Keyframe[] {
  return mode === "open"
    ? [{ [property]: tile, offset: 0 }, { [property]: tile, offset: 0.25 }, { [property]: rest, offset: 0.7 }, { [property]: rest, offset: 1 }]
    : [{ [property]: rest, offset: 0 }, { [property]: tile, offset: 0.35 }, { [property]: tile, offset: 1 }]
}

// Marks the part of a tile its artwork occupies, so the surface's artwork can
// land on it. A tile without one is the anchor itself.
export const originArtworkAttribute = "data-origin-artwork"

// The box an image or video actually paints, which under `object-fit: contain`
// is not its element's: the work tiles letterbox 4:3 artwork inside a taller
// frame, and landing the surface on the frame drew its artwork at twice the
// tile's size on the frame it took over.
export function paintedRect(element: Element): DOMRect {
  const box = element.getBoundingClientRect()
  // Before its metadata arrives a video (or a lazy image) reports 0x0; the
  // width and height attributes every artwork carries give the same ratio.
  const attribute = (name: string) => Number(element.getAttribute(name)) || 0
  const [width, height] = element instanceof HTMLVideoElement
    ? [element.videoWidth || attribute("width"), element.videoHeight || attribute("height")]
    : element instanceof HTMLImageElement
      ? [element.naturalWidth || attribute("width"), element.naturalHeight || attribute("height")]
      : [0, 0]
  const style = getComputedStyle(element)
  if (!width || !height || (style.objectFit !== "contain" && style.objectFit !== "cover")) return box

  // A covering image paints past its box: the whole picture, of which the box
  // shows a window. Matching those whole pictures is what lands a cropped
  // tile on a differently cropped gallery frame without zooming into it --
  // Protector's portrait tile, matched box-to-box on the gallery's landscape
  // frame, came out of a 1.3x zoom on one phone. The box is already the
  // transformed one, and a uniform scale leaves object-position's percentages
  // where they were.
  const scale = style.objectFit === "cover"
    ? Math.max(box.width / width, box.height / height)
    : Math.min(box.width / width, box.height / height)
  const [x = "50%", y = "50%"] = style.objectPosition.split(" ")
  const fraction = (value: string) => value.endsWith("%") ? parseFloat(value) / 100 : 0.5
  return new DOMRect(
    box.left + (box.width - width * scale) * fraction(x),
    box.top + (box.height - height * scale) * fraction(y),
    width * scale,
    height * scale,
  )
}

function syncPlayback(from: Element | null | undefined, to: Element | null | undefined) {
  if (!(from instanceof HTMLVideoElement) || !(to instanceof HTMLVideoElement)) return
  // The tile and the gallery load different renditions of the same clip (the
  // gallery's is larger), so the file names differ; the same length is the
  // same clip.
  if (!Number.isFinite(from.duration) || Math.abs(from.duration - to.duration) > 0.1) return
  try {
    to.currentTime = from.currentTime
  } catch {
    // Not seekable yet; it starts from its own beginning, as before.
  }
}

// The gallery mounts its own <video>, which has no frame decoded when the open
// starts: it showed its poster -- an earlier moment of the clip, the wallet
// list still in skeletons where the tile had its balances and network menu
// open -- and then jumped to the synced moment once it caught up. The tile's
// current frame, painted over it, holds that moment until the gallery's video
// can show it itself.
function holdFrame(from: Element | null | undefined, to: Element | null | undefined) {
  if (!(from instanceof HTMLVideoElement) || !(to instanceof HTMLVideoElement)) return
  if (to.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !to.seeking) return
  if (from.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !from.videoWidth) return
  const canvas = document.createElement("canvas")
  canvas.width = from.videoWidth
  canvas.height = from.videoHeight
  try {
    canvas.getContext("2d")?.drawImage(from, 0, 0)
  } catch {
    return
  }
  canvas.className = "preview-gallery-media-hold"
  canvas.setAttribute("aria-hidden", "true")
  to.after(canvas)
  const release = () => {
    if (to.seeking || to.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return
    to.removeEventListener("seeked", release)
    to.removeEventListener("loadeddata", release)
    to.removeEventListener("error", drop)
    window.clearTimeout(timeout)
    // One more frame, so the video has painted what it decoded before the
    // stand-in leaves.
    requestAnimationFrame(() => canvas.remove())
  }
  const drop = () => {
    to.removeEventListener("seeked", release)
    to.removeEventListener("loadeddata", release)
    canvas.remove()
  }
  // A video that never catches up falls back to its poster, as before.
  const timeout = window.setTimeout(drop, 4000)
  to.addEventListener("seeked", release)
  to.addEventListener("loadeddata", release)
  to.addEventListener("error", drop, { once: true })
}

// The tile's artwork: its one image or video when it has exactly one, else the
// marked frame (a paired banner lands as a whole).
function originArtwork(origin: Element | null) {
  const frame = origin?.querySelector(`[${originArtworkAttribute}]`)
  if (!frame) return null
  const media = frame.querySelectorAll("img, video")
  return media.length === 1 ? { element: media[0], frame } : { element: frame, frame }
}

export type OriginTravelOptions = {
  /** The surface that flies. Null while the dialog's portal is unmounted. */
  node: HTMLElement | null
  /** The tile the surface comes out of, re-read per flight. Only a tile the
   *  viewer can see aims a flight. */
  getOrigin: (mode: "open" | "close") => Element | null
  /** False leaves the surface's CSS pose in charge: reduced motion, or no anchor to aim at. */
  enabled: boolean
  /** Custom properties the two durations are read from, on the flying node. */
  openDurationProperty: string
  closeDurationProperty: string
  /** Raised for the length of a flight, for clipping and compositing hints. */
  onFlight?: (flying: boolean) => void
  /** The element whose CSS opacity fade the open flight starts with. */
  getFadeNode?: () => Element | null
  /** The element inside the surface that should land on the tile. */
  getZoomAnchor?: () => Element | null
  /** The part of the surface that stays while it stands in for the tile:
   *  the artwork's frame. Everything around it fades, and the fills between
   *  it and the surface's edge take the tile's colour. */
  getZoomKeep?: () => Element | null
  /** The frame around the surface: where `data-origin-zoom` is raised for the
   *  length of a zoom, whose scroll is held still while it flies, and where
   *  the durations are read. Without one, the surface falls back to a lift. */
  getZoomFrame?: () => HTMLElement | null
  /** The element whose border radii are the surface's resting outline. */
  getZoomOutline?: () => Element | null
  /** A card to land whole on the tile instead of clipping the surface down
   *  to it; everything around the card fades. */
  getZoomWhole?: () => Element | null
  /** Duration of the crossfade between the tile and the surface. */
  handoffDurationProperty?: string
  /** Duration properties for the zoom, read from the frame. */
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
  const releaseScrollRef = useRef<(() => void) | null>(null)

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
    releaseScrollRef.current?.()
    zoomFrameRef.current?.removeAttribute("data-origin-zoom")
    zoomFrameRef.current = null
    inputs.current.onFlight?.(false)
  }, [])

  const run = useCallback((mode: "open" | "close") => {
    const {
      node, getOrigin, enabled, onFlight, openDurationProperty, closeDurationProperty, getFadeNode,
      getZoomAnchor, getZoomKeep, getZoomFrame, getZoomOutline, getZoomWhole, handoffDurationProperty, zoomOpenDurationProperty, zoomCloseDurationProperty,
    } = inputs.current
    if (!node || !enabled) return
    if (typeof node.animate !== "function") return

    cancel()

    // The node sits at rest here (any in-flight animation was cancelled), so
    // this is its untransformed target geometry.
    const fullScreen = window.matchMedia(fullScreenQuery).matches
    const origin = getOrigin(mode)
    const artwork = originArtwork(origin)
    // Only a tile in view aims a flight.
    const originRect = visibleOriginRect(origin)
    const zoomFrame = originRect ? getZoomFrame?.() ?? null : null
    const durationOf = (element: Element, property: string) =>
      cssTimeToMilliseconds(getComputedStyle(element).getPropertyValue(property))

    let flights: Animation[]
    if (zoomFrame && originRect && zoomOpenDurationProperty && zoomCloseDurationProperty) {
      const target = node.getBoundingClientRect()
      const anchorElement = getZoomAnchor?.()
      const anchorRect = anchorElement ? paintedRect(anchorElement) : null
      const anchor = anchorRect && anchorRect.width > 0 && anchorRect.height > 0 ? anchorRect : null
      // The clip starts and ends on the tile's whole outline, and the
      // surface's artwork lands on the tile's painted artwork. A tile and a
      // surface that both have artwork match the rest too (below); without,
      // the surface lands as a whole.
      const matched = Boolean(artwork && anchor)
      const geometry: ZoomGeometry = {
        origin: originRect,
        radius: originCornerRadius(origin),
        artwork: matched ? paintedRect(artwork!.element) : originRect,
        target,
        anchor: anchor ?? target,
        fit: anchor ? "cover" : "top",
      }
      const duration = durationOf(zoomFrame, mode === "open" ? zoomOpenDurationProperty : zoomCloseDurationProperty)
      const timing: KeyframeAnimationOptions = {
        duration,
        easing: "linear",
        fill: mode === "open" ? "none" : "forwards",
      }
      // Raised for the flight, so the frame's own fill and the popup's fades
      // can step aside for the clip; lowered with the flight's other flags.
      zoomFrame.setAttribute("data-origin-zoom", "true")
      zoomFrameRef.current = zoomFrame

      // The dialog focuses the card as it opens, and the browser scrolls the
      // frame to bring that card into view -- but mid-flight the card is
      // drawn over the tile, so the frame scrolled towards the tile and the
      // card came to rest 41px above its place. Hold the frame where the
      // flight measured it until the flight lets go.
      const scrollTop = zoomFrame.scrollTop
      const holdScroll = () => { zoomFrame.scrollTop = scrollTop }
      zoomFrame.addEventListener("scroll", holdScroll)
      releaseScrollRef.current = () => {
        zoomFrame.removeEventListener("scroll", holdScroll)
        releaseScrollRef.current = null
      }

      const outline = fullScreen ? null : getZoomOutline?.()
      const style = outline ? getComputedStyle(outline) : null
      const radii = (style
        ? [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius].map((value) => parseFloat(value) || 0)
        : [0, 0, 0, 0]) as Corners
      const whole = getZoomWhole?.()
      const wholeRect = whole?.getBoundingClientRect()
      if (whole && wholeRect && wholeRect.width > 0 && wholeRect.height > 0) {
        flights = [node.animate(buildWholeKeyframes(mode, originRect, target, wholeRect), timing)]
        const { chrome, fills } = surroundings(node, whole)
        for (const element of chrome) {
          flights.push(element.animate(buildMatchKeyframes(mode, "0", "1", "opacity"), timing))
        }
        // The card keeps its own fill: it is the page that lands.
        for (const { element, color } of fills) {
          if (element === whole) continue
          flights.push(element.animate(buildMatchKeyframes(mode, "rgba(0, 0, 0, 0)", color, "backgroundColor"), timing))
        }
      } else {
        flights = [node.animate(buildZoomKeyframes(mode, geometry, { radii, bleed: fullScreen ? 0 : cardClipBleed }), timing)]
      }

      const keep = matched && !whole ? getZoomKeep?.() : null
      const tileFill = origin ? getComputedStyle(origin).backgroundColor : "transparent"
      if (keep && !transparent(tileFill)) {
        const { chrome, fills } = surroundings(node, keep)
        for (const element of chrome) {
          flights.push(element.animate(buildMatchKeyframes(mode, "0", "1", "opacity"), timing))
        }
        for (const { element, color } of fills) {
          flights.push(element.animate(buildMatchKeyframes(mode, tileFill, color, "backgroundColor"), timing))
        }
      }

      // The two videos loop on their own clocks, so the one taking over shows
      // a different moment of the same loop and the hand-off jumped. The one
      // arriving starts where the one leaving is.
      syncPlayback(mode === "open" ? artwork?.element : anchorElement, mode === "open" ? anchorElement : artwork?.element)
      if (mode === "open") holdFrame(artwork?.element, anchorElement)

      // Held hidden after the open (until the close's `cancel` lets go of it);
      // back to its own CSS after the close, whose last frame is fully shown.
      const handoff = handoffDurationProperty ? durationOf(zoomFrame, handoffDurationProperty) : 0
      if (origin && duration > 0) {
        flights.push(origin.animate(buildSourceKeyframes(mode, Math.min(handoff / duration, 1)), {
          duration,
          easing: "linear",
          fill: mode === "open" ? "forwards" : "none",
        }))
      }
    } else {
      const offset = fullScreen ? verticalOffset : originFallback
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
    // A zoom has no fade to wait for: the surface is solid from its first
    // frame, standing in for the tile it covers.
    const fadeNode = mode === "open" && !zoomFrameRef.current ? getFadeNode?.() : null
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
        releaseScrollRef.current?.()
        zoomFrameRef.current?.removeAttribute("data-origin-zoom")
        zoomFrameRef.current = null
        onFlight?.(false)
      }).catch(() => undefined)
    }
  }, [cancel])

  // The gallery component survives popup removal. Release effects on the
  // source tile when the travelling node detaches, including controlled
  // closes from browser history that never run the close animation.
  useIsomorphicLayoutEffect(() => () => cancel(), [options.node, cancel])

  return { run, cancel }
}
