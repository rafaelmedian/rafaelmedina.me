import { Dialog } from "@base-ui/react/dialog"
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"

import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"

import { personalPhotoItems as photos } from "../data/personalPhotos"

type OpenPhoto = (index: number, opener: HTMLElement) => void

export function PersonalPhotosPreview({ onOpen, className = "" }: { onOpen: OpenPhoto; className?: string }) {
  return (
    <div className={`personal-photos ${className}`} data-about-fade="">
      <button type="button" className="personal-photos-trigger" aria-label="View personal photos" aria-haspopup="dialog" onClick={(event) => onOpen(0, event.currentTarget)}>
        <span className="personal-photos-stack" aria-hidden="true">
          {photos.slice(0, 5).map((photo) => (
            <span className="personal-photos-print" key={photo.id}>
              <img src={`/images/personal/${photo.name}-thumb.webp`} alt="" width="300" height="400" loading="lazy" decoding="async" />
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
  const [initialIndex, setInitialIndex] = useState(0)
  const [opener, setOpener] = useState<HTMLElement | null>(null)
  const openPhoto: OpenPhoto = (index, opener) => {
    setOpener(opener)
    setInitialIndex(index)
    setOpen(true)
  }
  const stripRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; startX: number; startScroll: number; dragged: boolean } | null>(null)
  const snapTimerRef = useRef(0)
  const registerStrip = useCallback((strip: HTMLDivElement | null) => {
    stripRef.current = strip
    if (!strip) return
    const first = strip.children[0] as HTMLElement
    const selected = strip.children[initialIndex] as HTMLElement
    strip.scrollLeft = selected.offsetLeft - first.offsetLeft
  }, [initialIndex])
  const reducedMotion = usePrefersReducedMotion()

  const moveTo = (index: number) => {
    const strip = stripRef.current
    if (!strip) return
    const next = Math.max(0, Math.min(photos.length - 1, index))
    const slide = strip.children[next] as HTMLElement
    const first = strip.children[0] as HTMLElement
    strip.scrollTo({ left: slide.offsetLeft - first.offsetLeft, behavior: reducedMotion ? "instant" : "smooth" })
  }

  const nearestIndex = () => {
    const strip = stripRef.current
    if (!strip) return 0
    const first = strip.children[0] as HTMLElement
    let nearest = 0
    let distance = Infinity
    photos.forEach((_, index) => {
      const slide = strip.children[index] as HTMLElement
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
    moveTo(nearestIndex())
    snapTimerRef.current = window.setTimeout(() => {
      strip.style.scrollSnapType = ""
    }, reducedMotion ? 0 : 450)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return
    event.preventDefault()
    moveTo(event.key === "Home" ? 0 : event.key === "End" ? photos.length - 1 : nearestIndex() + (event.key === "ArrowRight" ? 1 : -1))
  }

  const onOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      window.clearTimeout(snapTimerRef.current)
      dragRef.current = null
    }
    setOpen(nextOpen)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children ? children(openPhoto) : <PersonalPhotosPreview onOpen={openPhoto} />}
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
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
          >
            {photos.map((photo, index) => (
              <figure className="personal-photos-slide" key={photo.id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${photos.length}`}>
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
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
