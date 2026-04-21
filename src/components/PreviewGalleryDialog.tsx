import { Dialog } from "@base-ui/react/dialog"
import { useSound } from "@web-kits/audio/react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react"

import type { PortfolioCard } from "../data/portfolio"
import { backSound, nextSound, openSound } from "../lib/sounds"

type PreviewGalleryDialogProps = {
  cards: PortfolioCard[]
  open: boolean
  selectedIndex: number
  prefersReducedMotion: boolean
  onOpenChange: (open: boolean) => void
  onSelectedIndexChange: (index: number) => void
}

type PreviewSwitchDirection = "up" | "down"
type PreviewSwitchPhase = "idle" | "out" | "in"

const previewSwitchExitMs = 190
const previewCloseResetMs = 240

function isVideoPreviewSource(source: string) {
  return source.toLowerCase().endsWith(".webm")
}

function wrapIndex(index: number, length: number) {
  if (length === 0) return 0
  return (index % length + length) % length
}

function getPreviewDescription(card: PortfolioCard) {
  if (card.detail) return card.detail
  if (card.summary) return card.summary

  if (card.title.includes("Matcha")) {
    return "A product interface exploration for Matcha, balancing dense trading information with calm hierarchy and fast decision-making."
  }

  if (card.title.includes("Protector")) {
    return "A protection-focused mobile product concept shaped around trust, quick comprehension, and confident action."
  }

  if (card.title.includes("Popparazi")) {
    return "A mobile social product exploration with an emphasis on visual rhythm, content density, and playful interaction."
  }

  return "A selected product design preview focused on clear hierarchy, responsive interaction, and polished interface craft."
}

function getPreviewProduct(card: PortfolioCard) {
  if (card.title.includes("Matcha")) return "Matcha - DEX Aggregator by 0x"
  if (card.title.includes("Protector")) return "Protector"
  if (card.title.includes("Popparazi")) return "Popparazi"
  return card.category
}

function getPreviewIndustry(card: PortfolioCard) {
  if (card.title.includes("Matcha")) return "DeFi / Web3 / Fintech"
  if (card.title.includes("Protector")) return "Consumer Safety"
  if (card.title.includes("Popparazi")) return "Consumer Social"
  return "Product Design"
}

function getPreviewLink(card: PortfolioCard) {
  if (card.ctaHref && card.ctaHref !== "#") return card.ctaHref
  if (card.title.includes("Matcha")) return "https://matcha.xyz"
  if (card.title.includes("Protector")) return "https://protector.so"
  return ""
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
  const prevOpenRef = useRef(open)
  const switchTimeoutRef = useRef<number | null>(null)
  const switchFrameRef = useRef<number | null>(null)
  const closeResetTimeoutRef = useRef<number | null>(null)
  const [switchPhase, setSwitchPhase] = useState<PreviewSwitchPhase>("idle")
  const [switchDirection, setSwitchDirection] = useState<PreviewSwitchDirection>("down")
  const safeIndex = useMemo(() => wrapIndex(selectedIndex, cards.length), [cards.length, selectedIndex])
  const activeCard = cards[safeIndex]
  const activeDescription = activeCard ? getPreviewDescription(activeCard) : ""
  const activeLink = activeCard ? getPreviewLink(activeCard) : ""
  const activeMetaRows = activeCard
    ? [
        ["Product", getPreviewProduct(activeCard)],
        ["Project", activeCard.title],
        ["Industry", getPreviewIndustry(activeCard)],
      ]
    : []

  const playOpen = useSound(openSound)
  const playNext = useSound(nextSound)
  const playBack = useSound(backSound)

  useEffect(() => {
    if (open && closeResetTimeoutRef.current !== null) {
      window.clearTimeout(closeResetTimeoutRef.current)
      closeResetTimeoutRef.current = null
    }
    if (open && !prevOpenRef.current) playOpen()
    prevOpenRef.current = open
  }, [open, playOpen])

  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current !== null) {
        window.clearTimeout(switchTimeoutRef.current)
      }
      if (switchFrameRef.current !== null) {
        window.cancelAnimationFrame(switchFrameRef.current)
      }
      if (closeResetTimeoutRef.current !== null) {
        window.clearTimeout(closeResetTimeoutRef.current)
      }
    }
  }, [])

  const cancelSwitchTransition = useCallback(() => {
    if (switchTimeoutRef.current !== null) {
      window.clearTimeout(switchTimeoutRef.current)
      switchTimeoutRef.current = null
    }
    if (switchFrameRef.current !== null) {
      window.cancelAnimationFrame(switchFrameRef.current)
      switchFrameRef.current = null
    }
  }, [])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        cancelSwitchTransition()
        if (closeResetTimeoutRef.current !== null) {
          window.clearTimeout(closeResetTimeoutRef.current)
        }
        closeResetTimeoutRef.current = window.setTimeout(() => {
          setSwitchPhase("idle")
          closeResetTimeoutRef.current = null
        }, previewCloseResetMs)
      }
      onOpenChange(nextOpen)
    },
    [cancelSwitchTransition, onOpenChange],
  )

  const moveBy = useCallback(
    (direction: number) => {
      if (cards.length <= 1) return
      if (switchPhase !== "idle") return

      if (direction > 0) playNext()
      else playBack()

      const nextIndex = wrapIndex(safeIndex + direction, cards.length)
      const nextDirection = direction < 0 ? "up" : "down"

      if (prefersReducedMotion) {
        onSelectedIndexChange(nextIndex)
        return
      }

      if (switchTimeoutRef.current !== null) {
        window.clearTimeout(switchTimeoutRef.current)
      }
      if (switchFrameRef.current !== null) {
        window.cancelAnimationFrame(switchFrameRef.current)
      }

      setSwitchDirection(nextDirection)
      setSwitchPhase("out")

      switchTimeoutRef.current = window.setTimeout(() => {
        onSelectedIndexChange(nextIndex)
        setSwitchPhase("in")

        switchFrameRef.current = window.requestAnimationFrame(() => {
          switchFrameRef.current = window.requestAnimationFrame(() => {
            setSwitchPhase("idle")
            switchFrameRef.current = null
          })
        })
        switchTimeoutRef.current = null
      }, previewSwitchExitMs)
    },
    [cards.length, onSelectedIndexChange, playBack, playNext, prefersReducedMotion, safeIndex, switchPhase],
  )

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault()
        moveBy(-1)
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault()
        moveBy(1)
      } else if (event.key === "Escape") {
        event.preventDefault()
        handleOpenChange(false)
      }
    }

    window.addEventListener("keydown", onKeyDown, { capture: true })
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true })
  }, [handleOpenChange, moveBy, open])

  if (!activeCard) return null

  const activeCardIsVideo = isVideoPreviewSource(activeCard.image)
  const mediaFrameStyle = activeCard.previewMediaPaddingBlock
    ? ({ "--preview-gallery-media-padding-block": activeCard.previewMediaPaddingBlock } as CSSProperties)
    : undefined
  const switchClassName =
    switchPhase === "idle" ? "" : ` preview-gallery-card-switch-${switchPhase}-${switchDirection}`

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="preview-gallery-backdrop" />

        <div
          className="preview-gallery-shell"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleOpenChange(false)
            }
          }}
        >
          <Dialog.Popup
            className="preview-gallery-popup"
            data-preview-media={activeCardIsVideo ? "video" : "image"}
            aria-label={`${activeCard.title} gallery preview`}
          >
            <article className={`preview-gallery-card${switchClassName}`}>
              <div
                className="preview-gallery-media-frame"
                style={mediaFrameStyle}
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
                {activeCardIsVideo ? (
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

              <div className="preview-gallery-content">
                <div className="preview-gallery-heading">
                  <div>
                    <Dialog.Title className="preview-gallery-title">{activeCard.title}</Dialog.Title>
                    <Dialog.Description className="preview-gallery-description">{activeDescription}</Dialog.Description>
                  </div>
                  <span className="preview-gallery-count">
                    {safeIndex + 1} / {cards.length}
                  </span>
                </div>

                <dl className="preview-gallery-details">
                  {activeMetaRows.map(([label, value]) => (
                    <div key={label} className="preview-gallery-detail-row">
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                  {activeLink ? (
                    <div className="preview-gallery-detail-row">
                      <dt>Link</dt>
                      <dd>
                        <a href={activeLink} target="_blank" rel="noreferrer">
                          {activeLink.replace(/^https?:\/\//, "")}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </article>

            <div className="preview-gallery-nav-stack">
              <button
                type="button"
                className="preview-gallery-nav preview-gallery-nav-prev"
                aria-label="Previous preview"
                aria-keyshortcuts="ArrowUp ArrowLeft"
                onClick={() => moveBy(-1)}
                disabled={cards.length <= 1}
              >
                <ChevronUp aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
              </button>

              <button
                type="button"
                className="preview-gallery-nav preview-gallery-nav-next"
                aria-label="Next preview"
                aria-keyshortcuts="ArrowDown ArrowRight"
                onClick={() => moveBy(1)}
                disabled={cards.length <= 1}
              >
                <ChevronDown aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
              </button>
            </div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
