import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import type { PortfolioImage } from "../data/portfolio"
import { useFinePointer } from "../lib/useFinePointer"
import { X } from "./NavigationIcons"

// Case-study screenshots are dense UI shown at half a reading column, so a
// press grows the picture out of its place into a framed view over the
// blurred gallery. A native modal <dialog> sits in the top layer: it escapes
// the gallery card's transforms and clipping, and it makes the rest of the
// page inert without a second focus trap. The gallery's own key handler skips
// anything inside [data-image-zoom].
//
// Only where there is a mouse or trackpad. On a phone the zoom ran wider than
// the screen and had to be panned, which did nothing a pinch does not do
// better, so a touch screen gets the picture alone and the browser's own zoom.
//
// It used to fill the screen over a 94% white wash on an expo-out, which read
// as the page being swapped for the picture in one jump. Now the gallery stays
// in view, blurred, around a bounded frame, and the grow runs on the gallery's
// own open curve, which spends its time where the size change is visible.

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Prototypes that exist as a loop play over their still, but only once the
 * still has scrolled near the reader inside an open case study. The video is
 * never fetched for a project nobody opened, or for someone who asked for
 * reduced motion. It pauses off-screen and stays mounted after the first load,
 * so scrolling back resumes it rather than fetching it again. */
function useLoopInView(element: HTMLElement | null, enabled: boolean) {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!enabled || !element || prefersReducedMotion() || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting)
      if (entry.isIntersecting) setMounted(true)
    }, { rootMargin: "200px 0px" })
    observer.observe(element)
    return () => observer.disconnect()
  }, [enabled, element])
  return { mounted, visible }
}

function LoopVideo({ source, poster, playing }: { source: string; poster: string; playing: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (playing) void video.play().catch(() => {})
    else video.pause()
  }, [playing])
  return (
    <video
      ref={ref}
      className="loop-video"
      src={source}
      poster={poster}
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      data-started={started || undefined}
      onPlaying={() => setStarted(true)}
    />
  )
}

/** The transform that lays `to` exactly over `from`. */
function flipTransform(from: DOMRect, to: DOMRect) {
  const scale = from.width / to.width
  const x = from.left + from.width / 2 - (to.left + to.width / 2)
  const y = from.top + from.height / 2 - (to.top + to.height / 2)
  return `translate(${x}px, ${y}px) scale(${scale})`
}

export function ZoomableImage({ item, srcSet, sizes }: {
  item: PortfolioImage
  srcSet?: string
  sizes?: string
}) {
  const [open, setOpen] = useState(false)
  const finePointer = useFinePointer()
  const triggerRef = useRef<HTMLElement | null>(null)
  // Held as state too: the trigger is a picture until hydration finds a fine
  // pointer and then a button, and the loop's observer has to follow it there.
  const [trigger, setTrigger] = useState<HTMLElement | null>(null)
  const bindTrigger = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
    setTrigger(node)
  }, [])
  const dialogRef = useRef<HTMLDialogElement>(null)
  const zoomedRef = useRef<HTMLDivElement>(null)
  const zoomedImageRef = useRef<HTMLImageElement>(null)
  const closing = useRef(false)
  const loop = useLoopInView(trigger, Boolean(item.video))

  const animate = useCallback((direction: "in" | "out") => {
    const dialog = dialogRef.current
    const thumb = triggerRef.current?.querySelector("img")
    const zoomed = zoomedRef.current
    if (!dialog || !thumb || !zoomed) return Promise.resolve()
    const reduced = prefersReducedMotion()
    const tokens = getComputedStyle(document.documentElement)
    const token = (name: string) => tokens.getPropertyValue(name).trim()
    const timing = {
      duration: Number.parseFloat(token(reduced ? "--duration-quick" : direction === "in" ? "--duration-slow" : "--duration-base")) || 200,
      // The gallery's open curve, read off the card the picture sits in rather
      // than imported: this component ships in the main chunk with the
      // standalone project page, and the gallery's motion module does not.
      easing: (direction === "in" && getComputedStyle(thumb).getPropertyValue("--pg-open-ease").trim())
        || token(direction === "in" ? "--ease-smooth" : "--ease-standard") || "ease-out",
      fill: "both" as const,
    }
    // Opacity on the blurred scrim, never the blur itself: ramping a
    // backdrop-filter re-blurs the whole viewport every frame.
    const scrim = dialog.querySelector(".image-zoom-scrim")
    const backdrop = scrim?.animate({ opacity: [0, 1] }, { ...timing, direction: direction === "in" ? "normal" : "reverse" })
      ?? dialog.animate({ opacity: [1, 1] }, timing)
    const caption = dialog.querySelector("p")
    caption?.animate({ opacity: [0, 1] }, { ...timing, direction: direction === "in" ? "normal" : "reverse" })
    if (reduced) {
      zoomed.animate({ opacity: [0, 1] }, { ...timing, direction: direction === "in" ? "normal" : "reverse" })
      return backdrop.finished.catch(() => {})
    }
    const from = flipTransform(thumb.getBoundingClientRect(), zoomed.getBoundingClientRect())
    const radius = getComputedStyle(thumb).borderRadius
    const frames = [
      { transform: from, borderRadius: radius },
      { transform: "none", borderRadius: getComputedStyle(zoomed).borderRadius },
    ]
    const image = zoomed.animate(direction === "in" ? frames : frames.reverse(), timing)
    return Promise.all([image.finished, backdrop.finished]).then(() => {}, () => {})
  }, [])

  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    void animate("out").then(() => {
      dialogRef.current?.close()
      closing.current = false
      setOpen(false)
      triggerRef.current?.focus({ preventScroll: true })
    })
  }, [animate])

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    const zoomed = zoomedImageRef.current
    if (!dialog || !zoomed) return
    dialog.showModal()
    // Escape belongs to the zoom alone. Stopped here, before it bubbles to the
    // document where the gallery dialog would take it as its own dismissal.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.preventDefault()
      event.stopPropagation()
      close()
    }
    dialog.addEventListener("keydown", onKeyDown)
    // Hold the frame until the larger picture can paint, so the grow never
    // starts from an empty box. A slow network still opens within a beat.
    let cancelled = false
    void Promise.race([zoomed.decode().catch(() => {}), new Promise((resolve) => setTimeout(resolve, 250))])
      .then(() => {
        if (cancelled) return
        dialog.dataset.ready = "true"
        void animate("in")
      })
    return () => {
      cancelled = true
      dialog.removeEventListener("keydown", onKeyDown)
    }
  }, [animate, close, open])

  const still = (
    <img
      src={item.source}
      srcSet={srcSet}
      sizes={sizes}
      alt={item.label}
      width={item.width}
      height={item.height}
      loading="lazy"
      decoding="async"
    />
  )
  const loopVideo = item.video && loop.mounted
    ? <LoopVideo source={item.video} poster={item.source} playing={loop.visible && !open} />
    : null

  if (!finePointer) {
    return (
      <div ref={bindTrigger} className="zoomable-image">
        {still}
        {loopVideo}
      </div>
    )
  }

  return (
    <>
      <button
        ref={bindTrigger}
        type="button"
        className="zoomable-image"
        aria-label={`Enlarge: ${item.label}`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {still}
        {loopVideo}
      </button>
      {open ? (
        <dialog
          ref={dialogRef}
          className="image-zoom"
          data-image-zoom=""
          aria-label={item.label}
          style={{ "--zoom-natural-width": `${item.width}px`, "--zoom-ratio": item.width / item.height } as CSSProperties}
          onCancel={(event) => {
            event.preventDefault()
            close()
          }}
          onClick={close}
        >
          <div className="image-zoom-scrim" aria-hidden="true" />
          <figure>
            <div ref={zoomedRef} className="image-zoom-media">
            <img
              ref={zoomedImageRef}
              src={item.source}
              srcSet={srcSet}
              sizes={`min(84vw, 76rem, ${item.width}px)`}
              alt=""
              width={item.width}
              height={item.height}
              decoding="async"
            />
            {item.video && loop.mounted ? <LoopVideo source={item.video} poster={item.source} playing /> : null}
            </div>
            <p aria-hidden="true">{item.label}</p>
          </figure>
          {/* showModal() focuses this, the dialog's only control. React's
              autoFocus would run first, while the dialog is still closed
              inside the scrolling card, and scroll the card to the top. */}
          <button type="button" className="preview-gallery-nav image-zoom-close" aria-label="Close" onClick={close}>
            <X aria-hidden="true" className="preview-gallery-nav-icon" />
          </button>
        </dialog>
      ) : null}
    </>
  )
}
