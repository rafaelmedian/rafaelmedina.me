import { Dialog } from "@base-ui/react/dialog"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"

import { cssTimeToMilliseconds } from "../lib/cssTime"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { measurePhotoOrigins, usePhotoOriginTransition } from "../lib/usePhotoOriginTransition"

import { personalPhotoItems as photos } from "../data/personalPhotos"

type OpenPhoto = (opener: HTMLElement) => void
type PreviewPhoto = { photo: typeof photos[number]; src: string }
const initialPreview = photos.slice(0, 5).map((photo) => ({ photo, src: `/images/personal/${photo.name}-thumb.webp` }))
// Match the sheet gutters, column gaps, and each print's inner padding.
const sheetPhotoSizes = "(max-width: 699.98px) calc((100vw - 2 * clamp(1.25rem, 4vw, 5rem) - 1rem) / 2 - 1rem), calc((min(100vw - 2 * clamp(1.25rem, 4vw, 5rem), 64rem) - 3rem) / 3 - 2rem)"

function subscribePreviewWidth(callback: () => void) {
  window.addEventListener("resize", callback)
  return () => window.removeEventListener("resize", callback)
}

function usePreviewCount() {
  return useSyncExternalStore(subscribePreviewWidth, () => window.innerWidth >= 700 ? 5 : 4, () => 5)
}

/** The sheet's columns. JS owns the count rather than CSS `columns` because
    the order matters: a CSS multi-column fills its first column top to bottom
    before it starts the second, which parks every print that flies in the
    left-hand column and throws the fan sideways on open. Dealing round-robin
    puts the first photos across the top instead, so the prints converge on the
    middle of the screen and every one of their slots is on screen to fly to. */
function useSheetColumns() {
  return useSyncExternalStore(subscribePreviewWidth, () => window.innerWidth >= 700 ? 3 : 2, () => 3)
}

/** Glides a scrolled sheet back to its first row, where the prints were
    dealt, so they fly home from the same slots they flew to. */
function rewindSheet(sheet: HTMLDivElement, halt: { cancelled: boolean }) {
  const total = cssTimeToMilliseconds(getComputedStyle(sheet).getPropertyValue("--photo-rewind-duration"))
  const from = sheet.scrollTop
  return new Promise<void>((resolve) => {
    const start = performance.now()
    const step = (now: number) => {
      if (halt.cancelled) return resolve()
      const t = Math.min(1, (now - start) / total)
      // CSS can't ease scrollTop; an ease-out cubic stands in for --ease-smooth.
      sheet.scrollTop = from * (1 - (1 - (1 - t) ** 3))
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

/** Where a print sits on the fan, at rest and opened.
 *
 *  The prints are dealt along an arc rather than jumbled: the lean runs
 *  straight from one end of the row to the other, and each print drops by the
 *  square of its distance from the middle, which is the arc a hand of cards
 *  makes when it is spread. The drop is a share of the print's own height, so
 *  it holds at every tile size.
 *
 *  The middle print sits on top and each one behind it steps back, so the fan
 *  reads as one pile opening outwards instead of a row shingled left to right.
 *
 *  Pointing at the tile opens the whole hand at once: every print swings out to
 *  its fanned angle on the same arc, deepened to match. The fan answers as one
 *  thing, so there is no single print to pick out and no reason for the pile to
 *  change hands under the pointer.
 */
function arcPlacement(index: number, middle: number, count: number): CSSProperties {
  // -1 at the left end of the fan, 0 in the middle, 1 at the right end.
  const spread = middle === 0 ? 0 : (index - middle) / middle
  return {
    "--print-tilt": `${(spread * 10).toFixed(2)}deg`,
    "--print-fan-tilt": `${(spread * 16).toFixed(2)}deg`,
    "--print-offset-y": `${(spread * spread * 10).toFixed(2)}%`,
    "--print-fan-offset-y": `${(spread * spread * 16).toFixed(2)}%`,
    "--print-depth": count - Math.round(Math.abs(index - middle) * 2),
  } as CSSProperties
}

export function PersonalPhotosPreview({ onOpen, className = "", items }: { onOpen: OpenPhoto; className?: string; items?: PreviewPhoto[] }) {
  const previewRef = useRef<HTMLDivElement>(null)
  const count = usePreviewCount()
  const preview = items ?? initialPreview.slice(0, count)
  useEffect(() => {
    const element = previewRef.current
    if (!element) return
    // Warm the small bitmaps before opening so every flight can show its own
    // photo from the first frame.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      photos.forEach((photo) => {
        const image = new Image()
        image.src = `/images/personal/${photo.name}-thumb.webp`
        void image.decode().catch(() => undefined)
      })
      observer.disconnect()
    }, { rootMargin: "200px" })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  // The middle print of the fan, which the arc is measured from. With an even
  // count it falls between two prints and both lean the same amount.
  const middle = (preview.length - 1) / 2
  return (
    <div ref={previewRef} className={`personal-photos ${className}`}>
      {/* Whichever print is tapped, the sheet opens at its first row: the
          prints are always the first photos, and the close always brings
          those same photos back, so no visit reshuffles the stack. */}
      <button type="button" className="personal-photos-trigger" aria-haspopup="dialog" onClick={(event) => onOpen(event.currentTarget)}>
        <span className="personal-photos-stack" aria-hidden="true" style={{ "--photo-preview-count": preview.length } as CSSProperties}>
          {preview.map(({ photo, src }, index) => (
            <span className="personal-photos-print" data-photo-id={photo.id} key={photo.id} style={arcPlacement(index, middle, preview.length)}>
              <img src={src} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" />
            </span>
          ))}
        </span>
        <span className="personal-photos-label">Personal life</span>
      </button>
    </div>
  )
}

export function PersonalPhotos({ children }: { children?: (openPhoto: OpenPhoto) => ReactNode }) {
  const [open, setOpen] = useState(false)
  const previewCount = usePreviewCount()
  const columnCount = useSheetColumns()
  // The first photos are the prints, so dealing them round-robin puts them
  // across the top of the sheet rather than down its left-hand column.
  const sheetColumns = Array.from({ length: columnCount }, (_, column) =>
    photos.map((photo, index) => ({ photo, index })).filter(({ index }) => index % columnCount === column))
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({})
  const preview = photos.slice(0, previewCount).map((photo) => ({
    photo, src: previewImages[photo.id] ?? `/images/personal/${photo.name}-thumb.webp`,
  }))
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const [origins, setOrigins] = useState<ReturnType<typeof measurePhotoOrigins>>([])
  const sheetRef = useRef<HTMLDivElement>(null)
  const [sheetNode, setSheetNode] = useState<HTMLDivElement | null>(null)
  const dialogActions = useRef<Dialog.Root.Actions>(null)
  const finishPhotoClose = useCallback(() => dialogActions.current?.unmount(), [])
  const pressedClearance = useRef(false)
  /** The rewind in progress, if a close has been asked for but not yet taken. */
  const rewinding = useRef<{ cancelled: boolean } | null>(null)
  const openPhoto: OpenPhoto = (opener) => {
    setOrigins(measurePhotoOrigins(opener))
    setOpener(opener)
    setOpen(true)
  }
  // A reopen during the rewind (a render-prop consumer could) drops the
  // pending close rather than letting it fire under the new visit.
  useEffect(() => {
    if (!open || !rewinding.current) return
    rewinding.current.cancelled = true
    rewinding.current = null
  }, [open])
  const registerSheet = useCallback((sheet: HTMLDivElement | null) => {
    sheetRef.current = sheet
    setSheetNode(sheet)
    if (sheet) sheet.scrollTop = 0
  }, [])
  const reducedMotion = usePrefersReducedMotion()
  usePhotoOriginTransition(sheetNode, open, opener, origins, reducedMotion, finishPhotoClose)

  // The sheet scrolls natively. Its own margin — the padding around the
  // masonry — dismisses on click; the prints and the gaps between them keep
  // swallowing theirs, so browsing never closes by accident.
  const onPointerDown = (event: ReactPointerEvent) => {
    // A press and its click can land on different nodes; trust the press.
    pressedClearance.current = event.target === event.currentTarget
  }
  const onSheetClick = (event: ReactMouseEvent) => {
    if (pressedClearance.current && event.target === event.currentTarget) dialogActions.current?.close()
  }

  const onOpenChange = (nextOpen: boolean, details: Dialog.Root.ChangeEventDetails) => {
    if (!nextOpen) {
      const sheet = sheetRef.current
      // At the first row the close is immediate: the prints fly home and the
      // rest of the sheet goes with it. A scrolled sheet first rewinds to
      // that row, then asks again; only the second request closes. The dialog
      // stays open under the rewind, and a second Escape during it closes at
      // once.
      if (sheet && sheet.scrollTop > 0 && !reducedMotion && !rewinding.current) {
        const halt = { cancelled: false }
        rewinding.current = halt
        void rewindSheet(sheet, halt).then(() => {
          if (!halt.cancelled) dialogActions.current?.close()
        })
        return
      }
      if (rewinding.current) rewinding.current.cancelled = true
      rewinding.current = null
      if (sheet) {
        // Hand the stack the full-size bitmaps the sheet has loaded, so the
        // returning photo and the print it lands on are the same image.
        // Keyed by the slide's own photo, not by its place in the sheet: the
        // columns are dealt round-robin, so DOM order is not photo order.
        setPreviewImages(Object.fromEntries(Array.from(sheet.querySelectorAll<HTMLElement>(".personal-photos-slide")).flatMap((slide) => {
          const photo = photos.find((item) => item.id === slide.dataset.photoId)
          if (!photo) return []
          const image = slide.querySelector("img")!
          return [[photo.id, image.complete && image.naturalWidth ? image.currentSrc : `/images/personal/${photo.name}-thumb.webp`] as const]
        })))
      }
      // The flight owns its final frame. An interrupted CSS opacity transition
      // can finish early and must not unmount the returning photos underneath it.
      if (!reducedMotion && origins.length) details.preventUnmountOnClose()
    }
    setOpen(nextOpen)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} actionsRef={dialogActions}>
      {children ? children(openPhoto) : <PersonalPhotosPreview onOpen={openPhoto} items={preview} />}
      <Dialog.Portal>
        <Dialog.Backdrop className="personal-photos-backdrop" />
        <Dialog.Popup initialFocus={sheetRef} finalFocus={() => opener} className="personal-photos-dialog">
          <Dialog.Title className="sr-only">Personal photos</Dialog.Title>
          <Dialog.Description className="sr-only">A few moments outside the portfolio, laid out on one sheet. Scroll to browse; Escape or a click on the margin returns to the page.</Dialog.Description>
          <div
            ref={registerSheet}
            className="personal-photos-sheet"
            role="region"
            aria-label="Photo sheet"
            tabIndex={0}
            onPointerDown={onPointerDown}
            onClick={onSheetClick}
          >
            <div className="personal-photos-masonry">
              {sheetColumns.map((column, columnIndex) => (
                <div className="personal-photos-column" key={columnIndex}>
                  {column.map(({ photo, index }) => (
                    <figure
                      className="personal-photos-slide"
                      data-photo-id={photo.id}
                      data-photo-retained={index < previewCount ? "" : undefined}
                      key={photo.id}
                      role="group"
                      aria-label={`${index + 1} of ${photos.length}`}
                    >
                      <img
                        src={`/images/personal/${photo.name}.webp`}
                        srcSet={`/images/personal/${photo.name}-400w.webp 400w, /images/personal/${photo.name}-800w.webp 800w, /images/personal/${photo.name}.webp ${photo.width}w`}
                        sizes={sheetPhotoSizes}
                        loading={index < previewCount ? "eager" : "lazy"}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        decoding="async"
                        draggable={false}
                        style={{ backgroundImage: `url(/images/personal/${photo.name}-thumb.webp)` }}
                      />
                      <figcaption>{photo.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
