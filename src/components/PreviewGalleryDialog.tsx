import { Dialog } from "@base-ui/react/dialog"
import { useSound } from "@web-kits/audio/react"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Maximize2, Minimize2, X } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react"

import { collaborators, type Collaborator, type PortfolioCard } from "../data/portfolio"
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

type PreviewSwitchDirection = "up" | "down"
type PreviewSwitchPhase = "idle" | "out" | "in"

const previewSwitchExitMs = 190
const previewCloseResetMs = 260

// Origin-aware open/close: the popup travels from (and back to) the card that
// was clicked, so the modal reads as that card growing into place. Every
// duration and curve it uses lives in this block, including the ones only the
// stylesheet needs — those are handed to CSS as custom properties below, so the
// JS and CSS halves of the animation cannot drift apart.

// The open is deliberately not an expo-out. A quintic curve is 97% done in its
// first third, which for a surface growing out of a card means the growth is
// over before the eye catches it and the rest of the duration is dead air. This
// one spends its time where the size change is actually visible, then settles.
const openEasePoints = [0.32, 0.8, 0.32, 1] as const
const closeEasePoints = [0.4, 0, 1, 1] as const
const toCssEasing = (points: readonly number[]) => `cubic-bezier(${points.join(", ")})`

const galleryMotion = {
  openMs: 200,
  closeMs: 150,
  openEase: toCssEasing(openEasePoints),
  closeEase: toCssEasing(closeEasePoints),
  contentInMs: 140,
  contentOutMs: 120,
  backdropInMs: 180,
  backdropOutMs: 150,
  switchMs: previewSwitchExitMs,
}

const galleryMotionVars = {
  "--pg-open-ms": `${galleryMotion.openMs}ms`,
  "--pg-close-ms": `${galleryMotion.closeMs}ms`,
  "--pg-open-ease": galleryMotion.openEase,
  "--pg-close-ease": galleryMotion.closeEase,
  "--pg-content-in-ms": `${galleryMotion.contentInMs}ms`,
  "--pg-content-out-ms": `${galleryMotion.contentOutMs}ms`,
  "--pg-backdrop-in-ms": `${galleryMotion.backdropInMs}ms`,
  "--pg-backdrop-out-ms": `${galleryMotion.backdropOutMs}ms`,
  "--pg-switch-ms": `${galleryMotion.switchMs}ms`,
} as CSSProperties

// Not a full flight from the card to the centre. Replaying the whole distance
// reads as a journey — the modal has to cross the page, so it needs a long
// duration to not feel thrown, and the wait is worse than the payoff. Instead
// the travel is capped: enough to say "from over there" as the surface settles,
// then it is out of the way. The direction survives the cap, the distance does
// not.
const originMaxTravel = 44
const originScaleMin = 0.92
const originScaleMax = 1
// Used when the anchor card is off-screen: a plain 20px lift, no travel.
const originFallback = { dx: 0, dy: 20, scale: 0.96 }

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

function getOriginOffset(originRect: DOMRect, targetRect: DOMRect) {
  if (targetRect.width <= 0 || targetRect.height <= 0) return null
  if (originRect.width <= 0 || originRect.height <= 0) return null

  // Clamped rather than a strict FLIP: the point is to hint at the origin, not
  // to replay the geometry exactly.
  const scale = Math.min(Math.max(originRect.width / targetRect.width, originScaleMin), originScaleMax)
  const dx = originRect.left + originRect.width / 2 - (targetRect.left + targetRect.width / 2)
  const dy = originRect.top + originRect.height / 2 - (targetRect.top + targetRect.height / 2)

  // Keep the bearing, drop the distance: a card in the far corner and one just
  // below the fold should both nudge in by the same amount, differing only in
  // which way they come from.
  const distance = Math.hypot(dx, dy)
  const cap = distance > originMaxTravel ? originMaxTravel / distance : 1

  return { dx: dx * cap, dy: dy * cap, scale }
}

// cubic-bezier(x1, y1, x2, y2) evaluated as a progress function.
function cubicBezierEasing([x1, y1, x2, y2]: readonly number[]) {
  const axis = (a: number, b: number, t: number) =>
    3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t

  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1

    let low = 0
    let high = 1
    let t = x
    // Bisection: 24 rounds is far inside a sub-pixel and costs nothing at the
    // ~50 samples we take per open.
    for (let round = 0; round < 24; round += 1) {
      if (axis(x1, x2, t) < x) low = t
      else high = t
      t = (low + high) / 2
    }
    return axis(y1, y2, t)
  }
}

const easeOpen = cubicBezierEasing(openEasePoints)
const easeClose = cubicBezierEasing(closeEasePoints)

// Enough samples that the linear interpolation between them is invisible at
// 120Hz over the longest of these animations.
const originSampleCount = 48

// The wrapper scales the surface by `s` and the inner layer has to undo it with
// `1/s`. Easing those two independently does NOT cancel — lerp(s, 1) times
// lerp(1/s, 1) peaks around 20% off at the midpoint, which shows up as the copy
// visibly breathing. So the easing is baked into sampled keyframes here and both
// animations run `linear`, which keeps them exact reciprocals at every offset.
function buildOriginKeyframes(
  mode: "open" | "close",
  offset: { dx: number; dy: number; scale: number },
) {
  const ease = mode === "open" ? easeOpen : easeClose
  const wrap: Keyframe[] = []
  const inner: Keyframe[] = []

  for (let step = 0; step < originSampleCount; step += 1) {
    const time = step / (originSampleCount - 1)
    // `travel` is 0 at the origin card and 1 at the modal's resting place.
    const eased = ease(time)
    const travel = mode === "open" ? eased : 1 - eased
    const scale = offset.scale + (1 - offset.scale) * travel
    const dx = offset.dx * (1 - travel)
    const dy = offset.dy * (1 - travel)

    wrap.push({
      offset: time,
      easing: "linear",
      transform: `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale.toFixed(5)})`,
    })
    inner.push({
      offset: time,
      easing: "linear",
      transform: `scale(${(1 / scale).toFixed(5)})`,
    })
  }

  return { wrap, inner }
}

function isVideoPreviewSource(source: string) {
  return source.toLowerCase().endsWith(".webm")
}

function wrapIndex(index: number, length: number) {
  if (length === 0) return 0
  return (index % length + length) % length
}

function getPreviewDescription(card: PortfolioCard) {
  return card.detail || card.summary
}

function getPreviewCollaborators(card: PortfolioCard): Collaborator[] {
  const teammates = card.team ?? []
  // Credit myself alongside anyone I worked with; solo shots keep the Team row hidden.
  return teammates.length > 0 ? [collaborators.rafael, ...teammates] : []
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
}

function getPreviewLink(card: PortfolioCard) {
  return card.ctaHref && card.ctaHref !== "#" ? card.ctaHref : ""
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
  const cardInnerRef = useRef<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const originAnimationsRef = useRef<Animation[]>([])
  // The portal mounts its contents in a later commit than the one that flips
  // `open`, so the open animation keys off the node arriving, not off `open`.
  const [originWrapNode, setOriginWrapNode] = useState<HTMLDivElement | null>(null)
  const [switchPhase, setSwitchPhase] = useState<PreviewSwitchPhase>("idle")
  const [switchDirection, setSwitchDirection] = useState<PreviewSwitchDirection>("down")
  const [isWide, setIsWide] = useState(false)
  const safeIndex = useMemo(() => wrapIndex(selectedIndex, cards.length), [cards.length, selectedIndex])
  const activeCard = cards[safeIndex]
  const activeMediaSource = activeCard?.image ?? ""
  const activeDescription = activeCard ? getPreviewDescription(activeCard) : ""
  const activeLink = activeCard ? getPreviewLink(activeCard) : ""
  const activeCollaborators = activeCard ? getPreviewCollaborators(activeCard) : []
  const activeMetaRows = activeCard
    ? [
        // No "Project" row — the dialog title directly above already says it.
        ["Product", activeCard.product ?? activeCard.category],
        ["Industry", activeCard.industry ?? "Product Design"],
      ]
    : []

  const playOpen = useSound(openSound, { volume: 0.3 })
  const playNext = useSound(nextSound, { volume: 0.26 })
  const playBack = useSound(backSound, { volume: 0.26 })

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

  // Read through a ref so the animation callback stays stable: it must not be
  // re-created (and re-fire the open effect) when the selected index changes.
  const originInputsRef = useRef({ getOriginRect, prefersReducedMotion, safeIndex })

  // Layout effect, and declared before the open effect below, so a click that
  // changes the index and opens in the same commit animates from the new card.
  useIsomorphicLayoutEffect(() => {
    originInputsRef.current = { getOriginRect, prefersReducedMotion, safeIndex }
  }, [getOriginRect, prefersReducedMotion, safeIndex])

  // A translated (and counter-scaled) child overflows its scroll containers,
  // which would flash a scrollbar mid-flight, and the rail would ride the scale
  // down to a speck. One flag on the shell gates both, plus the compositing
  // hints, and it must come off however the animation ends.
  const clearOriginAnimatingFlag = useCallback(() => {
    originWrapRef.current?.parentElement?.removeAttribute("data-origin-animating")
  }, [])

  const cancelOriginAnimations = useCallback(() => {
    for (const animation of originAnimationsRef.current) animation.cancel()
    originAnimationsRef.current = []
    clearOriginAnimatingFlag()
  }, [clearOriginAnimatingFlag])

  const runOriginAnimation = useCallback((mode: "open" | "close") => {
    const wrap = originWrapRef.current
    const { getOriginRect: originRectAt, prefersReducedMotion: reducedMotion, safeIndex: index } =
      originInputsRef.current
    if (!wrap || reducedMotion || !originRectAt) return
    if (typeof wrap.animate !== "function") return

    cancelOriginAnimations()

    // The wrapper sits at rest here (any in-flight animation was cancelled),
    // so this is its untransformed target geometry.
    const originRect = originRectAt(index)
    const offset =
      (originRect && getOriginOffset(originRect, wrap.getBoundingClientRect())) ?? originFallback
    const keyframes = buildOriginKeyframes(mode, offset)

    const options: KeyframeAnimationOptions = {
      duration: mode === "open" ? galleryMotion.openMs : galleryMotion.closeMs,
      // The curve is already baked into the keyframes.
      easing: "linear",
      fill: mode === "open" ? "none" : "forwards",
    }

    const travel = wrap.animate(keyframes.wrap, options)
    originAnimationsRef.current = [travel]

    // The surface scales, the content must not: this layer takes the exact
    // reciprocal, so the copy and the media sit at final size the whole way and
    // the growing box simply reveals them. Same start time, so the two
    // transforms cancel on every frame.
    const inner = cardInnerRef.current
    if (inner && typeof inner.animate === "function") {
      const counter = inner.animate(keyframes.inner, options)
      if (travel.startTime !== null) counter.startTime = travel.startTime
      originAnimationsRef.current.push(counter)
    }

    wrap.parentElement?.setAttribute("data-origin-animating", "true")
    // Only the open path unlocks on finish. On close the transform is held by
    // `fill: forwards` until Base UI unmounts, so releasing the clip early would
    // flash the very scrollbar the flag exists to suppress; the next
    // `cancelOriginAnimations` clears it instead.
    if (mode === "open") {
      travel.finished.then(clearOriginAnimatingFlag).catch(() => undefined)
    }
  }, [cancelOriginAnimations, clearOriginAnimatingFlag])

  const attachOriginWrap = useCallback((node: HTMLDivElement | null) => {
    originWrapRef.current = node
    setOriginWrapNode(node)
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (!open || !originWrapNode) return
    runOriginAnimation("open")
  }, [open, originWrapNode, runOriginAnimation])

  useEffect(() => {
    return () => {
      cancelOriginAnimations()
    }
  }, [cancelOriginAnimations])

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

  const activeMediaIsVideo = isVideoPreviewSource(activeMediaSource)
  const originMotionEnabled = !prefersReducedMotion && Boolean(getOriginRect)
  const mediaFrameStyle = activeCard.previewMediaPaddingBlock
    ? ({ "--preview-gallery-media-padding-block": activeCard.previewMediaPaddingBlock } as CSSProperties)
    : undefined
  const switchClassName =
    switchPhase === "idle" ? "" : ` preview-gallery-card-switch-${switchPhase}-${switchDirection}`

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="preview-gallery-backdrop" style={galleryMotionVars} />

        <div
          className="preview-gallery-shell"
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
                <div className="preview-gallery-card-inner" ref={cardInnerRef}>
                  <div className="preview-gallery-media-frame" style={mediaFrameStyle}>
                    {activeMediaIsVideo ? (
                      <video
                        key={activeMediaSource}
                        src={activeMediaSource}
                        poster={activeCard.previewPoster}
                        width={activeCard.previewWidth}
                        height={activeCard.previewHeight}
                        muted
                        loop={!prefersReducedMotion}
                        autoPlay={!prefersReducedMotion}
                        playsInline
                        preload={prefersReducedMotion ? "none" : "metadata"}
                        // Always on, not just under reduced motion: an autoplaying
                        // loop runs past five seconds, so WCAG 2.2.2 wants a pause
                        // control every viewer can reach.
                        controls
                        aria-label={activeCard.title}
                        className="preview-gallery-media"
                      />
                    ) : (
                      <img
                        key={activeMediaSource}
                        src={activeMediaSource}
                        // The dialog title right below already names this preview,
                        // so a matching alt would just read the same words twice.
                        alt=""
                        width={activeCard.previewWidth}
                        height={activeCard.previewHeight}
                        className="preview-gallery-media"
                        loading="eager"
                        decoding="async"
                      />
                    )}

                    <button
                      type="button"
                      className="preview-gallery-expand"
                      aria-label={isWide ? "Exit wide view" : "Expand preview"}
                      aria-pressed={isWide}
                      onClick={() => setIsWide((current) => !current)}
                    >
                      <Maximize2
                        aria-hidden="true"
                        strokeWidth={2}
                        className={`preview-gallery-expand-icon${isWide ? "" : " is-active"}`}
                      />
                      <Minimize2
                        aria-hidden="true"
                        strokeWidth={2}
                        className={`preview-gallery-expand-icon${isWide ? " is-active" : ""}`}
                      />
                    </button>
                  </div>

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
                        <ChevronLeft aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
                      </button>

                      <button
                        type="button"
                        className="preview-gallery-nav preview-gallery-nav-next"
                        aria-label="Next preview"
                        aria-keyshortcuts="ArrowDown ArrowRight"
                        onClick={() => moveBy(1)}
                        disabled={cards.length <= 1}
                      >
                        <ChevronRight aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
                      </button>

                      <Dialog.Close className="preview-gallery-nav preview-gallery-close" aria-label="Close preview">
                        <X aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
                      </Dialog.Close>
                    </div>
                  </div>

                  <div className="preview-gallery-content">
                    <div className="preview-gallery-heading">
                      <div>
                        <Dialog.Title className="preview-gallery-title">{activeCard.title}</Dialog.Title>
                        <Dialog.Description className="preview-gallery-description">{activeDescription}</Dialog.Description>
                      </div>
                    </div>

                    <dl className="preview-gallery-details">
                      {activeMetaRows.map(([label, value]) => (
                        <div key={label} className="preview-gallery-detail-row">
                          <dt>{label}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                      {activeCollaborators.length > 0 ? (
                        <div className="preview-gallery-detail-row">
                          <dt>Team</dt>
                          <dd>
                            <ul className="preview-gallery-people">
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
                          </dd>
                        </div>
                      ) : null}
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
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
