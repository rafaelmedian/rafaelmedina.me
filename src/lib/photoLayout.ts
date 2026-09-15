import { useSyncExternalStore } from "react"

export function subscribePreviewWidth(callback: () => void) {
  window.addEventListener("resize", callback)
  return () => window.removeEventListener("resize", callback)
}

export function usePreviewCount() {
  return useSyncExternalStore(subscribePreviewWidth, () => window.innerWidth >= 700 ? 5 : 4, () => 5)
}

/** The sheet's columns. JS owns the count rather than CSS `columns` because
    the order matters: a CSS multi-column fills its first column top to bottom
    before it starts the second, which parks every print that flies in the
    left-hand column and throws the fan sideways on open. Dealing round-robin
    puts the first photos across the top instead, so the prints converge on the
    middle of the screen and every one of their slots is on screen to fly to. */
export function useSheetColumns() {
  return useSyncExternalStore(subscribePreviewWidth, () => window.innerWidth >= 700 ? 3 : 2, () => 3)
}

/** How the open sheet lays the photos out: turned on a globe, or dealt into
    scrolling columns. */
export type PhotoSheetLayout = "sphere" | "grid" | "wall"
const sheetLayoutKey = "personal-photos-layout"

/** The layout the visitor last picked, so the next visit opens the way they
    left it. Storage can throw (disabled, or a private window at quota); the
    globe is the default either way. */
export function readSheetLayout(): PhotoSheetLayout {
  try {
    const saved = localStorage.getItem(sheetLayoutKey)
    return saved === "grid" || saved === "wall" ? saved : "sphere"
  } catch {
    return "sphere"
  }
}

export function saveSheetLayout(layout: PhotoSheetLayout) {
  try {
    localStorage.setItem(sheetLayoutKey, layout)
  } catch {
    // Unsaved only means the next visit opens on the globe.
  }
}

/** Wall backdrop is independent of the layout, so trying another view does
    not discard the visitor's comparison. */
export function readWallBackground(): boolean {
  try {
    return localStorage.getItem("personal-photos-wall-background") !== "off"
  } catch {
    return true
  }
}

export function saveWallBackground(enabled: boolean) {
  try {
    localStorage.setItem("personal-photos-wall-background", enabled ? "on" : "off")
  } catch {
    // The current visit still uses the selected background.
  }
}
