import { Dialog } from "@base-ui/react/dialog"
import { useCallback, useImperativeHandle, useRef, useState, type CSSProperties, type Ref } from "react"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { measurePhotoOrigins, usePhotoOriginTransition } from "../lib/usePhotoOriginTransition"
import { usePhotoSphere } from "../lib/usePhotoSphere"
import { personalPhotoItems as photos } from "../data/personalPhotos"
import { usePreviewCount } from "../lib/photoLayout"

export type PersonalPhotosSheetHandle = {
  /** Opens the globe; with a photo id, holds that photo at the centre once
      the prints have landed. */
  openPhoto: (opener: HTMLElement, photoId?: string) => void
}
/** A dozen photos make a scatter, not a globe: the sphere only reads as one
    when it is covered, and it is covered at about three dozen tiles. Every
    photo appears at least twice — the repeats are what keep the globe full
    all the way round — and more often while the set is small. The copies
    after the first are decoration: hidden from assistive tech and from Tab,
    and carrying no photo id, so no print mistakes one for its own. */
const sphereCopies = Math.max(2, Math.round(36 / photos.length))
const sphereTiles = Array.from({ length: sphereCopies }, (_, copy) => photos.map((photo, index) => ({ photo, index, copy }))).flat()
// A slide's width, which is its size at the front of the globe: a share of
// --sphere-size in personal-photos.css.
/** Each tile's width as a share of the globe, at the front. Three dozen tiles
    take a fifth of the globe each; more tiles share the same surface, so the
    width comes down by the square root of the count. */
const sphereCardShare = 0.2 * Math.sqrt(36 / sphereTiles.length)
const spherePhotoSizes = `(max-width: 699.98px) calc(min(118vw, 72vh) * ${(sphereCardShare * 1.3).toFixed(3)}), calc(min(94vw, 88vh, 56rem) * ${sphereCardShare.toFixed(3)})`

export function PersonalPhotosSheet({ ref, onPreviewImagesChange }: { ref?: Ref<PersonalPhotosSheetHandle>; onPreviewImagesChange: (images: Record<string, string>) => void }) {
  const [open, setOpen] = useState(false)
  const previewCount = usePreviewCount()
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const [origins, setOrigins] = useState<ReturnType<typeof measurePhotoOrigins>>([])
  const sheetRef = useRef<HTMLDivElement>(null)
  const [sheetNode, setSheetNode] = useState<HTMLDivElement | null>(null)
  const dialogActions = useRef<Dialog.Root.Actions>(null)
  const finishPhotoClose = useCallback(() => dialogActions.current?.unmount(), [])
  const registerSheet = useCallback((sheet: HTMLDivElement | null) => {
    sheetRef.current = sheet
    setSheetNode(sheet)
  }, [])
  const reducedMotion = usePrefersReducedMotion()
  const closeFromMargin = useCallback(() => dialogActions.current?.close(), [])
  // Before the flights: the sphere places every slide, and holds still for
  // the close, ahead of the flight measuring where the slides are.
  const sphere = usePhotoSphere(sheetNode, { open, reducedMotion, onStageClick: closeFromMargin })
  const openPhoto = useCallback((opener: HTMLElement, photoId?: string) => {
    setOrigins(measurePhotoOrigins(opener))
    setOpener(opener)
    setOpen(true)
    // The globe isn't mounted yet on the first open; the hook keeps the
    // request until it is, and the hold waits for the prints to land.
    if (photoId) sphere.current.hold(photoId)
  }, [sphere])
  useImperativeHandle(ref, () => ({ openPhoto }), [openPhoto])
  usePhotoOriginTransition(sheetNode, open, opener, origins, reducedMotion, finishPhotoClose)

  const onOpenChange = (nextOpen: boolean, details: Dialog.Root.ChangeEventDetails) => {
    if (!nextOpen) {
      // Escape lets a held photo go first; the next Escape closes.
      if (details.reason === "escape-key" && sphere.current.release()) return
      const sheet = sheetRef.current
      if (sheet) {
        // Hand the stack the full-size bitmaps the sheet has loaded, so the
        // returning photo and the print it lands on are the same image.
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
          <Dialog.Description className="sr-only">A few moments outside the portfolio, on a slowly turning globe of prints. Drag, scroll, or use the arrow keys to turn it; Tab brings each photo to the front. Escape or a click beside the globe returns to the page.</Dialog.Description>
          {/* The stage takes every press: a drag anywhere turns the globe, a
              click on a photo brings it to the front, and only a click on the
              margin around the globe closes. */}
          <div
            ref={registerSheet}
            className="personal-photos-sheet"
            role="region"
            aria-label="Photo globe"
            tabIndex={0}
          >
            <div className="personal-photos-sphere" data-front={previewCount} style={{ "--sphere-card-share": sphereCardShare } as CSSProperties}>
              {sphereTiles.map(({ photo, index, copy }) => (
                <figure
                  className="personal-photos-slide"
                  data-photo-id={copy ? undefined : photo.id}
                  data-photo-retained={!copy && index < previewCount ? "" : undefined}
                  key={`${photo.id}-${copy}`}
                  role={copy ? undefined : "group"}
                  tabIndex={copy ? -1 : 0}
                  aria-hidden={copy ? true : undefined}
                  aria-label={copy ? undefined : `${index + 1} of ${photos.length}`}
                >
                  <img
                    src={`/images/personal/${photo.name}.webp`}
                    srcSet={`/images/personal/${photo.name}-400w.webp 400w, /images/personal/${photo.name}-800w.webp 800w, /images/personal/${photo.name}.webp ${photo.width}w`}
                    sizes={spherePhotoSizes}
                    // Eager, every one: the copies share the originals' files,
                    // so it is 27 small images, and a lazy one waiting on
                    // the far side of the globe (display: none never loads)
                    // came round to the front still blank.
                    loading="eager"
                    alt={copy ? "" : photo.alt}
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
            {/* Draws every slide as a glass pebble; the slides underneath
                keep the pointer, the focus, and the flights. */}
            <canvas className="personal-photos-pebbles" aria-hidden="true" />
            {/* Each print's own figcaption is what a screen reader hears. */}
            <p className="personal-photos-sphere-caption" aria-hidden="true" />
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
