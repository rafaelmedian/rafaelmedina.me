import { cssTimeToMilliseconds } from "./cssTime"

/**
 * A project, the résumé, the notes list, and every note own a prerendered
 * page, and once React runs that address opens its dialog over the feed
 * instead. Painted as-is, a shared link showed one page, swapped it for the
 * feed, and only then opened the dialog on top.
 *
 * `index.html` marks those addresses `pending` before anything paints, which
 * holds the page back (`standalone.css`). The gallery reveals it in the frame
 * it presents, so the page fades in under the dialog's own entrance. Anything
 * that ends the visit without a dialog -- a failed chunk, a note that is not
 * coming -- reveals it too, and the head script stops waiting after 4s.
 */
export function revealGalleryEntry() {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (root.dataset.galleryEntry !== "pending") return
  root.dataset.galleryEntry = "revealing"
  // Off again once the fade is done, so the page is not left holding a
  // filled opacity animation for the rest of the visit.
  const duration = cssTimeToMilliseconds(getComputedStyle(root).getPropertyValue("--duration-base"))
  window.setTimeout(() => {
    if (root.dataset.galleryEntry === "revealing") delete root.dataset.galleryEntry
  }, duration)
}
