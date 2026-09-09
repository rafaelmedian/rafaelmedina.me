import { Dialog } from "@base-ui/react/dialog"
import { useSound } from "@web-kits/audio/react"
import { ChevronRight, ChevronLeft, X } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react"

import { collaborators, type Collaborator, type PortfolioCard } from "../data/portfolio"
import { isVideoSource } from "../lib/media"
import { cssTimeToMilliseconds } from "../lib/cssTime"
import { originCloseEasePoints, originOpenEasePoints, toCssEasing, useOriginTravel } from "../lib/originMotion"
import { PreviewMedia } from "./PreviewMedia"
import { backSound, nextSound, openSound } from "../lib/sounds"

type PreviewGalleryDialogProps = {
  cards: PortfolioCard[]
  open: boolean
  selectedIndex: number
  prefersReducedMotion: boolean
  onOpenChange: (open: boolean) => void
  onSelectedIndexChange: (index: number) => void
  getOriginRect?: (index: number) => DOMRect | null
}

type PreviewSwitchDirection = "prev" | "next"
type PreviewSwitchPhase = "idle" | "out" | "in"

const previewCloseResetMs = 260
const largeDesktopPreviewQuery = "(min-width: 1320px)"

function shouldOpenPreviewWide() {
  return typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(largeDesktopPreviewQuery).matches
}

// Origin-aware open/close: the popup travels from (and back to) the card that
// was clicked, so the modal reads as that card growing into place. The geometry
// and the curves are shared with the writings sheet in lib/originMotion;
// everything below is this gallery's own timing.

const galleryMotionVars = {
  "--pg-open-ms": "var(--duration-base)",
  "--pg-close-ms": "var(--duration-quick)",
  "--pg-open-ease": toCssEasing(originOpenEasePoints),
  "--pg-close-ease": toCssEasing(originCloseEasePoints),
  "--pg-content-in-ms": "var(--duration-base)",
  "--pg-content-out-ms": "var(--duration-quick)",
  "--pg-backdrop-in-ms": "var(--duration-base)",
  "--pg-backdrop-out-ms": "var(--duration-quick)",
  "--pg-switch-ms": "var(--duration-base)",
} as CSSProperties

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

function wrapIndex(index: number, length: number) {
  if (length === 0) return 0
  return (index % length + length) % length
}

function getPreviewDescription(card: PortfolioCard) {
  return card.detail || card.summary
}

function getPreviewCollaborators(card: PortfolioCard): Collaborator[] {
  // Credited on every project, with or without company: a shot with no names
  // under it reads as unattributed rather than as solo work.
  return [collaborators.rafael, ...(card.team ?? [])]
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
}

export function PreviewGalleryDialog({
  cards,
  open,
  selectedIndex,
  prefersReducedMotion,
  onOpenChange,
  onSelectedIndexChange,
  getOriginRect,
}: PreviewGalleryDialogProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const prevOpenRef = useRef(open)
  const switchTimeoutRef = useRef<number | null>(null)
  const switchFrameRef = useRef<number | null>(null)
  const closeResetTimeoutRef = useRef<number | null>(null)
  const originWrapRef = useRef<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  // The portal mounts its contents in a later commit than the one that flips
  // `open`, so the open animation keys off the node arriving, not off `open`.
  const [originWrapNode, setOriginWrapNode] = useState<HTMLDivElement | null>(null)
  const [switchPhase, setSwitchPhase] = useState<PreviewSwitchPhase>("idle")
  const [switchDirection, setSwitchDirection] = useState<PreviewSwitchDirection>("next")
  const [isWide, setIsWide] = useState(shouldOpenPreviewWide)
  const safeIndex = useMemo(() => wrapIndex(selectedIndex, cards.length), [cards.length, selectedIndex])
  const activeCard = cards[safeIndex]
  const activeMediaSource = activeCard?.image ?? ""
  const activeDescription = activeCard ? getPreviewDescription(activeCard) : ""
  const activeCollaborators = activeCard ? getPreviewCollaborators(activeCard) : []

  const playOpen = useSound(openSound, { volume: 0.3 })
  const playNext = useSound(nextSound, { volume: 0.26 })
  const playBack = useSound(backSound, { volume: 0.26 })

  // Large desktop previews use the available canvas immediately. Set this in
  // a layout effect so the portal reaches its opening-animation measurement in
  // the intended mode, while smaller viewports retain the compact default.
  useIsomorphicLayoutEffect(() => {
    if (!open || prevOpenRef.current) return
    setIsWide(shouldOpenPreviewWide())
  }, [open])

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

  // Browser history can close this controlled dialog without going through
  // handleOpenChange. Cancel any delayed selection before it can write a
  // project back into the URL, and leave the next open in an idle phase.
  useIsomorphicLayoutEffect(() => {
    if (open) return
    cancelSwitchTransition()
    setSwitchPhase("idle")
  }, [cancelSwitchTransition, open])

  // The translated surface can overflow its scroll containers and flash a
  // scrollbar mid-flight. One flag on the shell gates that clipping and the
  // compositing hint, and it must come off however the flight ends.
  const flagOriginAnimating = useCallback((flying: boolean) => {
    const shell = originWrapRef.current?.parentElement
    if (flying) shell?.setAttribute("data-origin-animating", "true")
    else shell?.removeAttribute("data-origin-animating")
  }, [])

  const originMotionEnabled = !prefersReducedMotion && Boolean(getOriginRect)

  // Declared before the open effect below, so a click that changes the index and
  // opens in the same commit animates from the new card: the hook latches these
  // inputs in a layout effect of its own.
  const { run: runOriginAnimation } = useOriginTravel({
    node: originWrapNode,
    getOriginRect: () => getOriginRect?.(safeIndex) ?? null,
    enabled: originMotionEnabled,
    openDurationProperty: "--pg-open-ms",
    closeDurationProperty: "--pg-close-ms",
    onFlight: flagOriginAnimating,
  })

  const attachOriginWrap = useCallback((node: HTMLDivElement | null) => {
    originWrapRef.current = node
    setOriginWrapNode(node)
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (!open || !originWrapNode) return
    runOriginAnimation("open")
  }, [open, originWrapNode, runOriginAnimation])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        runOriginAnimation("close")
        cancelSwitchTransition()
        if (closeResetTimeoutRef.current !== null) {
          window.clearTimeout(closeResetTimeoutRef.current)
        }
        closeResetTimeoutRef.current = window.setTimeout(() => {
          setSwitchPhase("idle")
          setIsWide(false)
          closeResetTimeoutRef.current = null
        }, previewCloseResetMs)
      }
      onOpenChange(nextOpen)
    },
    [cancelSwitchTransition, onOpenChange, runOriginAnimation],
  )

  const moveBy = useCallback(
    (direction: number) => {
      if (cards.length <= 1) return
      if (direction === 0) return
      if (switchPhase !== "idle") return

      if (direction > 0) playNext()
      else playBack()

      const nextIndex = wrapIndex(safeIndex + direction, cards.length)
      const nextDirection = direction < 0 ? "prev" : "next"

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

      // The exact property the card's transition reads, not the token behind
      // it: this timer steps that transition, so the two cannot resolve
      // differently. `--pg-switch-ms` only lives on the shell, so the fallback
      // mirrors the one the stylesheet already carries.
      const switchStyles = getComputedStyle(popupRef.current ?? document.documentElement)
      const switchMs = cssTimeToMilliseconds(
        switchStyles.getPropertyValue("--pg-switch-ms") || switchStyles.getPropertyValue("--duration-base"),
      )
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
      }, switchMs)
    },
    [cards.length, onSelectedIndexChange, playBack, playNext, prefersReducedMotion, safeIndex, switchPhase],
  )

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      // Arrow keys belong to the focused control first -- seeking a video,
      // moving a caret -- and only fall through to gallery paging otherwise.
      // Escape still closes from anywhere.
      const target = event.target
      const typingOrScrubbing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "VIDEO", "AUDIO"].includes(target.tagName))
      if (typingOrScrubbing && event.key !== "Escape") return

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

  const activeMediaIsVideo = isVideoSource(activeMediaSource)
  const mediaFrameStyle = activeCard.previewMediaPadding
    ? ({ "--preview-gallery-media-padding": activeCard.previewMediaPadding } as CSSProperties)
    : undefined
  const switchClassName =
    switchPhase === "idle" ? "" : ` preview-gallery-card-switch-${switchPhase}-${switchDirection}`

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="preview-gallery-backdrop" style={galleryMotionVars} />

        <div
          className="preview-gallery-shell"
          data-wide={isWide ? "true" : undefined}
          style={galleryMotionVars}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleOpenChange(false)
            }
          }}
        >
          <div
            className="preview-gallery-origin-wrap"
            data-wide={isWide ? "true" : undefined}
            ref={attachOriginWrap}
          >
            <Dialog.Popup
              className="preview-gallery-popup"
              ref={popupRef}
              initialFocus={popupRef}
              data-preview-media={activeMediaIsVideo ? "video" : "image"}
              data-preview-crop={activeCard.previewCropped ? "true" : undefined}
              // Mirrors `mosaic-row-card-${id}` on the tile: a hook for the one
              // artwork whose framing the shared rules get wrong.
              data-preview-id={activeCard.id}
              data-origin-motion={originMotionEnabled ? "true" : undefined}
              data-wide={isWide ? "true" : undefined}
              // No aria-label here: it would override the aria-labelledby Base UI
              // wires to <Dialog.Title> below, and the title is the better name.
            >
              {/* Swipe is handled on the whole card, not just the media: on
                  phones the media is capped at 32vh, so the text below it is
                  most of the surface a thumb actually lands on. */}
              <article
                className={`preview-gallery-card${switchClassName}`}
                onTouchStart={(event) => {
                  // A horizontal drag on the video is the seek bar, not a swipe.
                  if (event.target instanceof Element && event.target.closest("video")) {
                    touchStartRef.current = null
                    return
                  }
                  const touch = event.changedTouches[0]
                  touchStartRef.current = touch ? { x: touch.clientX, y: touch.clientY } : null
                }}
                onTouchEnd={(event) => {
                  const touchStart = touchStartRef.current
                  touchStartRef.current = null
                  if (!touchStart) return

                  const touchEnd = event.changedTouches[0]
                  const deltaX = (touchEnd?.clientX ?? touchStart.x) - touchStart.x
                  const deltaY = (touchEnd?.clientY ?? touchStart.y) - touchStart.y
                  const threshold = 56

                  if (Math.abs(deltaX) >= threshold && Math.abs(deltaX) > Math.abs(deltaY)) {
                    moveBy(deltaX > 0 ? -1 : 1)
                  }
                }}
                onTouchCancel={() => {
                  touchStartRef.current = null
                }}
              >
                <div className="preview-gallery-card-inner">
                  <div className="preview-gallery-toolbar">
                    <span className="preview-gallery-count">
                      {safeIndex + 1} / {cards.length}
                    </span>

                    <div className="preview-gallery-controls" role="group" aria-label="Preview controls">
                      <button
                        type="button"
                        className="preview-gallery-nav preview-gallery-nav-prev"
                        aria-label="Previous preview"
                        aria-keyshortcuts="ArrowUp ArrowLeft"
                        onClick={() => moveBy(-1)}
                        disabled={cards.length <= 1}
                      >
                        <ChevronLeft aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon preview-gallery-nav-icon-prev" />
                      </button>

                      <button
                        type="button"
                        className="preview-gallery-nav preview-gallery-nav-next"
                        aria-label="Next preview"
                        aria-keyshortcuts="ArrowDown ArrowRight"
                        onClick={() => moveBy(1)}
                        disabled={cards.length <= 1}
                      >
                        <ChevronRight aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon preview-gallery-nav-icon-next" />
                      </button>

                      <Dialog.Close className="preview-gallery-nav preview-gallery-close" aria-label="Close preview">
                        <X aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
                      </Dialog.Close>
                    </div>
                  </div>

                  <div className="preview-gallery-media-frame" style={mediaFrameStyle}>
                    <PreviewMedia key={activeMediaSource} card={activeCard} reducedMotion={prefersReducedMotion} />
                  </div>

                  <div className="preview-gallery-content">
                    <Dialog.Title className="preview-gallery-title">{activeCard.title}</Dialog.Title>
                    <Dialog.Description className="preview-gallery-description">{activeDescription}</Dialog.Description>
                    {activeCollaborators.length > 0 ? (
                      <div className="preview-gallery-team">
                        <ul className="preview-gallery-people" aria-label="Collaborators">
                          {activeCollaborators.map((person) => (
                            <li key={person.href}>
                              <a
                                className="preview-gallery-person"
                                href={person.href}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {person.photo ? (
                                  <img
                                    className="preview-gallery-person-avatar"
                                    src={person.photo}
                                    alt=""
                                    width={22}
                                    height={22}
                                    loading="lazy"
                                    decoding="async"
                                  />
                                ) : (
                                  <span className="preview-gallery-person-avatar" aria-hidden="true">
                                    {getInitials(person.name)}
                                  </span>
                                )}
                                <span className="preview-gallery-person-name">{person.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>

              <div className="preview-gallery-rail" role="group" aria-label="Preview navigation">
                <button
                  type="button"
                  className="preview-gallery-nav preview-gallery-nav-prev"
                  aria-label="Previous preview"
                  aria-keyshortcuts="ArrowUp ArrowLeft"
                  onClick={() => moveBy(-1)}
                  disabled={cards.length <= 1}
                >
                  <ChevronLeft aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon preview-gallery-nav-icon-prev" />
                </button>

                <button
                  type="button"
                  className="preview-gallery-nav preview-gallery-nav-next"
                  aria-label="Next preview"
                  aria-keyshortcuts="ArrowDown ArrowRight"
                  onClick={() => moveBy(1)}
                  disabled={cards.length <= 1}
                >
                  <ChevronRight aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon preview-gallery-nav-icon-next" />
                </button>
              </div>
            </Dialog.Popup>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
