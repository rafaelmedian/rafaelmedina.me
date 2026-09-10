import { Dialog } from "@base-ui/react/dialog"
import { useSound } from "@web-kits/audio/react"
import { ArrowUpRight, ChevronRight, ChevronLeft, X } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react"

import { collaborators, siteLinks, type Collaborator, type PortfolioCard } from "../data/portfolio"
import { isVideoSource } from "../lib/media"
import { cssTimeToMilliseconds } from "../lib/cssTime"
import { trackEvent } from "../lib/analytics"
import { galleryItemTitle, resumeItemTitle, writingsItemTitle, type GalleryItem } from "../lib/galleryItems"
import { originCloseEasePoints, originOpenEasePoints, toCssEasing, useOriginTravel } from "../lib/originMotion"
import { writingSummaries } from "../data/writingIndex"
import { groupWritingsByYear } from "../lib/writings"
import { useGalleryPage, type GalleryPageDirection } from "../lib/useGalleryPage"
import type { WritingsReaderProps } from "./WritingsReader"
import { LikeButton } from "./LikeButton"
import { PreviewMedia } from "./PreviewMedia"
import { ResumeContent } from "./ResumeContent"
import { WritingsArchive } from "./WritingsArchive"
import type { WritingsReaderStatus } from "./WritingsFolder"
import { backSound, closeSound, nextSound, openSound } from "../lib/sounds"

type PreviewGalleryDialogProps = {
  items: GalleryItem[]
  open: boolean
  /** Whether the open that mounted this dialog came from a press on a tile. */
  openedByGesture: boolean
  selectedIndex: number
  prefersReducedMotion: boolean
  onOpenChange: (open: boolean) => void
  onSelectedIndexChange: (index: number) => void
  getOriginRect?: (index: number) => DOMRect | null
  /** Where focus lands on close when the control that opened this is gone. */
  finalFocus?: React.ComponentProps<typeof Dialog.Popup>["finalFocus"]
  /** A row was pressed: fetch and select its nested article. */
  onSelectWriting?: (id: string) => void
  /** Deferred article loading and retry feedback. */
  notesStatus?: WritingsReaderStatus
  writingId: string | null
  WritingReader?: React.ComponentType<WritingsReaderProps>
  onPageWriting: (id: string) => void
  onBackFromWriting: () => void
  onRetryWriting: () => void
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
// lives in lib/originMotion; nested Notes turns keep that outer shell in place.

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
  items,
  open,
  openedByGesture,
  selectedIndex,
  prefersReducedMotion,
  onOpenChange,
  onSelectedIndexChange,
  getOriginRect,
  finalFocus,
  onSelectWriting,
  notesStatus,
  writingId,
  WritingReader,
  onPageWriting,
  onBackFromWriting,
  onRetryWriting,
}: PreviewGalleryDialogProps) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  // This dialog is lazily mounted, so its first open is always the mount: `open`
  // is already true here and an unconditional `useRef(open)` would swallow the
  // latch every visitor hears first. Seeding it from the gesture flag instead
  // sounds a press on a tile and stays quiet for a shared link, which opens the
  // gallery with nothing for a sound to answer.
  const prevOpenRef = useRef(open && !openedByGesture)
  const switchTimeoutRef = useRef<number | null>(null)
  const switchFrameRef = useRef<number | null>(null)
  const closeResetTimeoutRef = useRef<number | null>(null)
  const originWrapRef = useRef<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  // The card is the surface that scrolls, so it is also what opening focuses:
  // a slide long enough to need scrolling is unreachable from the keyboard if
  // the caret sits on the popup, whose overflow is its child's.
  const cardRef = useRef<HTMLElement | null>(null)
  // The portal mounts its contents in a later commit than the one that flips
  // `open`, so the open animation keys off the node arriving, not off `open`.
  const [originWrapNode, setOriginWrapNode] = useState<HTMLDivElement | null>(null)
  const [switchPhase, setSwitchPhase] = useState<PreviewSwitchPhase>("idle")
  const [switchDirection, setSwitchDirection] = useState<PreviewSwitchDirection>("next")
  const [isWide, setIsWide] = useState(shouldOpenPreviewWide)
  const safeIndex = useMemo(() => wrapIndex(selectedIndex, items.length), [items.length, selectedIndex])
  const activeItem = items[safeIndex]
  const activeCard = activeItem?.kind === "project" ? activeItem.card : undefined
  const isResumeSlide = activeItem?.kind === "resume"
  // The résumé and the notes list are both pages of prose in a card taller
  // than the window, so both give the vertical arrows back to scrolling and
  // page on the horizontal pair alone.
  const isReaderSlide = isResumeSlide || activeItem?.kind === "writings"
  const noteDirection = useRef<GalleryPageDirection>("next")
  const notesPage = useGalleryPage(writingId, noteDirection, cardRef, prefersReducedMotion || !open || !isReaderSlide)
  const readingNote = activeItem?.kind === "writings" && notesPage.displayed !== null
  const noteTitleRef = useRef<HTMLHeadingElement>(null)
  const notesListRef = useRef<HTMLDivElement>(null)
  const notesScrollRef = useRef<HTMLDivElement>(null)
  const notesTitleRef = useRef<HTMLHeadingElement>(null)
  const returnRow = useRef<HTMLButtonElement | null>(null)
  const listScrollTop = useRef(0)
  const focusNoteTitle = useRef(true)
  const orderedNotes = useMemo(() => groupWritingsByYear(writingSummaries).flatMap(group => group.entries), [])
  const [listHeight, setListHeight] = useState<number | null>(null)

  useIsomorphicLayoutEffect(() => {
    if (!open || activeItem?.kind !== "writings" || !originWrapNode) return
    const list = notesListRef.current
    if (!list) return
    const measure = () => {
      const card = cardRef.current
      const heading = notesTitleRef.current?.parentElement
      if (!card || !heading) return
      const styles = getComputedStyle(card)
      const headingStyles = getComputedStyle(heading)
      setListHeight(list.scrollHeight + heading.offsetHeight +
        Number.parseFloat(headingStyles.marginBottom) +
        Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom))
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [open, activeItem?.kind, originWrapNode])

  useIsomorphicLayoutEffect(() => {
    if (!open || activeItem?.kind !== "writings") return
    const scroller = notesScrollRef.current
    if (!scroller) return
    if (notesPage.displayed) {
      scroller.scrollTop = 0
      returnRow.current = notesListRef.current?.querySelector<HTMLButtonElement>(
        `[data-writing-id="${notesPage.displayed}"]`,
      ) ?? returnRow.current
      if (focusNoteTitle.current) noteTitleRef.current?.focus({ preventScroll: true })
    } else {
      scroller.scrollTop = listScrollTop.current
      const row = returnRow.current
      if (row?.isConnected) row.focus({ preventScroll: true })
    }
  }, [notesPage.displayed, WritingReader, open, activeItem?.kind, originWrapNode])

  const pageNote = useCallback((id: string, direction?: GalleryPageDirection) => {
    noteDirection.current = direction ?? (orderedNotes.findIndex(note => note.id === id) <
      orderedNotes.findIndex(note => note.id === writingId) ? "prev" : "next")
    onPageWriting(id)
  }, [onPageWriting, orderedNotes, writingId])

  const activeMediaSource = activeCard?.image ?? ""
  const activeDescription = activeCard ? getPreviewDescription(activeCard) : ""
  const activeCollaborators = activeCard ? getPreviewCollaborators(activeCard) : []

  const playOpen = useSound(openSound, { volume: 0.3 })
  const playClose = useSound(closeSound, { volume: 0.26 })
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
      if (!nextOpen && writingId) {
        playBack()
        onBackFromWriting()
        return
      }
      if (!nextOpen) {
        playClose()
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
    [cancelSwitchTransition, onOpenChange, playClose, playBack, runOriginAnimation, writingId, onBackFromWriting],
  )

  // One step of the strip, in either direction, and the only way the selection
  // ever changes while the gallery is open: `moveBy` walks to a neighbour and
  // `selectItemId` jumps to a named item, and both land here so a jump gets the
  // same paging transition a neighbour does rather than a bare swap. It reports
  // whether it moved, because a caller standing in for a link -- the résumé
  // slide's project prints -- has to know whether to swallow the click it
  // intercepted or hand it back to the browser.
  const goToIndex = useCallback(
    (nextIndex: number, nextDirection: PreviewSwitchDirection) => {
      if (switchPhase !== "idle") return false
      if (nextIndex === safeIndex) return false

      if (nextDirection === "next") playNext()
      else playBack()

      if (prefersReducedMotion) {
        onSelectedIndexChange(nextIndex)
        return true
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

      return true
    },
    [onSelectedIndexChange, playBack, playNext, prefersReducedMotion, safeIndex, switchPhase],
  )

  const moveBy = useCallback(
    (direction: number) => {
      if (direction === 0) return
      if (writingId) {
        const index = orderedNotes.findIndex(note => note.id === writingId)
        const next = orderedNotes[wrapIndex(index + direction, orderedNotes.length)]
        if (next) {
          if (direction > 0) playNext()
          else playBack()
          pageNote(next.id, direction < 0 ? "prev" : "next")
        }
        return
      }
      if (items.length <= 1) return
      goToIndex(wrapIndex(safeIndex + direction, items.length), direction < 0 ? "prev" : "next")
    },
    [goToIndex, items.length, safeIndex, writingId, orderedNotes, pageNote, playNext, playBack],
  )

  // The résumé slide's project prints page the gallery to that project instead
  // of leaving for its own page: the reader is inside the gallery now, so the
  // work it cites is one slide away rather than one navigation away.
  const selectItemId = useCallback(
    (id: string) => {
      const nextIndex = items.findIndex((item) => item.id === id)
      if (nextIndex < 0) return false
      // A click that lands mid-transition is refused. It is still swallowed --
      // a double-click on a print is the common way to land here, and a full
      // page load answers that worse than doing nothing does -- but it is not
      // recorded, because no slide opened.
      if (!goToIndex(nextIndex, nextIndex < safeIndex ? "prev" : "next")) return true

      const nextItem = items[nextIndex]
      // The grid is not the only surface that opens a preview: the résumé slide
      // cites projects too, and those opens have to be told apart rather than
      // going unrecorded.
      trackEvent("work_preview_open", {
        preview_id: nextItem.id,
        preview_title: galleryItemTitle(nextItem),
        preview_index: nextIndex + 1,
        preview_placement: "resume_reader",
      })
      return true
    },
    [goToIndex, items, safeIndex],
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

      // The stationary toolbar is outside the scrolling card, so native
      // scrolling cannot reach the résumé from a focused paging/close button.
      // Forward those keys without moving focus away from the controls.
      const card = readingNote ? notesScrollRef.current : cardRef.current
      if (isReaderSlide && card && target instanceof Element &&
        target.closest(".preview-gallery-toolbar, .preview-gallery-rail, .notes-gallery-heading") && !event.altKey && !event.metaKey) {
        const scrollSteps: Record<string, number> = {
          ArrowDown: 40,
          ArrowUp: -40,
          PageDown: card.clientHeight * 0.9,
          PageUp: -card.clientHeight * 0.9,
          Home: -card.scrollHeight,
          End: card.scrollHeight,
        }
        const step = scrollSteps[event.key]
        if (step !== undefined) {
          event.preventDefault()
          card.scrollBy({ top: step, behavior: "instant" })
          return
        }
      }

      // The résumé slide is a document taller than the card that holds it, so
      // there the vertical pair scrolls it and only the horizontal pair pages.
      // On a preview, where there is nothing to scroll, both pairs page.
      if (event.key === "ArrowLeft" || (!isReaderSlide && event.key === "ArrowUp")) {
        event.preventDefault()
        focusNoteTitle.current = true
        moveBy(-1)
      } else if (event.key === "ArrowRight" || (!isReaderSlide && event.key === "ArrowDown")) {
        event.preventDefault()
        focusNoteTitle.current = true
        moveBy(1)
      } else if (event.key === "Escape") {
        event.preventDefault()
        // This one handler owns the nested Back action. Letting the same key
        // reach Base UI would dismiss the now-visible parent list as well.
        event.stopPropagation()
        handleOpenChange(false)
      }
    }

    window.addEventListener("keydown", onKeyDown, { capture: true })
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true })
  }, [handleOpenChange, isReaderSlide, moveBy, open, readingNote])

  if (!activeItem) return null

  const activeMediaIsVideo = isVideoSource(activeMediaSource)
  const mediaFrameStyle = activeCard?.previewMediaPadding
    ? ({ "--preview-gallery-media-padding": activeCard.previewMediaPadding } as CSSProperties)
    : undefined
  const switchClassName =
    switchPhase === "idle" ? "" : ` preview-gallery-card-switch-${switchPhase}-${switchDirection}`
  const prevKeyshortcuts = isReaderSlide ? "ArrowLeft" : "ArrowUp ArrowLeft"
  const nextKeyshortcuts = isReaderSlide ? "ArrowRight" : "ArrowDown ArrowRight"

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="preview-gallery-backdrop" style={galleryMotionVars} />

        <div
          className="preview-gallery-shell"
          // The résumé slide is a page of prose rather than a 4:3 shot, so it
          // takes the reader's own measure instead of the width the artwork
          // derives. Set on the shell because the width is a custom property
          // the wrap and the popup both inherit.
          data-kind={activeItem.kind}
          data-wide={isWide ? "true" : undefined}
          data-reading-note={readingNote ? "true" : undefined}
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
              className={`preview-gallery-popup${readingNote ? " writings-dialog" : ""}`}
              ref={popupRef}
              initialFocus={() => writingId ? noteTitleRef.current ?? cardRef.current : cardRef.current}
              finalFocus={finalFocus}
              data-preview-kind={activeItem.kind}
              data-reading-note={readingNote ? "true" : undefined}
              data-preview-media={activeCard ? (activeMediaIsVideo ? "video" : "image") : undefined}
              data-preview-crop={activeCard?.previewCropped ? "true" : undefined}
              // Mirrors `mosaic-row-card-${id}` on the tile: a hook for the one
              // artwork whose framing the shared rules get wrong.
              data-preview-id={activeItem.id}
              data-origin-motion={originMotionEnabled ? "true" : undefined}
              data-wide={isWide ? "true" : undefined}
              // No aria-label here: it would override the aria-labelledby Base UI
              // wires to <Dialog.Title> below, and the title is the better name.
            >
              {/* The compact layout's toolbar is a sibling of the card rather
                  than its first child: the card carries the paging transition,
                  and a control that slid and faded under the finger that
                  pressed it read as the button leaving rather than the slide.
                  Outside the animated surface the counter turns over in place
                  while the artwork and prose page behind it. */}
              <div className="preview-gallery-toolbar">
                <span className="preview-gallery-count">
                  {safeIndex + 1} / {items.length}
                </span>

                <div className="preview-gallery-controls" role="group" aria-label="Preview controls">
                  <button
                    type="button"
                    className="preview-gallery-nav preview-gallery-nav-prev"
                    aria-label={readingNote ? "Previous note" : "Previous preview"}
                    aria-keyshortcuts={prevKeyshortcuts}
                    onClick={(event) => { focusNoteTitle.current = event.detail === 0; moveBy(-1) }}
                    disabled={items.length <= 1}
                  >
                    <ChevronLeft aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon preview-gallery-nav-icon-prev" />
                  </button>

                  <button
                    type="button"
                    className="preview-gallery-nav preview-gallery-nav-next"
                    aria-label={readingNote ? "Next note" : "Next preview"}
                    aria-keyshortcuts={nextKeyshortcuts}
                    onClick={(event) => { focusNoteTitle.current = event.detail === 0; moveBy(1) }}
                    disabled={items.length <= 1}
                  >
                    <ChevronRight aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon preview-gallery-nav-icon-next" />
                  </button>
                </div>

                {/* Outside the paging group, and the only thing on its side of
                    the bar: leaving is not a third step through the set, and
                    stacked with the chevrons in one corner it was the one
                    control a thumb reaching for "next" could hit by mistake. */}
                <Dialog.Close
                  className="preview-gallery-nav preview-gallery-close"
                  aria-label={readingNote ? "Close note" : activeItem.kind === "resume" ? "Close résumé" : activeItem.kind === "writings" ? "Close notes" : "Close preview"}
                >
                  <X aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
                </Dialog.Close>
              </div>

              {/* Swipe is handled on the whole card, not just the media: on
                  phones the media is capped at 32vh, so the text below it is
                  most of the surface a thumb actually lands on. */}
              <article
                className={`preview-gallery-card${switchClassName}${activeItem.kind === "writings" ? " notes-gallery-card" : ""}`}
                ref={cardRef}
                style={activeItem.kind === "writings" && listHeight !== null ? {
                  "--notes-list-height": `${listHeight}px`,
                } as CSSProperties : undefined}
                tabIndex={-1}
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
                  {activeCard ? (
                    <>
                      <div className="preview-gallery-media-frame" style={mediaFrameStyle}>
                        <PreviewMedia key={activeMediaSource} card={activeCard} reducedMotion={prefersReducedMotion} />
                      </div>

                      {/* On the line where the artwork meets the prose rather
                          than in either: the pill answers the shot, and a row
                          of its own above the title would push every
                          description down whether or not anyone ever taps it.
                          Keyed by project, so paging starts the next count
                          from scratch instead of carrying this one's over
                          while its own read is still in flight. */}
                      {import.meta.env.VITE_LIKES_API_URL ? (
                        <LikeButton key={activeCard.id} collection="projects" itemId={activeCard.id}
                          className="preview-gallery-likes" />
                      ) : null}

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
                    </>
                  ) : activeItem.kind === "writings" ? (
                    <div className="preview-gallery-notes writings-surface" data-reading={readingNote ? "true" : undefined}>
                      <header className="notes-gallery-heading writings-toolbar">
                        <button type="button" className="preview-gallery-nav notes-gallery-back"
                          aria-label="Go back to Notes" aria-hidden={!readingNote} tabIndex={readingNote ? 0 : -1}
                          onClick={() => handleOpenChange(false)}>
                          <ChevronLeft className="preview-gallery-nav-icon" aria-hidden="true" />
                        </button>
                        <Dialog.Title ref={notesTitleRef} className="preview-gallery-title preview-gallery-notes-title">
                          {writingsItemTitle}
                        </Dialog.Title>
                      </header>
                      <Dialog.Description className="sr-only">
                        {readingNote ? "Read this note. Use Back to return to Notes, or the left and right arrows to browse notes."
                          : "Rafael Medina's notes, grouped by year. Choose one to read it."}
                      </Dialog.Description>
                      <div className="notes-gallery-viewport writings-scroll" ref={notesScrollRef}
                        onScroll={(event) => {
                          if (!readingNote) listScrollTop.current = event.currentTarget.scrollTop
                          event.currentTarget.closest(".preview-gallery-notes")?.setAttribute("data-scrolled",
                            event.currentTarget.scrollTop > 0 ? "true" : "false")
                        }}>
                        <div className={`notes-gallery-page${notesPage.phase === "idle" ? "" : ` preview-gallery-card-switch-${notesPage.phase}-${notesPage.direction}`}`}
                          data-switch-phase={notesPage.phase} data-switch-direction={notesPage.direction}>
                          <div ref={notesListRef} className="notes-gallery-list" hidden={readingNote || Boolean(writingId && !WritingReader)}
                            inert={readingNote || Boolean(writingId && !WritingReader)} aria-hidden={readingNote || undefined}>
                            <WritingsArchive onSelectWriting={(id, trigger) => {
                              returnRow.current = trigger
                              focusNoteTitle.current = true
                              listScrollTop.current = notesScrollRef.current?.scrollTop ?? 0
                              onSelectWriting?.(id)
                            }} pendingId={notesStatus?.pendingId} status={notesStatus?.status} />
                          </div>
                          {readingNote && WritingReader ? <WritingReader writingId={notesPage.displayed!} titleRef={noteTitleRef}
                            onSelectWriting={(id) => { focusNoteTitle.current = true; pageNote(id) }} /> : null}
                          {writingId && !WritingReader ? <div className="notes-gallery-pending">
                            <p role="status">{notesStatus?.status ?? "Opening notes…"}</p>
                            {notesStatus?.status?.includes("again") ? <button type="button"
                              className="writing-entry-trigger" onClick={onRetryWriting}>Try again</button> : null}
                          </div> : null}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="preview-gallery-resume">
                      <Dialog.Title className="preview-gallery-title preview-gallery-resume-title">
                        {resumeItemTitle}
                      </Dialog.Title>
                      <Dialog.Description className="sr-only">
                        Rafael Medina's work history and education, with a link to the PDF résumé.
                      </Dialog.Description>
                      <div className="preview-gallery-resume-body mosaic-about-body">
                        <ResumeContent onSelectProject={selectItemId} />
                        <p className="mosaic-about-resume-download">
                          <a
                            href={siteLinks.resumePdf}
                            target="_blank"
                            rel="noreferrer"
                            className="mosaic-about-link"
                            onClick={() => {
                              trackEvent("social_link_click", {
                                social_label: "View Resume",
                                social_href: siteLinks.resumePdf,
                                social_placement: "resume_dialog",
                              })
                            }}
                          >
                            View resume PDF <ArrowUpRight size={16} aria-hidden="true" />
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>

              <div className="preview-gallery-rail" role="group" aria-label={readingNote ? "Note navigation" : "Preview navigation"}>
                <button
                  type="button"
                  className="preview-gallery-nav preview-gallery-nav-prev"
                  aria-label={readingNote ? "Previous note" : "Previous preview"}
                  aria-keyshortcuts={prevKeyshortcuts}
                  onClick={(event) => { focusNoteTitle.current = event.detail === 0; moveBy(-1) }}
                  disabled={items.length <= 1}
                >
                  <ChevronLeft aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon preview-gallery-nav-icon-prev" />
                </button>

                <button
                  type="button"
                  className="preview-gallery-nav preview-gallery-nav-next"
                  aria-label={readingNote ? "Next note" : "Next preview"}
                  aria-keyshortcuts={nextKeyshortcuts}
                  onClick={(event) => { focusNoteTitle.current = event.detail === 0; moveBy(1) }}
                  disabled={items.length <= 1}
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
