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
  // its first third. Open and close share the house slow step: at 480ms the
  // spring was 87% grown by 190ms and spent the rest unfolding the card body
  // a pixel a frame, which a reviewer read as the open slowing down at the
  // end. Built from the shared tokens (registered as <time> in
  // preview-gallery.css) so a token change retimes the zoom.
  "--pg-zoom-open-ms": "var(--duration-slow)",
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
