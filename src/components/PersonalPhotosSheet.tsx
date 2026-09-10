import { Dialog } from "@base-ui/react/dialog"
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type CSSProperties, type Ref, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react"
import { cssTimeToMilliseconds } from "../lib/cssTime"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { measurePhotoOrigins, usePhotoOriginTransition } from "../lib/usePhotoOriginTransition"
import { personalPhotoItems as photos } from "../data/personalPhotos"
import type { OpenPhoto } from "./PersonalPhotosPreview"
import { usePreviewCount, useSheetColumns } from "../lib/photoLayout"

export type PersonalPhotosSheetHandle = { openPhoto: OpenPhoto }
const sheetPhotoSizes = "(max-width: 699.98px) calc((100vw - 2 * clamp(1.25rem, 4vw, 5rem) - 1rem) / 2 - 1.125rem), calc((min(100vw - 2 * clamp(1.25rem, 4vw, 5rem), 64rem) - 3rem) / 3 - 1.375rem)"

/** How a caption was written across the bottom of its print, as units the
    stylesheet scales: how far into the lean range it tips (0-1) and which way,
    where along the band it lands (0 left, 1 right), and how far it rises or
    drops (-1-1). Hashed from the photo's id (FNV-1a) rather than random, so a
    caption keeps its hand from one visit to the next. */
function captionHand(id: string) {
  let hash = 2166136261
  for (const char of id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  const unit = (shift: number) => ((hash >>> shift) & 0xff) / 255
  return {
    "--caption-lean": unit(0).toFixed(3),
    "--caption-sign": hash & 0x100 ? 1 : -1,
    "--caption-place": unit(16).toFixed(3),
    "--caption-rise": ((unit(24) - 0.5) * 2).toFixed(3),
  } as CSSProperties
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

export function PersonalPhotosSheet({ ref, onPreviewImagesChange }: { ref?: Ref<PersonalPhotosSheetHandle>; onPreviewImagesChange: (images: Record<string, string>) => void }) {
  const [open, setOpen] = useState(false)
  const previewCount = usePreviewCount()
  const columnCount = useSheetColumns()
  // The first photos are the prints, so dealing them round-robin puts them
  // across the top of the sheet rather than down its left-hand column.
  const sheetColumns = Array.from({ length: columnCount }, (_, column) =>
    photos.map((photo, index) => ({ photo, index })).filter(({ index }) => index % columnCount === column))
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const [origins, setOrigins] = useState<ReturnType<typeof measurePhotoOrigins>>([])
  const sheetRef = useRef<HTMLDivElement>(null)
  const [sheetNode, setSheetNode] = useState<HTMLDivElement | null>(null)
  const dialogActions = useRef<Dialog.Root.Actions>(null)
  const finishPhotoClose = useCallback(() => dialogActions.current?.unmount(), [])
  const pressedClearance = useRef(false)
  /** The rewind in progress, if a close has been asked for but not yet taken. */
  const rewinding = useRef<{ cancelled: boolean } | null>(null)
  const openPhoto: OpenPhoto = useCallback((opener) => {
    setOrigins(measurePhotoOrigins(opener))
    setOpener(opener)
    setOpen(true)
  }, [])
  useImperativeHandle(ref, () => ({ openPhoto }), [openPhoto])
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
    // The dev tuner's panel sits outside the sheet; working its dials is not a
    // press on the page behind.
    if (import.meta.env.DEV && !nextOpen && details.reason === "outside-press"
      && details.event.target instanceof Element && details.event.target.closest(".dialkit-root")) return
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
        onPreviewImagesChange(Object.fromEntries(Array.from(sheet.querySelectorAll<HTMLElement>(".personal-photos-slide")).flatMap((slide) => {
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
                        style={{ aspectRatio: `${photo.width} / ${photo.height}`, backgroundImage: `url(/images/personal/${photo.name}-thumb.webp)` }}
                      />
                      <figcaption style={captionHand(photo.id)}><span>{photo.caption}</span></figcaption>
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
