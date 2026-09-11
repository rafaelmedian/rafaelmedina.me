import { Dialog } from "@base-ui/react/dialog"
import { Globe, LayoutGrid } from "lucide-react"
import { Fragment, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties, type Ref, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react"
import { cssTimeToMilliseconds } from "../lib/cssTime"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { measurePhotoOrigins, usePhotoOriginTransition } from "../lib/usePhotoOriginTransition"
import { usePhotoSphere } from "../lib/usePhotoSphere"
import { personalPhotoItems as photos } from "../data/personalPhotos"
import { readSheetLayout, saveSheetLayout, usePreviewCount, useSheetColumns, type PhotoSheetLayout } from "../lib/photoLayout"

export type PersonalPhotosSheetHandle = {
  /** Opens the sheet; on the globe, with a photo id, holds that photo at the
      centre once the prints have landed. */
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
// One column's width: the sheet less its gutters and the gaps between the
// columns, as --photo-gutter and --photo-column-gap set them.
const gridPhotoSizes = "(max-width: 699.98px) calc((100vw - 2 * clamp(1.25rem, 4vw, 5rem) - 1rem) / 2), calc((min(100vw - 2 * clamp(1.25rem, 4vw, 5rem), 64rem) - 3rem) / 3)"

const layoutOptions = [
  { layout: "grid", label: "Grid", Icon: LayoutGrid },
  { layout: "sphere", label: "Sphere", Icon: Globe },
] as const

/** Glides a scrolled grid back to its first row, where the prints were
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
  const [layout, setLayout] = useState<PhotoSheetLayout>(readSheetLayout)
  const previewCount = usePreviewCount()
  const columnCount = useSheetColumns()
  // The first photos are the prints, so dealing them round-robin puts them
  // across the top of the grid rather than down its left-hand column.
  const gridColumns = Array.from({ length: columnCount }, (_, column) =>
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
  /** Set by the toggle, so only a switch — not the open — fades the stage in. */
  const switched = useRef(false)
  const registerSheet = useCallback((sheet: HTMLDivElement | null) => {
    sheetRef.current = sheet
    setSheetNode(sheet)
    if (sheet) sheet.scrollTop = 0
  }, [])
  const reducedMotion = usePrefersReducedMotion()
  const closeFromMargin = useCallback(() => dialogActions.current?.close(), [])
  // Before the flights: the sphere places every slide, and holds still for
  // the close, ahead of the flight measuring where the slides are. The stage
  // is the same node in both layouts, so a switch never replays the open
  // flight; the globe only takes it while it is the one showing.
  const sphere = usePhotoSphere(layout === "sphere" ? sheetNode : null, { open, reducedMotion, onStageClick: closeFromMargin })
  const openPhoto = useCallback((opener: HTMLElement, photoId?: string) => {
    setOrigins(measurePhotoOrigins(opener))
    setOpener(opener)
    setOpen(true)
    // The globe isn't mounted yet on the first open; the hook keeps the
    // request until it is, and the hold waits for the prints to land. The
    // grid has nothing to hold: every print is on its first row.
    if (photoId && layout === "sphere") sphere.current.hold(photoId)
  }, [sphere, layout])
  useImperativeHandle(ref, () => ({ openPhoto }), [openPhoto])
  // A reopen during the rewind (a render-prop consumer could) drops the
  // pending close rather than letting it fire under the new visit.
  useEffect(() => {
    if (!open || !rewinding.current) return
    rewinding.current.cancelled = true
    rewinding.current = null
  }, [open])
  usePhotoOriginTransition(sheetNode, open, opener, origins, reducedMotion, finishPhotoClose)

  const chooseLayout = (next: PhotoSheetLayout) => {
    if (next === layout) return
    if (rewinding.current) rewinding.current.cancelled = true
    rewinding.current = null
    switched.current = true
    saveSheetLayout(next)
    setLayout(next)
  }
  // The new layout starts at its top and fades in over the old one's place;
  // the backdrop and the toggle stay put.
  useLayoutEffect(() => {
    const sheet = sheetRef.current
    if (!switched.current || !sheet) return
    switched.current = false
    sheet.scrollTop = 0
    if (reducedMotion) return
    const tokens = getComputedStyle(sheet)
    sheet.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: cssTimeToMilliseconds(tokens.getPropertyValue("--duration-base")),
      easing: tokens.getPropertyValue("--ease-smooth").trim(),
    })
  }, [layout, reducedMotion])

  // The grid scrolls natively. Its own margin — the padding around the
  // masonry — dismisses on click; the prints and the gaps between them keep
  // swallowing theirs, so browsing never closes by accident. The globe
  // answers its own presses in usePhotoSphere.
  const onPointerDown = (event: ReactPointerEvent) => {
    // A press and its click can land on different nodes; trust the press.
    pressedClearance.current = event.target === event.currentTarget
  }
  const onSheetClick = (event: ReactMouseEvent) => {
    if (pressedClearance.current && event.target === event.currentTarget) dialogActions.current?.close()
  }

  const onOpenChange = (nextOpen: boolean, details: Dialog.Root.ChangeEventDetails) => {
    if (!nextOpen) {
      // Escape lets a held photo go first; the next Escape closes.
      if (details.reason === "escape-key" && sphere.current.release()) return
      const sheet = sheetRef.current
      // At the grid's first row the close is immediate: the prints fly home
      // and the rest of the sheet goes with it. A scrolled grid first rewinds
      // to that row, then asks again; only the second request closes. The
      // dialog stays open under the rewind, and a second Escape during it
      // closes at once. The globe never scrolls, so it always closes at once.
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
        // grid deals its columns round-robin, so DOM order is not photo order.
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
          <Dialog.Description className="sr-only">
            {layout === "sphere"
              ? "A few moments outside the portfolio, on a slowly turning globe of prints. Drag, scroll, or use the arrow keys to turn it; Tab brings each photo to the front. Escape or a click beside the globe returns to the page."
              : "A few moments outside the portfolio, laid out on one sheet. Scroll to browse; Escape or a click on the margin returns to the page."}
          </Dialog.Description>
          {/* Outside the stage, which captures every press on the globe for
              the drag: a button inside it would never see its own click. */}
          <div className="personal-photos-layout" role="group" aria-label="Layout" data-layout={layout}>
            {layoutOptions.map(({ layout: option, label, Icon }) => (
              <button key={option} type="button" aria-pressed={layout === option} onClick={() => chooseLayout(option)}>
                <Icon aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          {/* On the globe the stage takes every press: a drag anywhere turns
              it, a click on a photo brings it to the front, and only a click
              on the margin around the globe closes. */}
          <div
            ref={registerSheet}
            className="personal-photos-sheet"
            data-layout={layout}
            role="region"
            aria-label={layout === "sphere" ? "Photo globe" : "Photo sheet"}
            tabIndex={0}
            onPointerDown={layout === "grid" ? onPointerDown : undefined}
            onClick={layout === "grid" ? onSheetClick : undefined}
          >
            {/* Keyed, so a switch builds the other layout afresh: an unkeyed
                fragment is flattened, and the grid then took over the globe's
                own div — still translated -50%/-50% — for its first frames. */}
            {layout === "sphere" ? (
              <Fragment key="sphere">
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
              </Fragment>
            ) : (
              <div className="personal-photos-masonry" key="grid">
                {gridColumns.map((column, columnIndex) => (
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
                          sizes={gridPhotoSizes}
                          loading={index < previewCount ? "eager" : "lazy"}
                          alt={photo.alt}
                          width={photo.width}
                          height={photo.height}
                          decoding="async"
                          draggable={false}
                          style={{ aspectRatio: `${photo.width} / ${photo.height}`, backgroundImage: `url(/images/personal/${photo.name}-thumb.webp)` }}
                        />
                        <figcaption>{photo.caption}</figcaption>
                      </figure>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
