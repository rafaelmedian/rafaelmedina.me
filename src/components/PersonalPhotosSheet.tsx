import type { OpenPhoto } from "./PersonalPhotosPreview"
import { Dialog } from "@base-ui/react/dialog"
import { Fragment, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties, type Ref, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react"
import { cssTimeToMilliseconds } from "../lib/cssTime"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { measurePhotoOrigins, usePhotoOriginTransition } from "../lib/usePhotoOriginTransition"
import { photoSphereHoldGrowth, usePhotoSphere } from "../lib/usePhotoSphere"
import { flyBetweenLayouts, snapshotSlides } from "../lib/photoLayoutSwitch"
import { personalPhotoItems as photos } from "../data/personalPhotos"
import { readSheetLayout, saveSheetLayout, usePreviewCount, useSheetColumns, type PhotoSheetLayout } from "../lib/photoLayout"
import { isTuningCornerCurve } from "../lib/developmentTuning"

export type PersonalPhotosSheetHandle = {
  /** Opens the sheet; on the globe, with a photo id, holds that photo at the
      centre once the prints have landed. */
  openPhoto: OpenPhoto
}
/** A dozen photos make a scatter, not a globe: the sphere only reads as one
    when it is crowded. Every photo appears at least three times — the repeats
    are spread as independent points in the Fibonacci spiral, keeping the
    globe full all the way round without stacking twins together. The copies
    after the first are decoration: hidden from assistive tech and from Tab,
    and carrying no photo id, so no print mistakes one for its own. */
const sphereCoverageTarget = 54
const sphereCopies = Math.max(3, Math.round(sphereCoverageTarget / photos.length))
/** Rotate the repeated hands before assigning them to the Fibonacci spiral.
    The first hand stays in photo order for the opening flights. At the
    current three-copy density, the two offsets maximize the shortest chord
    between copies instead of letting the same picture occupy nearby points. */
const sphereCopyTurns = [0, 7 / 9, 5 / 9]
const sphereTiles = Array.from({ length: sphereCopies }, (_, copy) => {
  const shift = Math.round(photos.length * (sphereCopyTurns[copy] ?? copy / sphereCopies))
  return photos.map((_, position) => {
    const index = (position + shift) % photos.length
    return { photo: photos[index], index, copy }
  })
}).flat()
// A slide's width, which is its size at the front of the globe: a share of
// --sphere-size in personal-photos.css.
/** Each tile's width as a share of the globe, at the front. The square-root
    adjustment keeps the crowded set near the former cards' size instead of
    cancelling the added density by making every repeat much smaller. */
const sphereCardShare = 0.225 * Math.sqrt(sphereCoverageTarget / sphereTiles.length)
/** The sphere controller can grow any print to 2.7x without a React render.
    Advertise that largest drawn size up front so a 2x screen does not keep
    the 400px candidate after the photo has been held. */
const spherePhotoSizes = `(max-width: 699.98px) calc(min(136vw, 80vh) * ${(sphereCardShare * 1.3 * photoSphereHoldGrowth).toFixed(3)}), calc(min(96vw, 92vh, 60rem) * ${(sphereCardShare * photoSphereHoldGrowth).toFixed(3)})`
// One column's width: the sheet less its gutters and the gaps between the
// columns, as --photo-gutter and --photo-column-gap set them.
const gridPhotoSizes = "(max-width: 699.98px) calc((100vw - 2 * clamp(1.25rem, 4vw, 5rem) - 1rem) / 2), calc((min(100vw - 2 * clamp(1.25rem, 4vw, 5rem), 64rem) - 3rem) / 3)"

/** A grid photo held at the centre of the stage: the slide's own id, and
    the move and growth that carry it there from where it lies. */
type GridHold = { id: string; caption: string; dx: number; dy: number; scale: number; layoutGap: number; left: number; top: number; width: number; height: number; captionTop: number; scrollTop: number }
/** How much of the stage a held grid photo fills, on its longer side. */
const gridHoldShare = 0.7

const layoutOptions = [
  { layout: "grid", label: "Grid" },
  { layout: "sphere", label: "Sphere" },
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
  const tuningCornerCurve = isTuningCornerCurve()
  const columnCount = useSheetColumns()
  // The first photos are the prints, so dealing them round-robin puts them
  // across the top of the grid rather than down its left-hand column.
  const gridColumns = Array.from({ length: columnCount }, (_, column) =>
    photos.map((photo, index) => ({ photo, index })).filter(({ index }) => index % columnCount === column))
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const [held, setHeld] = useState<GridHold | null>(null)
  /** The hold as the handlers see it, ahead of the render. */
  const heldRef = useRef<GridHold | null>(null)
  const [origins, setOrigins] = useState<ReturnType<typeof measurePhotoOrigins>>([])
  const sheetRef = useRef<HTMLDivElement>(null)
  const [sheetNode, setSheetNode] = useState<HTMLDivElement | null>(null)
  const [layoutNode, setLayoutNode] = useState<HTMLDivElement | null>(null)
  const dialogActions = useRef<Dialog.Root.Actions>(null)
  const finishPhotoClose = useCallback(() => dialogActions.current?.unmount(), [])
  const pressedClearance = useRef(false)
  /** The rewind in progress, if a close has been asked for but not yet taken. */
  const rewinding = useRef<{ cancelled: boolean } | null>(null)
  /** Set by the toggle, so only a switch — not the open — fades the stage in. */
  const switched = useRef(false)
  /** Where the old layout left every photo, taken by the toggle before the
      switch, and the flights that carry them to the new one. */
  const switchFrom = useRef<ReturnType<typeof snapshotSlides> | null>(null)
  const layoutFlight = useRef<(() => void) | null>(null)
  const endLayoutFlight = useCallback(() => {
    layoutFlight.current?.()
    layoutFlight.current = null
  }, [])
  useEffect(() => endLayoutFlight, [endLayoutFlight])
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

  /** Returns the selected grid print to its flat pose. The figure itself is
      the stable hit area; only its composed transform turns, so its moving
      edges never decide whether the pointer is still over it. */
  const resetGridTilt = useCallback(() => {
    const slide = sheetRef.current?.querySelector<HTMLElement>(".personal-photos-masonry .personal-photos-slide[data-grid-tilting]")
    if (!slide) return
    slide.removeAttribute("data-grid-tilting")
    slide.style.removeProperty("--grid-tilt-x")
    slide.style.removeProperty("--grid-tilt-y")
    slide.style.removeProperty("--grid-gloss-x")
    slide.style.removeProperty("--grid-gloss-y")
  }, [])

  /** Holds a grid photo: it glides from where it lies to the centre of the
      stage and grows to fill most of it, its caption under it. Measured
      from the slide's layout box and its centre — the centre holds still
      under the hover growth — against the stage's client box, so a photo
      at an edge or below the fold comes to the middle of the screen rather
      than growing in place off it. */
  const holdSlide = (slide: HTMLElement, photo: typeof photos[number]) => {
    const sheet = sheetRef.current
    if (!sheet) return
    resetGridTilt()
    const rect = slide.getBoundingClientRect()
    const stage = sheet.getBoundingClientRect()
    const frame = getComputedStyle(slide)
    const width = parseFloat(frame.width)
    const height = parseFloat(frame.height)
    const scale = Math.min(gridHoldShare * sheet.clientWidth / width, gridHoldShare * sheet.clientHeight / height)
    // Keep the preview mat's drawn thickness. Account for the changed padding
    // before centring, so portrait and landscape photos keep their ratio.
    const padding = parseFloat(frame.paddingTop) / scale
    const framedHeight = (width - padding * 2) * photo.height / photo.width + padding * 2
    const heldWidth = width * scale
    const heldHeight = framedHeight * scale
    const left = stage.left + (sheet.clientWidth - heldWidth) / 2
    const top = stage.top + (sheet.clientHeight - heldHeight) / 2
    heldRef.current = {
      id: photo.id,
      caption: photo.caption,
      dx: stage.left + sheet.clientWidth / 2 - (rect.left + rect.width / 2),
      dy: stage.top + sheet.clientHeight / 2 - (rect.top + framedHeight / 2),
      scale,
      // Preserve the column height so scroll anchoring cannot release the hold.
      layoutGap: height - framedHeight,
      left,
      top,
      width: heldWidth,
      height: heldHeight,
      // In the sheet's own scrolled coordinates: it is the scroll container.
      captionTop: sheet.scrollTop + sheet.clientHeight / 2 + heldHeight / 2,
      scrollTop: sheet.scrollTop,
    }
    setHeld(heldRef.current)
  }
  /** Lets a held grid photo go. True if one was held. */
  const releaseHeld = useCallback(() => {
    if (!heldRef.current) return false
    resetGridTilt()
    heldRef.current = null
    setHeld(null)
    return true
  }, [resetGridTilt])
  const toggleHold = (slide: HTMLElement, photo: typeof photos[number]) => {
    if (heldRef.current?.id === photo.id) releaseHeld()
    else holdSlide(slide, photo)
  }
  const onSlideKeyDown = (event: ReactKeyboardEvent<HTMLElement>, photo: typeof photos[number]) => {
    if (event.key !== "Enter" && event.key !== " ") return
    event.preventDefault()
    toggleHold(event.currentTarget, photo)
  }
  // Scrolling or resizing lets a held photo go: its placement belongs to
  // the previous viewport and grid. A scroll that has already happened by the
  // time of the click — its event arrives a frame late — moved nothing.
  useEffect(() => {
    if (!sheetNode || layout !== "grid") return
    const onScroll = () => { if (heldRef.current && sheetNode.scrollTop !== heldRef.current.scrollTop) releaseHeld() }
    const onResize = () => { releaseHeld() }
    sheetNode.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      sheetNode.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [sheetNode, layout, releaseHeld])

  const chooseLayout = (next: PhotoSheetLayout) => {
    if (next === layout) return
    if (rewinding.current) rewinding.current.cancelled = true
    rewinding.current = null
    releaseHeld()
    endLayoutFlight()
    switched.current = true
    // Where every photo is now, before this layout is torn down: the flights
    // in the switch effect carry each one from here to its place in the next.
    switchFrom.current = !reducedMotion && sheetRef.current ? snapshotSlides(sheetRef.current) : null
    saveSheetLayout(next)
    setLayout(next)
  }
  // The toggle's thumb is sized and placed from the picked segment's own
  // box, so each label hugs its own words; measured again whenever the group
  // resizes, as it does when a webfont swaps in.
  useLayoutEffect(() => {
    if (!layoutNode) return
    const place = () => {
      const active = layoutNode.querySelector<HTMLElement>('[aria-pressed="true"]')
      if (!active) return
      layoutNode.style.setProperty("--thumb-x", `${active.offsetLeft}px`)
      layoutNode.style.setProperty("--thumb-w", `${active.offsetWidth}px`)
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(layoutNode)
    return () => observer.disconnect()
  }, [layoutNode, layout])
  // The new layout starts at its top without fading the entire stage away;
  // the backdrop and the toggle stay put. The photos themselves reorganise:
  // each one on screen flies from where the old layout left it to where the
  // new one has put it, and the globe holds still until they have landed.
  useLayoutEffect(() => {
    const sheet = sheetRef.current
    if (!switched.current || !sheet) return
    switched.current = false
    sheet.scrollTop = 0
    const from = switchFrom.current
    switchFrom.current = null
    if (reducedMotion) return
    const tokens = getComputedStyle(sheet)
    if (!from) return
    layoutFlight.current = flyBetweenLayouts(sheet, from, () => { layoutFlight.current = null })
    if (layout === "sphere") sphere.current.rest(cssTimeToMilliseconds(tokens.getPropertyValue("--photo-layout-duration")))
  }, [layout, reducedMotion, sphere])

  // The grid scrolls natively. Its own margin — the padding around the
  // masonry — dismisses on click; the prints and the gaps between them keep
  // swallowing theirs, so browsing never closes by accident. While a photo
  // is held the margin lets it go instead, as on the globe, and the next
  // click closes. The globe answers its own presses in usePhotoSphere.
  const onPointerDown = (event: ReactPointerEvent) => {
    // A press and its click can land on different nodes; trust the press.
    const target = event.target as Element
    const emptyGridSpace = Boolean(heldRef.current) && !target.closest(".personal-photos-slide")
    pressedClearance.current = event.target === event.currentTarget || emptyGridSpace
  }
  const onGridPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const current = heldRef.current
    const slide = (event.target as Element).closest<HTMLElement>(".personal-photos-slide[data-held]")
    if (reducedMotion || event.pointerType !== "mouse" || !current || slide?.dataset.photoId !== current.id) {
      resetGridTilt()
      return
    }
    const x = Math.min(1, Math.max(0, (event.clientX - current.left) / current.width))
    const y = Math.min(1, Math.max(0, (event.clientY - current.top) / current.height))
    // Four degrees at an edge: enough to catch the light without making a
    // large portrait feel loose. The highlight stays in the upper-left light
    // field and shifts against the turn, as a reflection on glass would.
    slide.style.setProperty("--grid-tilt-x", `${((0.5 - y) * 8).toFixed(2)}deg`)
    slide.style.setProperty("--grid-tilt-y", `${((x - 0.5) * 8).toFixed(2)}deg`)
    slide.style.setProperty("--grid-gloss-x", `${(32 - (x - 0.5) * 22).toFixed(1)}%`)
    slide.style.setProperty("--grid-gloss-y", `${(24 - (y - 0.5) * 18).toFixed(1)}%`)
    slide.setAttribute("data-grid-tilting", "")
  }
  const onSheetClick = (event: ReactMouseEvent) => {
    if (!pressedClearance.current) return
    if (releaseHeld()) return
    // Empty gaps only answer while a photo is held. With the grid at rest,
    // keep requiring the outer sheet margin so browsing between rows cannot
    // close the gallery by accident.
    if (event.target !== event.currentTarget) return
    dialogActions.current?.close()
  }

  const onOpenChange = (nextOpen: boolean, details: Dialog.Root.ChangeEventDetails) => {
    // The dev tuner's panel sits outside the sheet; working its dials is not a
    // press on the page behind.
    if (import.meta.env.DEV && !nextOpen && details.reason === "outside-press"
      && details.event.target instanceof Element && details.event.target.closest(".dialkit-root")) return
    if (!nextOpen) {
      // Escape lets a held photo go first; the next Escape closes.
      if (details.reason === "escape-key" && (sphere.current.release() || releaseHeld())) return
      const sheet = sheetRef.current
      // A close asked for over a held photo — or inside its glide back —
      // snaps the grid to rest first, so the flight measures the slides
      // where they will stay.
      if (sheet && layout === "grid") {
        releaseHeld()
        sheet.setAttribute("data-hold-snap", "")
      }
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
      // A switch still in flight lands at once, so the close measures slides
      // that are showing.
      endLayoutFlight()
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
    <Dialog.Root open={open} onOpenChange={onOpenChange} actionsRef={dialogActions}
      modal={!tuningCornerCurve} disablePointerDismissal={tuningCornerCurve}>
      <Dialog.Portal>
        <Dialog.Backdrop className="personal-photos-backdrop" />
        <Dialog.Popup initialFocus={sheetRef} finalFocus={() => opener} className="personal-photos-dialog">
          <Dialog.Title className="sr-only">Personal photos</Dialog.Title>
          <Dialog.Description className="sr-only">
            {layout === "sphere"
              ? "A few moments outside the portfolio, on a slowly turning globe of prints. Drag, scroll, or use the arrow keys to turn it; Tab brings each photo to the front. Escape or a click beside the globe returns to the page."
              : "A few moments outside the portfolio, laid out on one sheet. Scroll to browse; Enter or a click holds a photo large and lets it go again. Escape or a click on the margin returns to the page."}
          </Dialog.Description>
          {/* Outside the stage, which captures every press on the globe for
              the drag: a button inside it would never see its own click. */}
          <div ref={setLayoutNode} className="personal-photos-layout" role="group" aria-label="Layout" data-layout={layout}>
            {layoutOptions.map(({ layout: option, label }) => (
              <button key={option} type="button" aria-pressed={layout === option} onClick={() => chooseLayout(option)}>
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
            data-held={layout === "grid" && held ? "" : undefined}
            tabIndex={0}
            onPointerDown={layout === "grid" ? onPointerDown : undefined}
            onPointerMove={layout === "grid" ? onGridPointerMove : undefined}
            onPointerLeave={layout === "grid" ? resetGridTilt : undefined}
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
                        style={{ aspectRatio: `${photo.width} / ${photo.height}`, backgroundImage: `url(/images/personal/${photo.name}-thumb.webp)` }}
                      />
                      <figcaption>{photo.caption}</figcaption>
                    </figure>
                  ))}
                </div>
                {/* Names the held photo, under it; each print's own figcaption
                    is what a screen reader hears. */}
                <p className="personal-photos-stage-caption" aria-hidden="true" />
              </Fragment>
            ) : (
              <Fragment key="grid">
                <div className="personal-photos-masonry">
                  {gridColumns.map((column, columnIndex) => (
                    <div className="personal-photos-column" key={columnIndex}>
                      {column.map(({ photo, index }) => (
                        <figure
                          className="personal-photos-slide"
                          data-photo-id={photo.id}
                          data-photo-retained={index < previewCount ? "" : undefined}
                          data-held={held?.id === photo.id ? "" : undefined}
                          style={held?.id === photo.id ? { "--hold-dx": `${held.dx.toFixed(1)}px`, "--hold-dy": `${held.dy.toFixed(1)}px`, "--hold-scale": held.scale.toFixed(4), "--hold-layout-gap": `${held.layoutGap.toFixed(3)}px` } as CSSProperties : undefined}
                          key={photo.id}
                          role="group"
                          aria-label={`${index + 1} of ${photos.length}`}
                          tabIndex={0}
                          onClick={(event) => toggleHold(event.currentTarget, photo)}
                          onKeyDown={(event) => onSlideKeyDown(event, photo)}
                        >
                          <img
                            src={`/images/personal/${photo.name}.webp`}
                            srcSet={`/images/personal/${photo.name}-400w.webp 400w, /images/personal/${photo.name}-800w.webp 800w, /images/personal/${photo.name}.webp ${photo.width}w`}
                            // Held, the photo is drawn far larger than its
                            // column: say so, and the browser fetches the
                            // larger candidate for it.
                            sizes={held?.id === photo.id ? `${Math.round(held.width)}px` : gridPhotoSizes}
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
                {/* The held photo's name, under it, as on the globe; the
                    figcaptions stay for assistive tech. */}
                <p className="personal-photos-stage-caption" aria-hidden="true" style={held ? { "--stage-caption-y": `${held.captionTop.toFixed(1)}px`, "--stage-caption-opacity": 1 } as CSSProperties : undefined}>{held?.caption}</p>
              </Fragment>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
