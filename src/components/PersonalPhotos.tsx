import { Dialog } from "@base-ui/react/dialog"
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"

import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { measurePhotoOrigins, usePhotoOriginTransition } from "../lib/usePhotoOriginTransition"

import { personalPhotoItems as photos } from "../data/personalPhotos"

type OpenPhoto = (index: number, opener: HTMLElement) => void
type PreviewPhoto = { photo: typeof photos[number]; src: string }
const initialPreview = photos.slice(0, 5).map((photo) => ({ photo, src: `/images/personal/${photo.name}-thumb.webp` }))

function subscribePreviewWidth(callback: () => void) {
  window.addEventListener("resize", callback)
  return () => window.removeEventListener("resize", callback)
}

function usePreviewCount() {
  return useSyncExternalStore(subscribePreviewWidth, () => window.innerWidth >= 700 ? 5 : 4, () => 5)
}

export function PersonalPhotosPreview({ onOpen, className = "", items, position = 0 }: { onOpen: OpenPhoto; className?: string; items?: PreviewPhoto[]; position?: number }) {
  const previewRef = useRef<HTMLDivElement>(null)
  const count = usePreviewCount()
  const preview = items ?? initialPreview.slice(0, count)
  useEffect(() => {
    const element = previewRef.current
    if (!element) return
    // Wide screens reveal photos beyond the stack. Warm their small bitmaps
    // before opening so every flight can show its own photo from the first frame.
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
  return (
    <div ref={previewRef} className={`personal-photos ${className}`}>
      <button type="button" className="personal-photos-trigger" aria-label="View personal photos" aria-haspopup="dialog" onClick={(event) => {
        // A pointer names a photo; a keyboard press doesn't, so Enter and Space
        // land on the button itself and resume where the last visit left off.
        const print = (event.target as HTMLElement).closest<HTMLElement>(".personal-photos-print")
        const tapped = print ? photos.findIndex((photo) => photo.id === print.dataset.photoId) : -1
        onOpen(tapped < 0 ? position : tapped, event.currentTarget)
      }}>
        <span className="personal-photos-stack" aria-hidden="true" style={{ "--photo-preview-count": preview.length } as CSSProperties}>
          {preview.map(({ photo, src }) => (
            <span className="personal-photos-print" data-photo-id={photo.id} key={photo.id}>
              <img src={src} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" />
            </span>
          ))}
        </span>
        <span className="personal-photos-hint" aria-hidden="true">
          <svg width="36" height="20" viewBox="0 0 36 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M33 5C23 4 11 7 4 15" />
            <path d="M4 15 10.8 13.4M4 15 6.5 8.5" />
          </svg>
          <span>A few moments</span>
        </span>
      </button>
    </div>
  )
}

export function PersonalPhotos({ children }: { children?: (openPhoto: OpenPhoto) => ReactNode }) {
  const [open, setOpen] = useState(false)
  const [initialPosition, setInitialPosition] = useState(0)
  const [resumePosition, setResumePosition] = useState(0)
  const previewCount = usePreviewCount()
  const [previewAnchor, setPreviewAnchor] = useState(0)
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({})
  const previewStart = Math.min(previewAnchor, photos.length - previewCount)
  const preview = photos.slice(previewStart, previewStart + previewCount).map((photo) => ({
    photo, src: previewImages[photo.id] ?? `/images/personal/${photo.name}-thumb.webp`,
  }))
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const [origins, setOrigins] = useState<ReturnType<typeof measurePhotoOrigins>>([])
  const openPhoto: OpenPhoto = (index, opener) => {
    setOrigins(measurePhotoOrigins(opener))
    setOpener(opener)
    setInitialPosition(index)
    setOpen(true)
  }
  const stripRef = useRef<HTMLDivElement>(null)
  const [stripNode, setStripNode] = useState<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const dialogActions = useRef<Dialog.Root.Actions>(null)
  const finishPhotoClose = useCallback(() => dialogActions.current?.unmount(), [])
  const dragRef = useRef<{ pointerId: number; startX: number; startScroll: number; dragged: boolean } | null>(null)
  const pressedClearance = useRef(false)
  const snapTimerRef = useRef(0)
  const registerStrip = useCallback((strip: HTMLDivElement | null) => {
    stripRef.current = strip
    setStripNode(strip)
    if (!strip) return
    const slides = strip.querySelectorAll<HTMLElement>(".personal-photos-slide")
    const step = slides[1].offsetLeft - slides[0].offsetLeft
    strip.scrollLeft = initialPosition * step
  }, [initialPosition])
  const reducedMotion = usePrefersReducedMotion()
  usePhotoOriginTransition(stripNode, open, opener, origins, reducedMotion, finishPhotoClose)

  const moveTo = (index: number) => {
    const strip = stripRef.current
    if (!strip) return
    const next = Math.max(0, Math.min(photos.length - 1, index))
    const slide = strip.querySelectorAll<HTMLElement>(".personal-photos-slide")[next]
    const first = strip.querySelectorAll<HTMLElement>(".personal-photos-slide")[0]
    strip.scrollTo({ left: slide.offsetLeft - first.offsetLeft, behavior: reducedMotion ? "instant" : "smooth" })
  }

  const nearestIndex = () => {
    const strip = stripRef.current
    if (!strip) return 0
    const first = strip.querySelectorAll<HTMLElement>(".personal-photos-slide")[0]
    let nearest = 0
    let distance = Infinity
    photos.forEach((_, index) => {
      const slide = strip.querySelectorAll<HTMLElement>(".personal-photos-slide")[index]
      const target = Math.min(slide.offsetLeft - first.offsetLeft, strip.scrollWidth - strip.clientWidth)
      const delta = Math.abs(target - strip.scrollLeft)
      if (delta < distance) {
        nearest = index
        distance = delta
      }
    })
    return nearest
  }

  // Mouse drag-to-scroll; touch already pans natively. Snap is suspended while
  // dragging so scrollLeft writes aren't fought by mandatory snap, then restored
  // once the release scroll settles on the nearest slide.

  const onPointerDown = (event: ReactPointerEvent) => {
    // Pointer capture retargets the closing click to the strip, so remember
    // where the press actually landed rather than trusting the click's target.
    pressedClearance.current = event.target === event.currentTarget
    if (event.pointerType !== "mouse" || event.button !== 0) return
    const strip = stripRef.current
    if (!strip) return
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startScroll: strip.scrollLeft, dragged: false }
  }

  const onPointerMove = (event: ReactPointerEvent) => {
    const drag = dragRef.current
    const strip = stripRef.current
    if (!drag || !strip || event.pointerId !== drag.pointerId) return
    const delta = event.clientX - drag.startX
    if (!drag.dragged) {
      if (Math.abs(delta) < 4) return
      drag.dragged = true
      window.clearTimeout(snapTimerRef.current)
      strip.setPointerCapture(drag.pointerId)
      strip.style.scrollSnapType = "none"
    }
    strip.scrollLeft = drag.startScroll - delta
  }

  const onPointerEnd = (event: ReactPointerEvent) => {
    const drag = dragRef.current
    const strip = stripRef.current
    if (!drag || event.pointerId !== drag.pointerId) return
    dragRef.current = null
    if (!drag.dragged || !strip) return
    pressedClearance.current = false
    moveTo(nearestIndex())
    snapTimerRef.current = window.setTimeout(() => {
      strip.style.scrollSnapType = ""
    }, reducedMotion ? 0 : 450)
  }

  // Coarse pointers pan the whole strip, shadow clearance included, so the
  // clearance has to take over the dismissal the backdrop used to give us. Only
  // the strip's own padding counts; the card row keeps swallowing its clicks.
  const onStripClick = (event: ReactMouseEvent) => {
    if (pressedClearance.current && event.target === event.currentTarget) dialogActions.current?.close()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    moveTo(event.key === "Home" ? 0 : event.key === "End" ? photos.length - 1 : nearestIndex() + (event.key === "ArrowRight" ? 1 : -1))
  }

  const onOpenChange = (nextOpen: boolean, details: Dialog.Root.ChangeEventDetails) => {
    if (!nextOpen) {
      const strip = stripRef.current
      if (strip) {
        const slides = Array.from(strip.querySelectorAll<HTMLElement>(".personal-photos-slide"))
        const step = slides[1].offsetLeft - slides[0].offsetLeft
        setResumePosition(strip.scrollLeft / step)
        const bounds = strip.getBoundingClientRect()
        const firstVisible = slides.findIndex((slide) => slide.getBoundingClientRect().right > bounds.left)
        setPreviewAnchor(Math.max(0, firstVisible))
        setPreviewImages(Object.fromEntries(slides.map((slide, index) => {
          const image = slide.querySelector("img")!
          const photo = photos[index]
          return [photo.id, image.complete && image.naturalWidth ? image.currentSrc : `/images/personal/${photo.name}-thumb.webp`]
        })))
      }
      // The flight owns its final frame. An interrupted CSS opacity transition
      // can finish early and must not unmount the returning photos underneath it.
      if (!reducedMotion && origins.length) details.preventUnmountOnClose()
      window.clearTimeout(snapTimerRef.current)
      dragRef.current = null
    }
    setOpen(nextOpen)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} actionsRef={dialogActions}>
      {children ? children(openPhoto) : <PersonalPhotosPreview onOpen={openPhoto} items={preview} position={resumePosition} />}
      <Dialog.Portal>
        <Dialog.Backdrop className="personal-photos-backdrop" />
        <Dialog.Popup ref={popupRef} initialFocus={popupRef} finalFocus={() => opener} className="personal-photos-dialog" onKeyDown={onKeyDown}>
          <Dialog.Title className="sr-only">Personal photos</Dialog.Title>
          <Dialog.Description className="sr-only">A few moments outside the portfolio. Scroll horizontally, swipe, drag, or use the left and right arrow keys to browse.</Dialog.Description>
          <div
            ref={registerStrip}
            className="personal-photos-strip"
            role="region"
            aria-label="Photo carousel"
            aria-roledescription="carousel"
            tabIndex={0}
            onClick={onStripClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
          >
            <div className="personal-photos-track">
              {photos.map((photo, index) => (
                <figure className="personal-photos-slide" data-photo-id={photo.id} key={photo.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${photos.length}`}>
                  <img
                    src={`/images/personal/${photo.name}.webp`}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    data-orientation={photo.height === photo.width ? "square" : photo.height > photo.width ? "portrait" : "landscape"}
                    decoding="async"
                    draggable={false}
                    style={{ backgroundImage: `url(/images/personal/${photo.name}-thumb.webp)` }}
                  />
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
