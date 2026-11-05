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

// The tile inside its hairline border, the rounded box the surface stands in
// for. The border stays the tile's: clipped to the outer edge, the surface
// painted its own light fill in that 1px band, which over a full-bleed tile
// (Turtle's purple) read as a white rim drawn over the tile as it came back.
function insideBorder(element: Element, rect: DOMRect, radius: number) {
  const style = getComputedStyle(element)
  const [top, right, bottom, left] = [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth]
    .map((value) => parseFloat(value) || 0)
  return {
    rect: new DOMRect(rect.left + left, rect.top + top, Math.max(rect.width - left - right, 0), Math.max(rect.height - top - bottom, 0)),
    radius: Math.max(radius - Math.max(top, right, bottom, left), 0),
  }
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

// The zoom's curve. It used to run on a spring, as UIKit's does, which was
// 48% grown at a fifth of its time and 95% at half: the card reached its size
// in the first six or seven frames of a 60Hz display and then crept over the
// last pixels for another 180ms. One dropped frame in that burst, which the
// mount of a wide card costs, and the open read as the card popping in and
// settling rather than growing. This curve starts gently -- the tile is
// seen to lift before it travels -- spends the middle half of its time on the
// visible growth (27% at a fifth, 82% at half, 96% at three quarters), and
// settles without overshoot. The close plays the same curve, so a close that
// interrupts an open retraces it.
export const zoomEasePoints = [0.3, 0.1, 0.2, 1] as const
const zoomEase = cubicBezierEasing(zoomEasePoints)
// The card's body unfolds under the artwork, and folds back ahead of the
// shrink, on the house state-change curve. The fold tried the exit curve
// first, and its slow start left the body hanging under the picture for the
// close's first third, a white tail on the shrinking card.
const unfoldEase = cubicBezierEasing([0.2, 0, 0, 1])
const foldEase = unfoldEase
// The body begins to unfold once the artwork is this far grown: late enough
// that the picture reads as landing first, early enough that the two phases
// are one motion rather than a pause and a second animation.
const unfoldFrom = 0.9

// Enough samples that the linear interpolation between them is invisible at
// 120Hz over the longest of these animations.
const originSampleCount = 64

// Where the surface is, in two numbers: how far the artwork has grown out of
// the tile (0 on the tile, 1 in its resting frame) and how far the card's
// body has unfolded under it (0 clipped to the artwork, 1 the whole card).
// A flight is a path through this space, and a flight that interrupts
// another starts from wherever that one was, so a close pressed mid-open
// shrinks the card from the size it had reached instead of snapping it to
// rest first.
export type ZoomPose = { grown: number; unfolded: number }

type ZoomTimeline = {
  /** Total length, in ms. */
  duration: number
  /** The pose `ms` into the flight. */
  at: (ms: number) => ZoomPose
}

type ZoomDurations = { zoom: number; unfold: number; fold: number }

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
const progress = (ms: number, duration: number) => clamp01(duration > 0 ? ms / duration : 1)

// Open: the artwork grows, and once it is nearly there the body unfolds,
// so the unfold's start is wherever the zoom crosses `unfoldFrom`. A card
// with nothing to unfold (a note, the résumé) brings its chrome in over the
// zoom's last stretch instead, as before. Close: the body folds while the
// artwork shrinks, both from the start, so the card is back to its picture
// by the time it has travelled half way.
function buildTimeline(mode: "open" | "close", from: ZoomPose, durations: ZoomDurations, unfolds: boolean): ZoomTimeline {
  const { zoom, unfold, fold } = durations
  if (mode === "close") {
    const grown = (ms: number) => from.grown * (1 - zoomEase(progress(ms, zoom)))
    const unfolded = (ms: number) => from.unfolded * (1 - foldEase(progress(ms, fold)))
    return { duration: zoom, at: (ms) => ({ grown: grown(ms), unfolded: unfolded(ms) }) }
  }

  const grown = (ms: number) => from.grown + (1 - from.grown) * zoomEase(progress(ms, zoom))
  if (!unfolds) {
    return {
      duration: zoom,
      at: (ms) => {
        const g = grown(ms)
        return { grown: g, unfolded: Math.max(from.unfolded, clamp01((g - 0.6) / 0.4)) }
      },
    }
  }
  let start = 0
  if (from.grown < unfoldFrom) {
    let low = 0
    let high = zoom
    for (let round = 0; round < 24; round += 1) {
      const mid = (low + high) / 2
      if (grown(mid) < unfoldFrom) low = mid
      else high = mid
    }
    start = high
  }
  return {
    duration: Math.max(zoom, start + unfold),
    at: (ms) => ({
      grown: grown(ms),
      unfolded: from.unfolded + (1 - from.unfolded) * unfoldEase(progress(ms - start, unfold)),
    }),
  }
}

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
   *  so the tile turns into the top of the page; a card that lands whole (a
   *  note, the résumé) sits inside the tile, centred, as a page on it. */
  fit: "cover" | "top" | "contain"
  /** The line under the artwork where the card's body begins, in the
   *  surface's own pixels from its top: where the clip lands before the body
   *  unfolds. Null for a surface that lands whole, or whose artwork has
   *  scrolled away. */
  frameBottom: number | null
}

type Corners = [number, number, number, number]

// How far along a corner's tangent its cubic's control points sit, as a share
// of the radius, for a `corner-shape: superellipse(K)` corner: the one cubic
// that passes through the superellipse's own midpoint. 0.5523 is the circle
// (`round`, K = 1); the site's `squircle` (K = 2) is 0.909, much squarer.
export function cornerControl(shape: string) {
  const keyword: Record<string, number> = { round: 1, squircle: 2, square: Infinity }
  const parsed = /superellipse\(\s*(-?[\d.]+|infinity)\s*\)/i.exec(shape)
  const k = parsed
    ? (parsed[1].toLowerCase() === "infinity" ? Infinity : parseFloat(parsed[1]))
    : keyword[shape.trim()] ?? 1
  // Concave shapes (bevel, scoop, notch) have no convex cubic; keep a circle.
  if (!(k >= 1)) return 0.5523
  if (k === Infinity) return 1
  const midpoint = Math.pow(2, -1 / Math.pow(2, k))
  return (8 * midpoint - 4) / 3
}

// The clip, as the rounded rectangle the browser draws for the same box and
// radii. `inset(... round ...)` only draws circular corners, while every
// corner on the site is a squircle: in flight the corners were visibly rounder
// than the tile's and the card's, and swapped to the tighter squircle the
// moment the clip let go. Same commands in every keyframe, so it interpolates.
function roundedClip(inset: Corners, radii: Corners, size: { width: number; height: number }, control: number) {
  const [top, right, bottom, left] = [inset[0], size.width - inset[1], size.height - inset[2], inset[3]]
  const half = Math.max(Math.min(right - left, bottom - top) / 2, 0)
  const [tl, tr, br, bl] = radii.map((value) => Math.min(Math.max(value, 0), half))
  const n = (value: number) => +value.toFixed(2)
  const pull = (radius: number) => radius * (1 - control)
  return `path("${[
    `M ${n(left + tl)} ${n(top)}`,
    `L ${n(right - tr)} ${n(top)}`,
    `C ${n(right - pull(tr))} ${n(top)} ${n(right)} ${n(top + pull(tr))} ${n(right)} ${n(top + tr)}`,
    `L ${n(right)} ${n(bottom - br)}`,
    `C ${n(right)} ${n(bottom - pull(br))} ${n(right - pull(br))} ${n(bottom)} ${n(right - br)} ${n(bottom)}`,
    `L ${n(left + bl)} ${n(bottom)}`,
    `C ${n(left + pull(bl))} ${n(bottom)} ${n(left)} ${n(bottom - pull(bl))} ${n(left)} ${n(bottom - bl)}`,
    `L ${n(left)} ${n(top + tl)}`,
    `C ${n(left)} ${n(top + pull(tl))} ${n(left + pull(tl))} ${n(top)} ${n(left + tl)} ${n(top)}`,
    "Z",
  ].join(" ")}")`
}

// The zoom, after iOS's App Store cards and Photos thumbnails: the tile becomes
// the surface rather than the surface arriving from the tile's direction. Two
// coordinated tracks:
//
// - The surface scales so its artwork covers the tile's artwork, and grows from
//   there to rest, pinned at its top-left corner.
// - A clip starts on the tile's whole rounded rectangle and opens out to the
//   surface's real outline, so the first frame is the tile: its shape, its
//   fill, and the artwork the eye was already on. Where the tile reaches past
//   the scaled card, the card's fill is carried out to the clip (see
//   `buildReachKeyframes`), so the whole tile is covered from the first frame
//   and none of it shows through as a second, ghosted copy.
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
// gallery fills the screen, on the card's rounded corners where it floats. It
// used to end 120px past a floating card so its shadow was whole as the clip
// let go; the shadow now waits for the flight to end (preview-gallery.css),
// and a clip out there showed the fill carried past the card as a halo.

// The zoom, after iOS's App Store cards and Photos thumbnails: the tile becomes
// the surface rather than the surface arriving from the tile's direction. Two
// coordinated tracks:
//
// - The surface scales so its artwork covers the tile's artwork, and grows from
//   there to its resting size, pinned at its top-left corner.
// - A clip starts on the tile's whole rounded rectangle and opens out with the
//   artwork to the artwork's own frame -- the card's top, down to the line
//   where its body begins -- so the first frame is the tile: its shape, its
//   fill, and the artwork the eye was already on, and what grows out of it
//   is that picture alone. Once the picture has landed the clip's bottom edge
//   runs on down to the card's, unfolding the body under it. Where the tile
//   reaches past the scaled card, the card's fill is carried out to the clip
//   (see `buildReachKeyframes`), so the whole tile is covered from the first
//   frame and none of it shows through as a second, ghosted copy.
//
// The body used to grow with the picture, as a blank tile-coloured sheet
// under it that turned white and filled with text once the card was most of
// the way there: on a wide card that sheet was most of the screen, and the
// open read as a grey box appearing and loading rather than the picture
// opening. It is clipped away until the picture has landed.
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
// gallery fills the screen, on the card's rounded corners where it floats. It
// used to end 120px past a floating card so its shadow was whole as the clip
// let go; the shadow now waits for the flight to end (preview-gallery.css),
// and a clip out there showed the fill carried past the card as a halo.
function buildZoomKeyframes(
  timeline: ZoomTimeline,
  geometry: ZoomGeometry,
  radiiTo: Corners,
  control = cornerControl("round"),
) {
  const { origin, radius, artwork, target, anchor, fit, frameBottom } = geometry
  const scaleFrom = fit === "cover"
    ? Math.max(artwork.width / anchor.width, artwork.height / anchor.height)
    : fit === "contain"
      ? Math.min(artwork.width / anchor.width, artwork.height / anchor.height)
      : artwork.width / anchor.width
  // Scaled about the surface's top-left corner, a point at `local` px into the
  // surface lands at target + translate + local * scale. These translates put
  // the anchor's centre on the tile's (cover) or its top-left corner on the
  // tile's (top).
  const centred = fit !== "top"
  const dx = centred
    ? artwork.left + artwork.width / 2 - target.left - (anchor.left - target.left + anchor.width / 2) * scaleFrom
    : artwork.left - target.left - (anchor.left - target.left) * scaleFrom
  const dy = centred
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
  // Where the clip stands once the picture has landed: on the artwork's frame
  // when there is a body to unfold under it, else on the card's outline.
  const unfolds = frameBottom !== null
  const insetGrown: Corners = [0, 0, unfolds ? target.height - frameBottom : 0, 0]
  const radiiScreenFrom: Corners = [radius, radius, radius, radius]

  const keyframes: Keyframe[] = []
  const reach: ReachSample[] = []

  for (let step = 0; step < originSampleCount; step += 1) {
    const time = step / (originSampleCount - 1)
    const { grown, unfolded } = timeline.at(time * timeline.duration)
    const rest = 1 - grown
    const scale = scaleFrom + (1 - scaleFrom) * grown
    // A card that lands whole, or one whose artwork has scrolled away, has
    // its body in the clip throughout. There the clip runs ahead of the
    // scale, on the square of the progress: closing, it is down to the
    // artwork while the surface is still shrinking, so what lands is the
    // image alone; at an even pace a band of the card's body hung under the
    // tile until the last frames and then blinked out with the hand-off.
    const opened = unfolds ? grown : grown * grown
    const inset = insetFrom.map((value, index) => value * (1 - opened) + insetGrown[index] * opened) as Corners
    // The body: the bottom edge runs from the frame's line down to the card's
    // as it unfolds, and back up as it folds.
    inset[2] *= 1 - unfolded
    // The corners are mixed as they are seen, then carried into the surface's
    // own pixels. Mixed in those pixels, where the tile's corner starts out
    // divided by the small starting scale, they ballooned mid-flight -- twice
    // the tile's curve and well past the card's -- and then tightened as the
    // card landed.
    const radii = radiiScreenFrom.map((value, index) => (value * (1 - opened) + radiiTo[index] * opened) / scale) as Corners
    const transform = `translate3d(${(dx * rest).toFixed(2)}px, ${(dy * rest).toFixed(2)}px, 0) scale(${scale.toFixed(5)})`
    const clipPath = roundedClip(inset, radii, target, control)

    keyframes.push({ offset: time, easing: "linear", transformOrigin: "0 0", transform, clipPath })
    // How far this frame's clip reaches past the card, in the card's own
    // pixels: what the fill has to cover now, not at the flight's widest.
    reach.push({ offset: time, spread: Math.max(0, ...inset.map((value) => -value)) })
  }

  return { keyframes, reach }
}

// The tile is often a different shape from the card at the scale the artwork
// lands at -- wider, or taller below the artwork -- and the clip on the
// tile's outline then reaches past the card's box, where nothing paints. The
// tile showed through there: its own copy of the artwork under the card's, a
// ghost, and the clip's rounded corners rounding empty space so the card's
// own sides met its bottom edge square. A spread shadow carries the card's
// fill out to the clip, so the tile's whole shape is the surface. It is the
// tile's colour while the card stands in for the tile, and the card's by the
// time the clip has closed onto the card's outline and hides it.
//
// The same fill goes behind the card as well, inside the surface's own box:
// the card's rounded corners otherwise left notches between it and the
// spread, which only ever runs square around that box.
//
// It is painted by the flying wrapper, outside the popup whose opacity the
// close fades off the tile (preview-gallery.css), so closing it fades itself
// on that same clock, from `fadeFrom` to the end. Held opaque, it stayed as a
// blank tile-coloured shape over the tile while everything in it faded, and
// the tile reappeared only when the dialog unmounted: a flash at the landing.
//
// It stays the tile's colour throughout: by the time the card has turned to
// its own colours the clip has closed onto the card's outline and hides it.
// Turning it the card's white with the card left a white rim round the
// card's grey artwork frame while it was still growing.
//
// The part behind the card is gone before the popup starts to fade, though.
// Under the fading artwork it showed through as a grey veil laid over the
// tile's own artwork: a washed-out, flashing copy of it for the last frames.
// It is only there for the card's corners mid-flight, and by now the clip has
// closed inside them, so clearing it under a still-solid popup shows nothing.
//
// The spread follows the clip frame by frame, to just as far as the clip
// reaches past the card, and is gone where the clip lies on the card's own
// outline: the open's landing and the close's first frame. It used to stand
// at the flight's widest the whole way and leave the clip to hide it, but
// Chrome runs the clip on the compositor and can apply it a frame late, while
// the spread paints at once: the first frame of a close showed the card at
// rest in a tile-coloured box ~170px wider on each side, square-cornered, the
// "wide version" of the card flashing on a quick open and close.
type ReachSample = { offset: number; spread: number }

function buildReachKeyframes(mode: "open" | "close", reach: readonly ReachSample[], tile: string, fadeFrom: number) {
  const hold = mode === "open" ? 1 : Math.min(Math.max(fadeFrom, 0), 1)
  const behindGone = Math.max(hold - 0.1, 0)
  // 1 until `from`, 0 by `to`, linear between.
  const fade = (offset: number, from: number, to: number) =>
    offset <= from ? 1 : offset >= to ? 0 : 1 - (offset - from) / (to - from)
  return reach.map(({ offset, spread }): Keyframe => {
    const outer = mode === "open" ? 1 : fade(offset, hold, 1)
    // Behind the card it only fills the notches its rounded corners leave
    // under a clip that runs past them, so it goes with the spread too.
    const behind = (mode === "open" ? 1 : fade(offset, behindGone, hold)) * Math.min(spread / 4, 1)
    return {
      offset,
      boxShadow: `0 0 0 ${Math.ceil(spread)}px ${withAlpha(tile, outer)}`,
      backgroundColor: withAlpha(tile, behind),
    }
  })
}

// The same colour at a share of its alpha, so a fade does not pass through grey.
function withAlpha(color: string, alpha: number) {
  const channels = color.match(/[\d.]+/g)
  if (!channels || channels.length < 3) return alpha >= 1 ? color : "transparent"
  const own = channels.length >= 4 ? parseFloat(channels[3]) : 1
  return `rgba(${channels.slice(0, 3).join(", ")}, ${+(own * alpha).toFixed(3)})`
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
    for (const sibling of Array.from(parent.children)) {
      // The paging arrows have their own entrance (preview-gallery.css): they
      // wait out the whole flight rather than fading in inside it.
      if (sibling !== element && !sibling.matches(".preview-gallery-rail")) chrome.push(sibling)
    }
    if (parent !== root) fill(parent)
    element = parent
  }
  return { chrome, fills }
}

// The card's chrome -- its body, its controls, everything that is not the
// artwork -- is there as far as the body has unfolded, and gone as it folds:
// it arrives under the clip that reveals it and leaves ahead of the shrink.
function buildChromeKeyframes(timeline: ZoomTimeline): Keyframe[] {
  return sampleKeyframes(timeline, ({ unfolded }) => ({ opacity: unfolded.toFixed(3) }))
}

// The fills between the artwork and the surface's edge are the tile's colour
// while the card stands in for the tile -- the picture has covered nearly all
// of its distance by 60% -- and settle into their own over the zoom's last
// stretch. Turning white while the card was still growing showed a white band
// over the tile's grey, a second card lifted over the tile rather than the
// tile itself; closing, they are the tile's again a third of the way down.
function buildFillKeyframes(timeline: ZoomTimeline, tile: string, rest: string): Keyframe[] {
  return sampleKeyframes(timeline, ({ grown }) => ({ backgroundColor: mixColor(tile, rest, clamp01((grown - 0.6) / 0.4)) }))
}

// The tile's frame drawn over the gallery's video on the way back
// (`handOverFrame`): in by a third of the way down, with the card's body.
const handOverKeyframes: Keyframe[] = [{ opacity: "1", offset: 0 }, { opacity: "0", offset: 0.35 }, { opacity: "0", offset: 1 }]

function sampleKeyframes(timeline: ZoomTimeline, value: (pose: ZoomPose) => Keyframe): Keyframe[] {
  const keyframes: Keyframe[] = []
  for (let step = 0; step < originSampleCount; step += 1) {
    const time = step / (originSampleCount - 1)
    keyframes.push({ ...value(timeline.at(time * timeline.duration)), offset: time, easing: "linear" })
  }
  return keyframes
}

function parseColor(color: string): [number, number, number, number] | null {
  if (color === "transparent") return [0, 0, 0, 0]
  const channels = color.match(/[\d.]+/g)
  if (!channels || channels.length < 3) return null
  return [Number(channels[0]), Number(channels[1]), Number(channels[2]), channels.length >= 4 ? parseFloat(channels[3]) : 1]
}

// `from` at 0, `to` at 1, premultiplied so a fade from transparent does not
// pass through black.
function mixColor(from: string, to: string, share: number) {
  if (share <= 0) return from
  if (share >= 1) return to
  const a = parseColor(from)
  const b = parseColor(to)
  if (!a || !b) return share < 0.5 ? from : to
  const alpha = a[3] * (1 - share) + b[3] * share
  const channel = (index: number) => alpha > 0 ? Math.round((a[index] * a[3] * (1 - share) + b[index] * b[3] * share) / alpha) : 0
  return `rgba(${channel(0)}, ${channel(1)}, ${channel(2)}, ${+alpha.toFixed(3)})`
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

// Closing, the other way round, for clips `syncPlayback` cannot line up: the
// tile and the gallery cut the Matcha homepage clip at different lengths (8s
// and 10s), so they never show the same moment. The tile sits paused on the
// frame it had when the gallery opened while the gallery's plays on, and the
// hand-off faded one moment into the other over the tile -- a loaded table
// through a half-loaded one, a flash of two pages at once. The tile's frame
// fades in over the gallery's video while the card shrinks, on the same beat
// as the card's body leaves, so what lands is what the tile shows.
function handOverFrame(tile: Element | null | undefined, gallery: Element | null | undefined, timing: KeyframeAnimationOptions) {
  if (!(tile instanceof HTMLVideoElement) || !(gallery instanceof HTMLVideoElement)) return null
  if (Number.isFinite(tile.duration) && Math.abs(tile.duration - gallery.duration) <= 0.1) return null
  if (tile.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !tile.videoWidth) return null
  const canvas = document.createElement("canvas")
  canvas.width = tile.videoWidth
  canvas.height = tile.videoHeight
  try {
    canvas.getContext("2d")?.drawImage(tile, 0, 0)
  } catch {
    return null
  }
  canvas.className = "preview-gallery-media-hold"
  canvas.setAttribute("aria-hidden", "true")
  gallery.after(canvas)
  const fade = canvas.animate(handOverKeyframes, timing)
  // A reopen cancels the close; the gallery's own video is the picture again.
  fade.addEventListener("cancel", () => canvas.remove())
  return fade
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
  /** Duration of the surface's fade off the tile at the end of a close,
   *  read from the frame. The fill around the card fades with it. */
  handoffDurationProperty?: string
  /** Duration properties for the zoom, read from the frame. */
  zoomOpenDurationProperty?: string
  zoomCloseDurationProperty?: string
  /** How long the card's body takes to unfold under the landed artwork, and
   *  to fold back ahead of the close. Without them the body shows throughout. */
  zoomUnfoldDurationProperty?: string
  foldDurationProperty?: string
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
  // The last zoom's path, so a flight that interrupts it can start where it
  // had got to.
  const flightRef = useRef<{ mode: "open" | "close"; timeline: ZoomTimeline } | null>(null)

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
      getZoomAnchor, getZoomKeep, getZoomFrame, getZoomOutline, getZoomWhole, handoffDurationProperty,
      zoomOpenDurationProperty, zoomCloseDurationProperty, zoomUnfoldDurationProperty, foldDurationProperty,
    } = inputs.current
    if (!node || !enabled) return
    if (typeof node.animate !== "function") return

    // Where the zoom under way had got to, read before it is cancelled: a
    // close pressed mid-open shrinks the card from the size it had reached,
    // and a tile pressed again mid-close grows it back from where it is,
    // instead of either snapping the card to rest first. A flight that has
    // finished reads as rest, so this is the plain start otherwise.
    const previous = flightRef.current
    const [flying] = animations.current
    const resumed = previous && previous.mode !== mode && flying && typeof flying.currentTime === "number"
      ? previous.timeline.at(Math.min(Math.max(flying.currentTime, 0), previous.timeline.duration))
      : null

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
      const outline = insideBorder(origin!, originRect, originCornerRadius(origin))
      // A card that lands whole (a note, the résumé) sits on the tile as a
      // page, centred and contained; the rest land artwork on artwork. Both
      // start on the tile's whole outline.
      const whole = getZoomWhole?.()
      const wholeRect = whole?.getBoundingClientRect()
      const landsWhole = Boolean(whole && wholeRect && wholeRect.width > 0 && wholeRect.height > 0)
      const keep = matched && !landsWhole ? getZoomKeep?.() : null
      // The line under the artwork where the card's body begins, which the
      // clip lands on before the body unfolds. Only a frame that is mostly in
      // view: with the card scrolled past it the clip would land on a sliver.
      const keepRect = keep?.getBoundingClientRect()
      const frameBottom = keepRect && keepRect.height > 0 && keepRect.bottom - target.top >= keepRect.height / 2
        ? Math.min(keepRect.bottom - target.top, target.height)
        : null
      const geometry: ZoomGeometry = landsWhole
        ? { origin: outline.rect, radius: outline.radius, artwork: outline.rect, target, anchor: wholeRect!, fit: "contain", frameBottom: null }
        : {
          origin: outline.rect,
          radius: outline.radius,
          artwork: matched ? paintedRect(artwork!.element) : outline.rect,
          target,
          anchor: anchor ?? target,
          fit: anchor ? "cover" : "top",
          frameBottom,
        }
      const durations: ZoomDurations = {
        zoom: durationOf(zoomFrame, mode === "open" ? zoomOpenDurationProperty : zoomCloseDurationProperty),
        unfold: zoomUnfoldDurationProperty ? durationOf(zoomFrame, zoomUnfoldDurationProperty) : 0,
        fold: foldDurationProperty ? durationOf(zoomFrame, foldDurationProperty) : 0,
      }
      const from: ZoomPose = resumed ?? (mode === "open" ? { grown: 0, unfolded: 0 } : { grown: 1, unfolded: 1 })
      const timeline = buildTimeline(mode, from, durations, geometry.frameBottom !== null)
      flightRef.current = { mode, timeline }
      const timing: KeyframeAnimationOptions = {
        duration: timeline.duration,
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

      const outlineElement = getZoomOutline?.()
      const style = outlineElement && !fullScreen ? getComputedStyle(outlineElement) : null
      const radii = (style
        ? [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius].map((value) => parseFloat(value) || 0)
        : [0, 0, 0, 0]) as Corners

      const zoom = buildZoomKeyframes(
        timeline,
        geometry,
        radii,
        // The card's own corner curve; the tile shares the token.
        cornerControl(getComputedStyle(outlineElement ?? origin!).getPropertyValue("corner-top-left-shape")),
      )
      flights = [node.animate(zoom.keyframes, timing)]

      const tileStyle = origin ? getComputedStyle(origin) : null
      const tileFill = tileStyle && !transparent(tileStyle.backgroundColor)
        ? tileStyle.backgroundColor
        : getComputedStyle(document.body).backgroundColor
      // The popup's own fade off the tile starts this far into the close.
      const handoff = handoffDurationProperty ? durationOf(zoomFrame, handoffDurationProperty) : 0
      const fadeFrom = timeline.duration > 0 ? 1 - handoff / timeline.duration : 1
      flights.push(node.animate(buildReachKeyframes(mode, zoom.reach, tileFill, fadeFrom), timing))

      if (landsWhole) {
        const { chrome, fills } = surroundings(node, whole!)
        for (const element of chrome) flights.push(element.animate(buildChromeKeyframes(timeline), timing))
        // The card keeps its own fill: it is the page that lands.
        for (const { element, color } of fills) {
          if (element === whole) continue
          flights.push(element.animate(buildFillKeyframes(timeline, "rgba(0, 0, 0, 0)", color), timing))
        }
      }

      if (keep && tileStyle && !transparent(tileStyle.backgroundColor)) {
        const { chrome, fills } = surroundings(node, keep)
        for (const element of chrome) flights.push(element.animate(buildChromeKeyframes(timeline), timing))
        for (const { element, color } of fills) {
          flights.push(element.animate(buildFillKeyframes(timeline, tileFill, color), timing))
        }
      }

      // The two videos loop on their own clocks, so the one taking over shows
      // a different moment of the same loop and the hand-off jumped. The one
      // arriving starts where the one leaving is.
      syncPlayback(mode === "open" ? artwork?.element : anchorElement, mode === "open" ? anchorElement : artwork?.element)
      if (mode === "open") holdFrame(artwork?.element, anchorElement)
      else {
        const handOver = handOverFrame(artwork?.element, anchorElement, timing)
        if (handOver) flights.push(handOver)
      }

      // The tile itself is left alone. It used to hand off -- its contents
      // faded as the surface appeared and stayed hidden while the gallery was
      // up -- which left an empty slot in the grid behind the dialog, and
      // crossing the two fades showed both copies of the artwork at once. The
      // surface covers the whole tile from its first frame instead, and on
      // the way back fades off a tile that is already there.
    } else {
      flightRef.current = null
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
