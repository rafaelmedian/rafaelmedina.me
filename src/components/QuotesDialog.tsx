import { Dialog } from "@base-ui/react/dialog"
import { ChevronLeft, ChevronRight, X } from "./NavigationIcons"
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react"

import { galleryMotionVars } from "../lib/galleryMotion"
import { useOriginTravel } from "../lib/originMotion"

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

type QuotesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  /** The quote card itself, at the dialog's size. */
  children: ReactNode
  /** The side arrows: a step back (-1) or forward (1) through the quotes. */
  onMove: (travel: number) => void
  /** The card the dialog grows out of and shrinks back into. */
  originRef: RefObject<HTMLElement | null>
}

/**
 * A quote card, opened. The tile grows into the same card at reading size --
 * same quote, credit and dots -- where each press turns to the next quote. It
 * wears the preview gallery's frame (backdrop, card, close button) and opens
 * the way the gallery's paper slides do: whole, out of the card that was
 * pressed, and back into it.
 */
export function QuotesDialog({ open, onOpenChange, title, children, onMove, originRef }: QuotesDialogProps) {
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const flagFlight = useCallback((flying: boolean) => {
    const shell = wrap?.parentElement
    if (flying) shell?.setAttribute("data-origin-animating", "true")
    else shell?.removeAttribute("data-origin-animating")
  }, [wrap])

  const { run } = useOriginTravel({
    node: wrap,
    getOrigin: () => originRef.current,
    enabled: !prefersReducedMotion,
    openDurationProperty: "--pg-open-ms",
    closeDurationProperty: "--pg-close-ms",
    onFlight: flagFlight,
    getFadeNode: () => popupRef.current,
    getZoomFrame: () => wrap?.parentElement ?? null,
    getZoomOutline: () => cardRef.current,
    getZoomWhole: () => cardRef.current,
    handoffDurationProperty: "--pg-zoom-handoff-ms",
    zoomOpenDurationProperty: "--pg-zoom-open-ms",
    zoomCloseDurationProperty: "--pg-zoom-close-ms",
  })

  useIsomorphicLayoutEffect(() => {
    if (open && wrap) run("open")
  }, [open, wrap, run])

  const handleOpenChange = (next: boolean) => {
    if (!next) run("close")
    onOpenChange(next)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="preview-gallery-backdrop" style={galleryMotionVars} />
        <div
          className="preview-gallery-shell"
          data-kind="quotes"
          style={galleryMotionVars}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) handleOpenChange(false)
          }}
        >
          <div className="preview-gallery-origin-wrap" ref={setWrap}>
            <Dialog.Popup
              className="preview-gallery-popup"
              ref={popupRef}
              // The quote card, so the arrows browse from the first frame.
              initialFocus={() => cardRef.current?.querySelector<HTMLElement>(".mosaic-quote") ?? cardRef.current}
              finalFocus={originRef}
              data-preview-kind="quotes"
              data-origin-motion={prefersReducedMotion ? undefined : "true"}
            >
              <div className="preview-gallery-toolbar">
                <Dialog.Close className="preview-gallery-nav preview-gallery-close" aria-label="Close quotes">
                  <X aria-hidden="true" className="preview-gallery-nav-icon" />
                </Dialog.Close>
              </div>
              <article className="preview-gallery-card quotes-gallery-card" ref={cardRef} tabIndex={-1}>
                <Dialog.Title className="sr-only">{title}</Dialog.Title>
                {children}
              </article>
              {/* The gallery's side arrows, beside the card's middle. */}
              <div className="preview-gallery-rail" role="group" aria-label="Quote navigation">
                <button type="button" className="preview-gallery-nav preview-gallery-nav-prev" aria-label="Previous quote" onClick={() => onMove(-1)}>
                  <ChevronLeft aria-hidden="true" className="preview-gallery-nav-icon preview-gallery-nav-icon-prev" />
                </button>
                <button type="button" className="preview-gallery-nav preview-gallery-nav-next" aria-label="Next quote" onClick={() => onMove(1)}>
                  <ChevronRight aria-hidden="true" className="preview-gallery-nav-icon preview-gallery-nav-icon-next" />
                </button>
              </div>
            </Dialog.Popup>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
