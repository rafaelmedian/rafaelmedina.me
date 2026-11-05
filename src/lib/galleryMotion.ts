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
  // really travels from the tile. Open and close share the house slow step,
  // on the curve in originMotion.ts, which spends the middle half of it on
  // the visible growth. Built from the shared tokens (registered as <time> in
  // preview-gallery.css) so a token change retimes the zoom.
  "--pg-zoom-open-ms": "var(--duration-slow)",
  "--pg-zoom-close-ms": "var(--duration-slow)",
  // The card's body unfolding under the artwork once the zoom has landed it:
  // the picture opens first, then the page. Opening it with the picture put
  // a blank, tile-coloured sheet the size of the screen under a wide card.
  "--pg-zoom-unfold-ms": "var(--duration-slow)",
  // How long the surface takes to fade off the tile at the end of a close.
  // The open cuts in over the tile instead: the surface's artwork lands on the
  // tile's exactly. Half the fast step, so the fade only starts once the
  // close spring is within a pixel of the tile: over the full 120ms it began
  // while the surface was still ~6px short, and the two copies of the artwork
  // showed doubled as they crossed.
  "--pg-zoom-handoff-ms": "calc(var(--duration-fast) / 2)",
  "--pg-content-in-ms": "var(--duration-base)",
  "--pg-content-out-ms": "var(--duration-quick)",
  "--pg-backdrop-in-ms": "var(--duration-base)",
  "--pg-backdrop-out-ms": "var(--duration-quick)",
  "--pg-switch-ms": "var(--duration-base)",
  "--pg-switch-out-ms": "var(--duration-quick)",
} as CSSProperties
