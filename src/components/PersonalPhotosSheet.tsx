import { PhotoWallSurface } from "./PhotoWallSurface"
import type { OpenPhoto } from "./PersonalPhotosPreview"
import { ChevronDown } from "lucide-react"
import { PhotoWallControls } from "./PhotoWallControls"
import { PhotoWallZoomHint } from "./PhotoWallZoomHint"
import { Dialog } from "@base-ui/react/dialog"
import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties, type Ref, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { measurePhotoOrigins, usePhotoOriginTransition } from "../lib/usePhotoOriginTransition"
import { usePhotoWallMedia } from "../lib/usePhotoWallMedia"
import { usePhotoWall } from "../lib/usePhotoWall"
import { usePhotoWallCaption } from "../lib/usePhotoWallCaption"
import { personalPhotoItems as photos } from "../data/personalPhotos"
import { usePreviewCount } from "../lib/photoLayout"

export type PersonalPhotosSheetHandle = {
  /** Opens the wall with every photo at rest. */
  openPhoto: OpenPhoto
}
// Start at the actual column width. The camera upgrades sizes as it zooms,
// rather than decoding maximum-zoom originals for every initial tile.
const wallPhotoSizes = "calc((max(80rem, 125vw) - 5 * 3rem) / 5)"
/** A wall photo held at the centre of the stage: the slide's own id, and
    the move and growth that carry it there from where it lies. */
type WallSlot = { left: number; top: number; width: number; height: number }
type HeldPhoto = { wallSlot: WallSlot; wallFocus: { x: number; y: number }; id: string; instance: string; caption: string; scale: number; layoutGap: number; left: number; top: number; width: number; height: number; scrollTop: number }
// The middle panel owns the accessible originals and gallery flights. Eight
// identical neighbours fill the viewport as the camera recycles their cells.
const wallPanels = [{ x: 0, y: 0 }, ...[-1, 0, 1].flatMap(y =>
  [-1, 0, 1].filter(x => x !== 0 || y !== 0).map(x => ({ x, y })))]


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

function PhotoColumns({ panel = "0,0", loadedPhotos, gridColumns, held, previewCount, toggleHold, onSlideKeyDown }: {
  panel?: string
  loadedPhotos: ReadonlySet<string>
  gridColumns: { photo: typeof photos[number]; index: number }[][]
  held: HeldPhoto | null
  previewCount: number
  toggleHold: (slide: HTMLElement, photo: typeof photos[number]) => void
  onSlideKeyDown: (event: ReactKeyboardEvent<HTMLElement>, photo: typeof photos[number]) => void
}) {
  const copy = panel !== "0,0"
  return gridColumns.map((column, columnIndex) => (
    <div className="personal-photos-column" key={columnIndex}>
      {column.map(({ photo, index }) => {
        const instance = copy ? `${panel}:${photo.id}` : photo.id
        const selected = held?.instance === instance
        const load = selected || loadedPhotos.has(photo.id)
        return (
          <figure
            className="personal-photos-slide"
            data-photo-id={copy ? undefined : photo.id}
            data-photo-source={photo.id}
            data-photo-instance={instance}
            data-photo-copy={copy ? "" : undefined}
            data-photo-retained={!copy && index < previewCount ? "" : undefined}
            data-held={selected ? "" : undefined}
            style={selected ? { "--hold-scale": held.scale.toFixed(4), "--hold-layout-gap": `${held.layoutGap.toFixed(3)}px` } as CSSProperties : undefined}
            key={photo.id}
            // A press enlarges the print and a second lets it go, so it is a
            // toggle button: "group, 3 of 40" never said it could be pressed
            // or that it was the one held. The photo's own description joins
            // the name, since a button's contents are not read on their own.
            role={copy ? undefined : "button"}
            aria-pressed={copy ? undefined : selected}
            aria-label={copy ? undefined : `Photo ${index + 1} of ${photos.length}: ${photo.alt}`}
            tabIndex={copy ? undefined : 0}
            onClick={(event) => toggleHold(event.currentTarget, photo)}
            onKeyDown={(event) => onSlideKeyDown(event, photo)}
          >
            <span className={photo.id === "golden-gate-waves" ? "personal-photo-level" : undefined}>
            <img
              src={load ? `/images/personal/${photo.name}.webp` : undefined}
              srcSet={load ? `/images/personal/${photo.name}-400w.webp 400w, /images/personal/${photo.name}-800w.webp 800w, /images/personal/${photo.name}.webp ${photo.width}w` : undefined}
              // Held, the photo is drawn far larger than its
              // column: say so, and the browser fetches the
              // larger candidate for it.
              sizes={selected ? `${Math.round(held.width)}px` : wallPhotoSizes}
              data-placeholder={`/images/personal/${photo.name}-thumb.webp`}
              loading="eager"
              alt={copy ? "" : photo.alt}
              width={photo.width}
              height={photo.height}
              decoding="async"
              draggable={false}
              style={{ aspectRatio: `${photo.width} / ${photo.height}`, backgroundImage: load ? `url(/images/personal/${photo.name}-thumb.webp)` : undefined }}
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
  const previewCount = usePreviewCount()
  const columnCount = 5
  // The first photos are the prints, so dealing them round-robin puts them
  // across the top of the grid rather than down its left-hand column.
  const gridColumns = Array.from({ length: columnCount }, (_, column) =>
    photos.map((photo, index) => ({ photo, index })).filter(({ index }) => index % columnCount === column))
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const [held, setHeld] = useState<HeldPhoto | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const detailsButton = useRef<HTMLButtonElement>(null)
  const selectedPhoto = photos.find(photo => photo.id === held?.id)
  /** The hold as the handlers see it, ahead of the render. */
  const heldRef = useRef<HeldPhoto | null>(null)
  const shiftedWallSlides = useRef<HTMLElement[]>([])
  const [origins, setOrigins] = useState<ReturnType<typeof measurePhotoOrigins>>([])
  const sheetRef = useRef<HTMLDivElement>(null)
  const [sheetNode, setSheetNode] = useState<HTMLDivElement | null>(null)
  const dialogActions = useRef<Dialog.Root.Actions>(null)
  const finishPhotoClose = useCallback(() => dialogActions.current?.unmount(), [])
  const pressedClearance = useRef(false)
  const registerSheet = useCallback((sheet: HTMLDivElement | null) => {
    sheetRef.current = sheet
    setSheetNode(sheet)
    if (sheet) sheet.scrollTop = 0
  }, [])
  const reducedMotion = usePrefersReducedMotion()
  const openPhoto = useCallback((opener: HTMLElement) => {
    setOrigins(measurePhotoOrigins(opener))
    setOpener(opener)
    setOpen(true)
  }, [])
  useImperativeHandle(ref, () => ({ openPhoto }), [openPhoto])
  /** Holds a wall photo: it glides from where it lies to the centre of the
      stage and grows to fill most of it, its caption under it. Measured
      from the slide's layout box and its centre against the stage's client
      box, so a photo
      at an edge or below the fold comes to the middle of the screen rather
      than growing in place off it. */
  const holdSlide = (slide: HTMLElement, photo: typeof photos[number]) => {
    const sheet = sheetRef.current
    if (!sheet) return
    const stage = sheet.getBoundingClientRect()
    const frame = getComputedStyle(slide)
    const width = parseFloat(frame.width)
    const height = parseFloat(frame.height)
    const cameraScale = wall.current.scale()
    const slot = wallSlotReader(sheet, cameraScale)(slide)
    const compact = sheet.clientWidth < 700
    const availableWidth = sheet.clientWidth
    // Keep the caption clear of the bottom Close pill.
    const availableHeight = sheet.clientHeight - (compact ? 0 : 96)
    const centreX = stage.left + availableWidth / 2
    const centreY = stage.top + availableHeight / 2
    const holdShare = 0.78
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
      wallFocus: { x: centreX - slot.left - slot.width / 2, y: centreY - slot.top - slot.height / 2 },
      scale,
      // Preserve the column height so scroll anchoring cannot release the hold.
      layoutGap: height - framedHeight,
      left,
      top,
      width: heldWidth,
      height: heldHeight,
      scrollTop: sheet.scrollTop,
    }
    setHeld(heldRef.current)
  }
  /** Lets a held wall photo go. True if one was held. */
  const releaseHeld = useCallback(() => {
    if (!heldRef.current) return false
    heldRef.current = null
    setHeld(null)
    return true
  }, [])
  const wall = usePhotoWall(sheetNode, open, releaseHeld)
  const loadedPhotos = usePhotoWallMedia(sheetNode, open)
  usePhotoWallCaption(sheetNode, held?.instance, held?.caption, reducedMotion)
  usePhotoOriginTransition(sheetNode, open, opener, origins, reducedMotion, finishPhotoClose)

  useLayoutEffect(() => {
    if (!sheetNode) {
      shiftedWallSlides.current = []
      return
    }
    // The camera has already placed an unselected wall. Measuring all nine
    // copies here only to write zero shifts forced another full layout while
    // opening. A release only needs to clear the shifts we previously wrote.
    if (!held?.wallSlot) {
      if (!shiftedWallSlides.current.length) return
      wall.current.followFocus(0, 0)
      for (const slide of shiftedWallSlides.current) {
        slide.style.removeProperty("--wall-shift-x")
        slide.style.removeProperty("--wall-shift-y")
      }
      shiftedWallSlides.current = []
      return
    }
    wall.current.followFocus(held.wallFocus.x, held.wallFocus.y)
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
    shiftedWallSlides.current = []
    for (const { slide, x, y } of shifts) {
      if (x || y) {
        slide.style.setProperty("--wall-shift-x", `${x}px`)
        slide.style.setProperty("--wall-shift-y", `${y}px`)
        shiftedWallSlides.current.push(slide)
      } else {
        slide.style.removeProperty("--wall-shift-x")
        slide.style.removeProperty("--wall-shift-y")
      }
    }
  }, [held, detailsOpen, sheetNode, wall])

  const browseWall = (direction: number, axis: "x" | "y" = "x") => {
    const sheet = sheetRef.current
    if (!sheet) return
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
    if (!sheetNode) return
    const onScroll = () => { if (heldRef.current && sheetNode.scrollTop !== heldRef.current.scrollTop) releaseHeld() }
    const onResize = () => { releaseHeld() }
    sheetNode.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      sheetNode.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [sheetNode, releaseHeld])

  // A press beside an enlarged photo releases it without closing the wall.
  const onPointerDown = (event: ReactPointerEvent) => {
    // A press and its click can land on different nodes; trust the press.
    const target = event.target as Element
    const emptyGridSpace = Boolean(heldRef.current) && !target.closest(".personal-photos-slide")
    pressedClearance.current = event.target === event.currentTarget || emptyGridSpace
  }
  const onSheetClick = () => {
    if (pressedClearance.current) releaseHeld()
  }

  const onOpenChange = (nextOpen: boolean, details: Dialog.Root.ChangeEventDetails) => {
    // The dev tuner's panel sits outside the sheet; working its dials is not a
    // press on the page behind.
    if (import.meta.env.DEV && !nextOpen && details.reason === "outside-press"
      && details.event.target instanceof Element && details.event.target.closest(".dialkit-root")) return
    if (!nextOpen) {
      // Escape lets a held photo go first; the next Escape closes.
      if (details.reason === "escape-key" && releaseHeld()) return
      const sheet = sheetRef.current
      // A close asked for over a held photo — or inside its glide back —
      // snaps the grid to rest first, so the flight measures the slides
      // where they will stay.
      if (sheet) {
        releaseHeld()
        sheet.setAttribute("data-hold-snap", "")
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
        <Dialog.Backdrop className="personal-photos-backdrop" data-layout="wall" />
        <Dialog.Popup initialFocus={sheetRef} finalFocus={() => opener} className="personal-photos-dialog" data-layout="wall" onKeyDown={event => {
          if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
          if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return
          event.preventDefault()
          browseWall(event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1, event.key === "ArrowUp" || event.key === "ArrowDown" ? "y" : "x")
        }}>
          <Dialog.Title className="sr-only">Personal photos</Dialog.Title>
          <Dialog.Description className="sr-only">
            Drag or scroll in any direction to explore the photo wall. Pinch or use plus and minus to zoom. Arrow keys browse photos in that direction; Shift with an arrow key pans. Zero resets. Click or press Enter to enlarge a photo. Escape returns it, then closes the viewer.
          </Dialog.Description>
          <PhotoWallControls open={open} />
          {open && <PhotoWallZoomHint stage={sheetNode} />}
          <div
            ref={registerSheet}
            className="personal-photos-sheet"
            data-layout="wall"
            role="region"
            aria-label="Photo wall"
            data-held={held ? "" : undefined}
            tabIndex={0}
            onPointerDown={onPointerDown}
            onClick={onSheetClick}
          >
            <PhotoWallSurface>
              <div className="personal-photos-masonry" style={held?.wallFocus ? { "--wall-focus-x": `${held.wallFocus.x}px`, "--wall-focus-y": `${held.wallFocus.y}px` } as CSSProperties : undefined}>
                {wallPanels.map(({ x, y }) => (
                  <div className="personal-photos-wall-panel" data-wall-x={x} data-wall-y={y} aria-hidden={x !== 0 || y !== 0 ? true : undefined} key={`${x},${y}`}>
                    <PhotoColumns loadedPhotos={loadedPhotos} panel={`${x},${y}`} gridColumns={gridColumns} held={held} previewCount={previewCount} toggleHold={toggleHold} onSlideKeyDown={onSlideKeyDown} />
                  </div>
                ))}
              </div>
            </PhotoWallSurface>
            {/* The caption follows the held photo; figcaptions remain accessible. */}
            <p className="personal-photos-stage-caption">
              <button ref={detailsButton} className="personal-photo-book personal-photo-control"
                aria-label="Photo details" aria-expanded={detailsOpen} aria-controls="personal-photo-details"
                onPointerDown={event => event.stopPropagation()}
                onClick={event => { event.stopPropagation(); toggleDetails(!detailsOpen) }}>
                <span data-photo-caption-text aria-hidden="true" />
                <ChevronDown className="personal-photo-details-chevron" size={16} />
              </button>
            </p>
          </div>
          <div className="personal-photos-wall-edges" aria-hidden="true">
            {["top", "right", "bottom", "left"].map(edge => <div key={edge} data-edge={edge}><span /><span /></div>)}
          </div>
          {held && selectedPhoto && (
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
