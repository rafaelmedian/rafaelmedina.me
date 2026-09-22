import { PhotoWallSurface } from "./PhotoWallSurface"
import type { OpenPhoto } from "./PersonalPhotosPreview"
import { X } from "./NavigationIcons"
import { ChevronDown } from "lucide-react"
import { PhotoWallControls } from "./PhotoWallControls"
import { Dialog } from "@base-ui/react/dialog"
import { Fragment, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties, type Ref, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react"
import { cssTimeToMilliseconds } from "../lib/cssTime"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { measurePhotoOrigins, usePhotoOriginTransition } from "../lib/usePhotoOriginTransition"
import { usePhotoWall } from "../lib/usePhotoWall"
import { usePhotoWallCaption } from "../lib/usePhotoWallCaption"
import { photoSphereHoldShare, usePhotoSphere } from "../lib/usePhotoSphere"
import { flyBetweenLayouts, snapshotSlides } from "../lib/photoLayoutSwitch"
import { personalPhotoItems as photos } from "../data/personalPhotos"
import { readSheetLayout, usePreviewCount, useSheetColumns, type PhotoSheetLayout } from "../lib/photoLayout"

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
/** Reserve enough source pixels for a focused print before it is selected. */
const spherePhotoSizes = `${photoSphereHoldShare * 100}vw`
// One column's width: the sheet less its gutters and the gaps between the
// columns, as --photo-gutter and --photo-column-gap set them.
// Like the globe, advertise the largest camera zoom before a gesture so
// enlarging the wall never waits for a sharper bitmap to arrive.
const wallPhotoSizes = "calc((max(80rem, 125vw) - 5 * 0.5rem) / 5 * 2.5)"
const gridPhotoSizes = "(max-width: 699.98px) calc((100vw - 0.5rem - 2 * clamp(1.25rem, 4vw, 5rem) - 1rem) / 2), calc((100vw - 0.5rem - 2 * clamp(1.25rem, 4vw, 5rem) - 3rem) / 3)"

/** A grid photo held at the centre of the stage: the slide's own id, and
    the move and growth that carry it there from where it lies. */
type WallSlot = { left: number; top: number; width: number; height: number }
type GridHold = { wallSlot?: WallSlot; wallFocus?: { x: number; y: number }; id: string; instance: string; caption: string; dx: number; dy: number; scale: number; layoutGap: number; left: number; top: number; width: number; height: number; captionTop: number; scrollTop: number }
/** How much of the stage a held grid photo fills, on its longer side. */
const gridHoldShare = 0.7
// The middle panel owns the accessible originals and gallery flights. Eight
// identical neighbours fill the viewport as the camera recycles their cells.
const wallPanels = [{ x: 0, y: 0 }, ...[-1, 0, 1].flatMap(y =>
  [-1, 0, 1].filter(x => x !== 0 || y !== 0).map(x => ({ x, y })))]


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

/** Read layout slots, not animated photo rectangles, so interrupted selections
    always converge on the same centre. Cache column reads before writing shifts. */
function wallSlotReader(sheet: HTMLElement, scale: number) {
  const plane = sheet.querySelector<HTMLElement>(".personal-photos-masonry")!
  const translation = getComputedStyle(plane).translate.split(" ").map(Number.parseFloat)
  const x = translation[0] || 0
  const y = translation[1] || 0
  const columns = new Map<Element, DOMRect>()
  return (slide: HTMLElement): WallSlot => {
    const column = slide.offsetParent as HTMLElement
    let rect = columns.get(column)
    if (!rect) { rect = column.getBoundingClientRect(); columns.set(column, rect) }
    const style = getComputedStyle(slide)
    return { left: rect.left - x + slide.offsetLeft * scale, top: rect.top - y + slide.offsetTop * scale,
      width: parseFloat(style.width) * scale, height: parseFloat(style.height) * scale }
  }
}

function PhotoColumns({ panel = "0,0", gridColumns, held, previewCount, layout, toggleHold, onSlideKeyDown }: {
  panel?: string
  gridColumns: { photo: typeof photos[number]; index: number }[][]
  held: GridHold | null
  previewCount: number
  layout: PhotoSheetLayout
  toggleHold: (slide: HTMLElement, photo: typeof photos[number]) => void
  onSlideKeyDown: (event: ReactKeyboardEvent<HTMLElement>, photo: typeof photos[number]) => void
}) {
  const copy = panel !== "0,0"
  return gridColumns.map((column, columnIndex) => (
    <div className="personal-photos-column" key={columnIndex}>
      {column.map(({ photo, index }) => {
        const instance = copy ? `${panel}:${photo.id}` : photo.id
        const selected = held?.instance === instance
        return (
          <figure
            className="personal-photos-slide"
            data-photo-id={copy ? undefined : photo.id}
            data-photo-source={photo.id}
            data-photo-instance={instance}
            data-photo-copy={copy ? "" : undefined}
            data-photo-retained={!copy && index < previewCount ? "" : undefined}
            data-held={selected ? "" : undefined}
            style={selected ? { "--hold-dx": `${held.dx.toFixed(1)}px`, "--hold-dy": `${held.dy.toFixed(1)}px`, "--hold-scale": held.scale.toFixed(4), "--hold-layout-gap": `${held.layoutGap.toFixed(3)}px` } as CSSProperties : undefined}
            key={photo.id}
            role="group"
            aria-label={`${index + 1} of ${photos.length}`}
            tabIndex={copy ? undefined : 0}
            onClick={(event) => toggleHold(event.currentTarget, photo)}
            onKeyDown={(event) => onSlideKeyDown(event, photo)}
          >
            <span className={photo.id === "golden-gate-waves" ? "personal-photo-level" : undefined}>
            <img
              src={`/images/personal/${photo.name}.webp`}
              srcSet={`/images/personal/${photo.name}-400w.webp 400w, /images/personal/${photo.name}-800w.webp 800w, /images/personal/${photo.name}.webp ${photo.width}w`}
              // Held, the photo is drawn far larger than its
              // column: say so, and the browser fetches the
              // larger candidate for it.
              sizes={selected ? `${Math.round(held.width)}px` : layout === "wall" ? wallPhotoSizes : gridPhotoSizes}
              loading={layout === "wall" || index < previewCount ? "eager" : "lazy"}
              alt={copy ? "" : photo.alt}
              width={photo.width}
              height={photo.height}
              decoding="async"
              draggable={false}
              style={{ aspectRatio: `${photo.width} / ${photo.height}`, backgroundImage: `url(/images/personal/${photo.name}-thumb.webp)` }}
            />
            </span>
            <figcaption>{photo.caption}</figcaption>
          </figure>
        )
      })}
    </div>
  ))
}

export function PersonalPhotosSheet({ ref, onPreviewImagesChange }: { ref?: Ref<PersonalPhotosSheetHandle>; onPreviewImagesChange: (images: Record<string, string>) => void }) {
  const [open, setOpen] = useState(false)
  const [layout] = useState<PhotoSheetLayout>(readSheetLayout)
  const previewCount = usePreviewCount()
  const sheetColumns = useSheetColumns()
  const columnCount = layout === "wall" ? 5 : sheetColumns
  // The first photos are the prints, so dealing them round-robin puts them
  // across the top of the grid rather than down its left-hand column.
  const gridColumns = Array.from({ length: columnCount }, (_, column) =>
    photos.map((photo, index) => ({ photo, index })).filter(({ index }) => index % columnCount === column))
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const [held, setHeld] = useState<GridHold | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const detailsButton = useRef<HTMLButtonElement>(null)
  const selectedPhoto = photos.find(photo => photo.id === held?.id)
  /** The hold as the handlers see it, ahead of the render. */
  const heldRef = useRef<GridHold | null>(null)
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
      from the slide's layout box and its centre against the stage's client
      box, so a photo
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
    const cameraScale = layout === "wall" ? wall.current.scale() : 1
    const slot = layout === "wall" ? wallSlotReader(sheet, cameraScale)(slide) : undefined
    const compact = sheet.clientWidth < 700
    const availableWidth = sheet.clientWidth
    // Keep the caption clear of the bottom Close pill.
    const availableHeight = sheet.clientHeight - (compact ? 0 : 96)
    const centreX = stage.left + availableWidth / 2
    const centreY = stage.top + availableHeight / 2
    const holdShare = layout === "wall" ? 0.78 : gridHoldShare
    const scale = Math.min(holdShare * availableWidth / width, holdShare * availableHeight / height) / cameraScale
    // Keep the preview mat's drawn thickness. Account for the changed padding
    // before centring, so portrait and landscape photos keep their ratio.
    const padding = parseFloat(frame.paddingTop) / scale
    const framedHeight = (width - padding * 2) * photo.height / photo.width + padding * 2
    const heldWidth = width * scale * cameraScale
    const heldHeight = framedHeight * scale * cameraScale
    const left = centreX - heldWidth / 2
    const top = centreY - heldHeight / 2
    heldRef.current = {
      id: photo.id,
      instance: slide.dataset.photoInstance ?? photo.id,
      caption: photo.caption,
      wallSlot: slot,
      wallFocus: slot ? { x: centreX - slot.left - slot.width / 2, y: centreY - slot.top - slot.height / 2 } : undefined,
      dx: slot ? 0 : (centreX - (rect.left + rect.width / 2)) / cameraScale,
      dy: slot ? 0 : (centreY - (rect.top + framedHeight * cameraScale / 2)) / cameraScale,
      scale,
      // Preserve the column height so scroll anchoring cannot release the hold.
      layoutGap: height - framedHeight,
      left,
      top,
      width: heldWidth,
      height: heldHeight,
      // In the sheet's own scrolled coordinates: it is the scroll container.
      captionTop: sheet.scrollTop + centreY - stage.top + heldHeight / 2,
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
  const wall = usePhotoWall(layout === "wall" ? sheetNode : null, open, releaseHeld)
  usePhotoWallCaption(layout === "wall" ? sheetNode : null, held?.instance, held?.caption, reducedMotion)
  usePhotoOriginTransition(sheetNode, open, opener, origins, reducedMotion, finishPhotoClose)

  useLayoutEffect(() => {
    if (layout !== "wall" || !sheetNode) return
    wall.current.followFocus(held?.wallFocus?.x ?? 0, held?.wallFocus?.y ?? 0)
    const scale = wall.current.scale()
    const readSlot = wallSlotReader(sheetNode, scale)
    const selected = held?.wallSlot
    const shifts = Array.from(sheetNode.querySelectorAll<HTMLElement>(".personal-photos-slide"), slide => {
      const slot = readSlot(slide)
      const columnDistance = selected ? slot.left + slot.width / 2 - selected.left - selected.width / 2 : 0
      const sameColumn = selected && Math.abs(columnDistance) < selected.width / 2
      const x = selected && !sameColumn ? Math.sign(columnDistance) * (Math.max(0, (held.width - selected.width) / 2) + (detailsOpen ? 160 : 80)) / scale : 0
      const y = selected && sameColumn && slide.dataset.photoInstance !== held.instance
        ? Math.sign(slot.top - selected.top) * (Math.max(0, (held.height - selected.height) / 2) + (detailsOpen ? 120 : 64)) / scale : 0
      return { slide, x, y }
    })
    for (const { slide, x, y } of shifts) {
      slide.style.setProperty("--wall-shift-x", `${x}px`)
      slide.style.setProperty("--wall-shift-y", `${y}px`)
    }
  }, [held, detailsOpen, layout, sheetNode, wall])

  const browseWall = (direction: number, axis: "x" | "y" = "x") => {
    const sheet = sheetRef.current
    if (!sheet) return
    endLayoutFlight()
    const current = heldRef.current
    // Left and Right browse the collection in its authored order. Up and
    // Down instead follow the masonry column visible on screen, so a vertical
    // press never veers sideways to find the next authored photo.
    const photo = current && axis === "x"
      ? photos[(photos.findIndex(photo => photo.id === current.id) + direction + photos.length) % photos.length]
      : undefined
    const readSlot = wallSlotReader(sheet, wall.current.scale())
    const stage = sheet.getBoundingClientRect()
    const candidates = Array.from(sheet.querySelectorAll<HTMLElement>(".personal-photos-slide"))
      .filter(slide => !photo || slide.dataset.photoSource === photo.id)
      .map(slide => {
        const slot = readSlot(slide)
        const centreX = current?.wallSlot ? current.wallSlot.left + current.wallSlot.width / 2 : stage.left + sheet.clientWidth / 2
        const centreY = current?.wallSlot ? current.wallSlot.top + current.wallSlot.height / 2 : stage.top + sheet.clientHeight / 2
        const dx = slot.left + slot.width / 2 - centreX
        const dy = slot.top + slot.height / 2 - centreY
        const ahead = !current || direction * (axis === "x" ? dx : dy) > 1
        const aligned = !current || axis === "x" || Math.abs(dx) < 1
        return { slide, ahead: ahead && aligned, distance: Math.hypot(dx, dy) }
      }).filter(candidate => candidate.ahead).sort((a, b) => a.distance - b.distance)
    const target = candidates[0]?.slide
    const targetPhoto = photo ?? photos.find(photo => photo.id === target?.dataset.photoSource)
    if (target && targetPhoto) holdSlide(target, targetPhoto)
  }

  const toggleDetails = (next: boolean) => {
    setDetailsOpen(next)
    if (!next) detailsButton.current?.focus({ preventScroll: true })
  }

  const toggleHold = (slide: HTMLElement, photo: typeof photos[number]) => {
    if (heldRef.current?.instance === (slide.dataset.photoInstance ?? photo.id)) releaseHeld()
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
    if (!sheetNode || layout === "sphere") return
    const onScroll = () => { if (heldRef.current && sheetNode.scrollTop !== heldRef.current.scrollTop) releaseHeld() }
    const onResize = () => { releaseHeld() }
    sheetNode.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      sheetNode.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [sheetNode, layout, releaseHeld])

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
    if (event.target !== event.currentTarget || layout === "wall") return
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
      if (sheet && layout !== "sphere") {
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
      // Keep logical focus on the opener without presenting this automatic
      // return as a new tile selection. The trigger clears the marker when
      // focus next leaves, so ordinary keyboard focus still gets its ring.
      opener?.setAttribute("data-photo-focus-return", "")
      // The flight owns its final frame. An interrupted CSS opacity transition
      // can finish early and must not unmount the returning photos underneath it.
      if (!reducedMotion && origins.length) details.preventUnmountOnClose()
    }
    if (!nextOpen) setDetailsOpen(false)
    setOpen(nextOpen)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} actionsRef={dialogActions}>
      <Dialog.Portal>
        <Dialog.Backdrop className="personal-photos-backdrop" data-layout={layout} />
        <Dialog.Popup initialFocus={sheetRef} finalFocus={() => opener} className="personal-photos-dialog" data-layout={layout} onKeyDown={event => {
          if (layout !== "wall" || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return
          event.preventDefault()
          browseWall(event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1, event.key === "ArrowUp" || event.key === "ArrowDown" ? "y" : "x")
        }}>
          <Dialog.Title className="sr-only">Personal photos</Dialog.Title>
          <Dialog.Description className="sr-only">
            {layout === "sphere"
              ? "A few moments outside the portfolio, on a slowly turning globe of prints. Drag, scroll, or use the arrow keys to turn it; Tab brings each photo to the front. Escape or a click beside the globe returns to the page."
              : layout === "wall"
                ? "Drag or scroll in any direction to explore the photo wall. Pinch or use plus and minus to zoom. Arrow keys browse photos in that direction; Shift with an arrow key pans. Zero resets. Click or press Enter to enlarge a photo. Escape returns it, then closes the viewer."
              : "A few moments outside the portfolio, laid out on one sheet. Scroll to browse; Enter or a click holds a photo large and lets it go again. Escape or a click on the margin returns to the page."}
          </Dialog.Description>
          {/* Outside the stage, which captures every press on the globe for
              the drag: a button inside it would never see its own click. */}
          {layout === "wall" ? <PhotoWallControls /> : <Dialog.Close className="personal-photos-wall-close" aria-label="Close photo wall">
            <X size={16} strokeWidth={1.75} aria-hidden="true" />
            <span className="personal-photos-wall-close-label">Close</span>
          </Dialog.Close>}
          {/* On the globe the stage takes every press: a drag anywhere turns
              it, a click on a photo brings it to the front, and only a click
              on the margin around the globe closes. */}
          <div
            ref={registerSheet}
            className="personal-photos-sheet"
            data-layout={layout}
            role="region"
            aria-label={layout === "sphere" ? "Photo globe" : layout === "wall" ? "Photo wall" : "Photo sheet"}
            data-held={layout !== "sphere" && held ? "" : undefined}
            tabIndex={0}
            onPointerDown={layout !== "sphere" ? onPointerDown : undefined}
            onPointerMove={layout === "grid" ? onGridPointerMove : undefined}
            onPointerLeave={layout !== "sphere" ? resetGridTilt : undefined}
            onClick={layout !== "sphere" ? onSheetClick : undefined}
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
                      <span className={photo.id === "golden-gate-waves" ? "personal-photo-level" : undefined}>
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
                      </span>
                      <figcaption>{photo.caption}</figcaption>
                    </figure>
                  ))}
                </div>
                {/* Names the held photo, under it; each print's own figcaption
                    is what a screen reader hears. */}
                <p className="personal-photos-stage-caption" aria-hidden="true" />
              </Fragment>
            ) : (
              <Fragment key={layout}>
                <PhotoWallSurface wall={layout === "wall"}>
                <div className="personal-photos-masonry" style={held?.wallFocus ? { "--wall-focus-x": `${held.wallFocus.x}px`, "--wall-focus-y": `${held.wallFocus.y}px` } as CSSProperties : undefined}>
                  {layout === "wall" ? wallPanels.map(({ x, y }) => (
                    <div className="personal-photos-wall-panel" data-wall-x={x} data-wall-y={y} aria-hidden={x !== 0 || y !== 0 ? true : undefined} key={`${x},${y}`}>
                      <PhotoColumns panel={`${x},${y}`} gridColumns={gridColumns} held={held} previewCount={previewCount} layout={layout} toggleHold={toggleHold} onSlideKeyDown={onSlideKeyDown} />
                    </div>
                  )) : <PhotoColumns gridColumns={gridColumns} held={held} previewCount={previewCount} layout={layout} toggleHold={toggleHold} onSlideKeyDown={onSlideKeyDown} />}
                </div>
                </PhotoWallSurface>
                {/* The held photo's name, under it, as on the globe; the
                    figcaptions stay for assistive tech. */}
                <p className="personal-photos-stage-caption" aria-hidden={layout === "wall" ? undefined : true} style={layout !== "wall" && held ? { "--stage-caption-x": `${held.left + held.width / 2}px`, "--stage-caption-y": `${held.captionTop.toFixed(1)}px`, "--stage-caption-opacity": 1 } as CSSProperties : undefined}>
                  {layout !== "wall" && <span data-photo-caption-text aria-hidden="true">{held?.caption}</span>}
                  {layout === "wall" && <button ref={detailsButton} className="personal-photo-book personal-photo-control"
                    aria-label="Photo details" aria-expanded={detailsOpen} aria-controls="personal-photo-details"
                    onPointerDown={event => event.stopPropagation()}
                    onClick={event => { event.stopPropagation(); toggleDetails(!detailsOpen) }}>
                    <span data-photo-caption-text aria-hidden="true" />
                    <ChevronDown className="personal-photo-details-chevron" size={16} />
                  </button>}
                </p>
              </Fragment>
            )}
          </div>
          {layout === "wall" && held && selectedPhoto && (
            <div className="personal-photo-inspector" style={{
              "--detail-photo-image": `url(/images/personal/${selectedPhoto.name}-800w.webp)`,
              "--detail-photo-left": `${held.left}px`,
              "--detail-photo-width": `${held.width}px`,
              "--detail-photo-height": `${held.height}px`,
              "--detail-photo-right": `${held.left + held.width}px`,
              "--detail-photo-bottom": `${held.top + held.height}px`,
              "--detail-photo-top": `${held.top}px`,
            } as CSSProperties}>
              <section id="personal-photo-details" className="personal-photo-details" aria-label="Photo details" hidden={!detailsOpen}>
                <span className="personal-photo-details-backdrop" aria-hidden="true">
                  <span /><span /><span /><span />
                </span>
                <h2>{selectedPhoto.caption}</h2>
                <p className="personal-photo-description">{selectedPhoto.alt}</p>
                <dl>
                  <div><dt>Date</dt><dd>{selectedPhoto.date ?? "Not recorded"}</dd></div>
                  <div><dt>Camera gear</dt><dd>{selectedPhoto.camera ?? "Not recorded"}</dd></div>
                  <div><dt>Location</dt><dd>{selectedPhoto.location ?? "Not recorded"}</dd></div>
                </dl>
              </section>

            </div>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
