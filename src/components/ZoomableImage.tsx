import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"
import type { PortfolioImage } from "../data/portfolio"

// Case-study screenshots are dense UI shown at half a reading column, so a
// press grows the picture out of its place to fill the screen. A native modal
// <dialog> sits in the top layer: it escapes the gallery card's transforms and
// clipping, and it makes the rest of the page inert without a second focus trap.
// The gallery's own key handler skips anything inside [data-image-zoom].

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

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
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const zoomedRef = useRef<HTMLImageElement>(null)
  const closing = useRef(false)

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
      easing: token(direction === "in" ? "--ease-smooth" : "--ease-standard") || "ease-out",
      fill: "both" as const,
    }
    const backdrop = dialog.animate(
      { backgroundColor: ["rgb(250 250 250 / 0)", "rgb(250 250 250 / 0.94)"] },
      { ...timing, direction: direction === "in" ? "normal" : "reverse" },
    )
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
    const zoomed = zoomedRef.current
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
        // On a phone the zoom is wider than the screen; start in its middle.
        dialog.scrollLeft = (dialog.scrollWidth - dialog.clientWidth) / 2
        dialog.scrollTop = Math.max(0, (dialog.scrollHeight - dialog.clientHeight) / 2)
        dialog.dataset.ready = "true"
        void animate("in")
      })
    return () => {
      cancelled = true
      dialog.removeEventListener("keydown", onKeyDown)
    }
  }, [animate, close, open])

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="zoomable-image"
        aria-label={`Enlarge: ${item.label}`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
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
      </button>
      {open ? (
        <dialog
          ref={dialogRef}
          className="image-zoom"
          data-image-zoom=""
          aria-label={item.label}
          style={{ "--zoom-natural-width": `${item.width}px` } as CSSProperties}
          onCancel={(event) => {
            event.preventDefault()
            close()
          }}
          onClick={close}
        >
          <figure>
            <img
              ref={zoomedRef}
              src={item.source}
              srcSet={srcSet}
              sizes={`(max-width: 699px) min(170vw, ${item.width}px), min(92vw, ${item.width}px)`}
              alt=""
              width={item.width}
              height={item.height}
              decoding="async"
            />
            <p aria-hidden="true">{item.label}</p>
          </figure>
          {/* showModal() focuses this, the dialog's only control. React's
              autoFocus would run first, while the dialog is still closed
              inside the scrolling card, and scroll the card to the top. */}
          <button type="button" className="image-zoom-close" onClick={close}>
            Close
          </button>
        </dialog>
      ) : null}
    </>
  )
}
