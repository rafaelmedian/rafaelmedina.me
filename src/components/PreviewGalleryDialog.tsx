import { Dialog } from "@base-ui/react/dialog"
import { useCallback, useEffect, useMemo, useRef } from "react"

import type { PortfolioCard } from "../data/portfolio"

type PreviewGalleryDialogProps = {
  cards: PortfolioCard[]
  open: boolean
  selectedIndex: number
  prefersReducedMotion: boolean
  onOpenChange: (open: boolean) => void
  onSelectedIndexChange: (index: number) => void
}

function isVideoPreviewSource(source: string) {
  return source.toLowerCase().endsWith(".webm")
}

function wrapIndex(index: number, length: number) {
  if (length === 0) return 0
  return (index % length + length) % length
}

export function PreviewGalleryDialog({
  cards,
  open,
  selectedIndex,
  prefersReducedMotion,
  onOpenChange,
  onSelectedIndexChange,
}: PreviewGalleryDialogProps) {
  const touchStartXRef = useRef<number | null>(null)
  const safeIndex = useMemo(() => wrapIndex(selectedIndex, cards.length), [cards.length, selectedIndex])
  const activeCard = cards[safeIndex]

  const moveBy = useCallback(
    (direction: number) => {
      if (cards.length <= 1) return
      onSelectedIndexChange(wrapIndex(safeIndex + direction, cards.length))
    },
    [cards.length, onSelectedIndexChange, safeIndex],
  )

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        moveBy(-1)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        moveBy(1)
      } else if (event.key === "Escape") {
        event.preventDefault()
        onOpenChange(false)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [moveBy, onOpenChange, open])

  if (!activeCard) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="preview-gallery-backdrop" />

        <div className="preview-gallery-shell">
          <Dialog.Popup className="preview-gallery-popup" aria-label={`${activeCard.title} gallery preview`}>
            <Dialog.Close className="preview-gallery-close" aria-label="Close gallery">
              <span aria-hidden="true">x</span>
            </Dialog.Close>

            <div
              className="preview-gallery-media-frame"
              onTouchStart={(event) => {
                touchStartXRef.current = event.changedTouches[0]?.clientX ?? null
              }}
              onTouchEnd={(event) => {
                const touchStartX = touchStartXRef.current
                if (touchStartX == null) return

                const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX
                const delta = touchEndX - touchStartX
                const threshold = 56

                if (Math.abs(delta) >= threshold) {
                  moveBy(delta > 0 ? -1 : 1)
                }

                touchStartXRef.current = null
              }}
            >
              {isVideoPreviewSource(activeCard.image) ? (
                <video
                  src={activeCard.image}
                  muted
                  loop={!prefersReducedMotion}
                  autoPlay={!prefersReducedMotion}
                  playsInline
                  preload={prefersReducedMotion ? "none" : "metadata"}
                  controls
                  aria-label={activeCard.title}
                  className="preview-gallery-media"
                />
              ) : (
                <img src={activeCard.image} alt={activeCard.title} className="preview-gallery-media" loading="eager" decoding="async" />
              )}
            </div>

            <div className="preview-gallery-meta">
              <p>{activeCard.title}</p>
              <span>
                {safeIndex + 1} / {cards.length}
              </span>
            </div>

            <button
              type="button"
              className="preview-gallery-nav preview-gallery-nav-prev"
              aria-label="Previous preview"
              onClick={() => moveBy(-1)}
              disabled={cards.length <= 1}
            >
              <span aria-hidden="true">&lt;</span>
            </button>

            <button
              type="button"
              className="preview-gallery-nav preview-gallery-nav-next"
              aria-label="Next preview"
              onClick={() => moveBy(1)}
              disabled={cards.length <= 1}
            >
              <span aria-hidden="true">&gt;</span>
            </button>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
