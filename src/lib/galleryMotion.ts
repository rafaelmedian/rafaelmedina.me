import type { CSSProperties } from "react"

import { originCloseEasePoints, originOpenEasePoints, toCssEasing } from "./originMotion"

// The preview gallery's timing, shared with the quotes dialog, which wears the
// gallery's frame and opens the same way. Its own module so the quote card
// can carry it without pulling in the gallery's lazy chunk.
export const galleryMotionVars = {
  "--pg-open-ms": "var(--duration-base)",
  "--pg-close-ms": "var(--duration-quick)",
  "--pg-open-ease": toCssEasing(originOpenEasePoints),
  "--pg-close-ease": toCssEasing(originCloseEasePoints),
  // The zoom out of the tile. Longer than the plain lift because the surface
  // really travels from the tile, on a spring that is most of the way there in
  // its first third; the close is the house slow step. Built from the shared
  // tokens (registered as <time> in preview-gallery.css, so the sum computes
  // to one value the flight can read) so a token change retimes the zoom.
  "--pg-zoom-open-ms": "calc(var(--duration-slow) + var(--duration-fast))",
  "--pg-zoom-close-ms": "var(--duration-slow)",
  // How long the tile and the surface take to hand over at each end of the
  // zoom. On the open only the tile fades: the surface's artwork lands on the
  // tile's exactly, so it cuts in over it, and a crossfade of both overlapped
  // the spring's fastest frames and showed two copies sliding apart. On the
  // close both fade, over the flight's slow tail, where they lie together.
  "--pg-zoom-handoff-ms": "var(--duration-fast)",
  "--pg-content-in-ms": "var(--duration-base)",
  "--pg-content-out-ms": "var(--duration-quick)",
  "--pg-backdrop-in-ms": "var(--duration-base)",
  "--pg-backdrop-out-ms": "var(--duration-quick)",
  "--pg-switch-ms": "var(--duration-base)",
  "--pg-switch-out-ms": "var(--duration-quick)",
} as CSSProperties
