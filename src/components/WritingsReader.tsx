import { Dialog } from "@base-ui/react/dialog"
import { useSound } from "@web-kits/audio/react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react"

import { writings } from "../data/writings"
import { writingSummaries } from "../data/writingIndex"
import { backSound, nextSound, openSound } from "../lib/sounds"
import { groupWritingsByYear } from "../lib/writings"
import { usePortfolioItemUrl } from "../lib/portfolioUrl"
import { isNotesPath } from "../lib/projectMetadata"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { useOriginTravel, visibleOriginRect } from "../lib/originMotion"
import { cssTimeToMilliseconds } from "../lib/cssTime"
import { WritingArticle } from "./WritingArticle"

// The deferred reader measures its sheet before it paints on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

type WritingsReaderProps = {
  onOpenChange?: (open: boolean) => void
  /**
   * The back arrow. The list a note came from is a slide of the preview
   * gallery, not a page of this sheet, so going back means closing this and
   * letting that slide come forward; the feed owns both and does the handing.
   */
  onBack: () => void
  /** The folder tile: what the sheet grows out of and shrinks back into. */
  triggerRef: RefObject<HTMLButtonElement | null>
}

/**
 * One note, in a sheet of its own over the gallery's list of notes: the
 * hearts, the copy link, the arrows that turn to the next note, and a back
 * arrow to the list. The sheet used to carry the list as a second page; that
 * list is the gallery's slide now, so the arrow keys walk from a project into
 * the notes and out the other side the way they walk into the résumé, and
 * this only ever shows an article.
 */
export function WritingsReader({ onOpenChange, onBack, triggerRef }: WritingsReaderProps) {
  const playOpen = useSound(openSound, { volume: 0.3 })
  const playNext = useSound(nextSound, { volume: 0.26 })
  const playBack = useSound(backSound, { volume: 0.26 })
  const prefersReducedMotion = usePrefersReducedMotion()
  const { itemId: writingId, selectItem: selectWriting, clearItem: clearWriting } = usePortfolioItemUrl("writing")
  const [switchPhase, setSwitchPhase] = useState<"idle" | "out" | "in" | "settle">("idle")
  const [switchDirection, setSwitchDirection] = useState<"prev" | "next">("next")
  const switchTimer = useRef<number | undefined>(undefined)
  const switchFrame = useRef<number | undefined>(undefined)
  const switchWritingId = useRef<string | null>(null)
  const cancelSwitch = useCallback(() => {
    window.clearTimeout(switchTimer.current)
    if (switchFrame.current !== undefined) window.cancelAnimationFrame(switchFrame.current)
    switchTimer.current = undefined
    switchFrame.current = undefined
    switchWritingId.current = null
    setSwitchPhase("idle")
  }, [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // The toolbar only earns its divider once the page beneath it has moved.
  const [scrolled, setScrolled] = useState(false)
  const activeWriting = writings.find((writing) => writing.id === writingId)
  const open = Boolean(activeWriting)
  // Retain the article during the modal exit, as the project gallery does.
  if (activeWriting && selectedId !== activeWriting.id) setSelectedId(activeWriting.id)
  const selected = writings.find((writing) => writing.id === selectedId)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const focusTitleOnRead = useRef(true)
  const readerRef = useRef<HTMLDivElement>(null)
  // Callback refs, not useRef: the popup lives in a portal that mounts a
  // commit after `open` flips, so the height effect has to re-run when these
  // nodes actually attach rather than when the dialog is asked to open.
  const [pagesEl, setPagesEl] = useState<HTMLDivElement | null>(null)
  const [toolbarEl, setToolbarEl] = useState<HTMLElement | null>(null)
  const [popupEl, setPopupEl] = useState<HTMLDivElement | null>(null)
  // Held off for a frame after the sheet opens so its first height lands
  // without a transition -- see the .writings-pages rule.
  const [sized, setSized] = useState(false)
  // The arrows walk the notes in the order the list shows them.
  const orderedWritings = groupWritingsByYear(writingSummaries).flatMap(({ entries }) => entries)

  useEffect(() => {
    // History can close or replace a note without going through a dialog control.
    if (!open || (switchWritingId.current !== null && switchWritingId.current !== writingId)) cancelSwitch()
  }, [open, writingId, cancelSwitch])

  useEffect(() => () => {
    window.clearTimeout(switchTimer.current)
    if (switchFrame.current !== undefined) window.cancelAnimationFrame(switchFrame.current)
  }, [])

  useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  useEffect(() => {
    if (!open) return
    readerRef.current?.scrollTo({ top: 0 })
    if (focusTitleOnRead.current) titleRef.current?.focus({ preventScroll: true })
    setScrolled((readerRef.current?.scrollTop ?? 0) > 0)
  }, [selectedId, open])

  // The sheet is as tall as the article in it, up to the room the viewport
  // leaves. Only the content height is measured here -- the clamp is CSS, so
  // 100dvh and the safe-area insets stay in the stylesheet. The observers catch
  // a note whose images settle after it is already forward.
  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setSized(false)
      return
    }
    const content = readerRef.current?.firstElementChild
    if (!(content instanceof HTMLElement) || !pagesEl || !toolbarEl) return

    // offsetHeight, not a bounding rect: the sheet is measured while it is
    // still flying in from its opener, and a rect would hand back the animated
    // size rather than the laid-out one.
    const measure = () => {
      pagesEl.style.setProperty("--writings-page-height", `${content.offsetHeight}px`)
      pagesEl.style.setProperty("--writings-chrome", `${toolbarEl.offsetHeight}px`)
    }
    measure()
    const frame = window.requestAnimationFrame(() => setSized(true))
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    observer.observe(toolbarEl)
    window.addEventListener("resize", measure)
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [open, selectedId, pagesEl, toolbarEl])

  // The sheet grows out of the folder tile and shrinks back into it, the way a
  // project preview grows out of its card: same geometry, same two curves, so
  // moving between the two modals is one motion vocabulary. The anchor is read
  // live at both ends, so a sheet closed after the tile has scrolled away falls
  // back to the plain lift.
  const { run: runOriginTravel } = useOriginTravel({
    node: popupEl,
    getOriginRect: () => visibleOriginRect(triggerRef.current),
    enabled: !prefersReducedMotion,
    openDurationProperty: "--modal-open-dur",
    closeDurationProperty: "--modal-close-dur",
  })

  // Declared after the height above so both ends of the flight measure the
  // sheet at the size it rests at, and keyed off `open` rather than the dialog's
  // own callback, which history can close this sheet without going through. The
  // popup stays mounted through its exit, so it is still there to fly home.
  useIsomorphicLayoutEffect(() => {
    if (popupEl) runOriginTravel(open ? "open" : "close")
  }, [open, popupEl, runOriginTravel])

  function readWriting(id: string, playSound = playOpen, focusTitle = true) {
    cancelSwitch()
    playSound()
    focusTitleOnRead.current = focusTitle
    selectWriting(id, writingId !== null)
  }

  function moveWriting(direction: -1 | 1, pointerTarget?: HTMLButtonElement) {
    const index = orderedWritings.findIndex((writing) => writing.id === selectedId)
    if (!open || index < 0 || orderedWritings.length <= 1 || switchPhase !== "idle") return
    // Keep pointer navigation on its control, including browsers that don't focus clicked buttons.
    pointerTarget?.focus({ preventScroll: true })
    const nextId = orderedWritings[(index + direction + orderedWritings.length) % orderedWritings.length].id
    const playSound = direction > 0 ? playNext : playBack
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      readWriting(nextId, playSound, !pointerTarget)
      return
    }

    const writingSwitchMs = cssTimeToMilliseconds(
      getComputedStyle(readerRef.current ?? document.documentElement).getPropertyValue("--duration-base"),
    )
    playSound()
    focusTitleOnRead.current = !pointerTarget
    switchWritingId.current = writingId
    setSwitchDirection(direction > 0 ? "next" : "prev")
    setSwitchPhase("out")
    switchTimer.current = window.setTimeout(() => {
      // Keep the old note (and its scroll position) until it has faded out.
      switchWritingId.current = nextId
      selectWriting(nextId, true)
      setSwitchPhase("in")
      switchFrame.current = window.requestAnimationFrame(() => {
        switchFrame.current = window.requestAnimationFrame(() => {
          setSwitchPhase("settle")
          switchFrame.current = undefined
          switchTimer.current = window.setTimeout(cancelSwitch, writingSwitchMs)
        })
      })
      switchTimer.current = undefined
    }, writingSwitchMs)
  }

  // Back and dismiss are the same move: the note gives its URL up, and the
  // list it came from is the gallery slide underneath that URL. The feed is
  // told once the URL has actually closed -- a later tick when history has to
  // be traversed -- so it can see whether the list is there or a shared link
  // left nothing underneath, and put the slide forward in that case.
  function returnToNotes() {
    if (!open) return
    cancelSwitch()
    playBack()
    clearWriting(onBack)
  }

  return (
    <Dialog.Root open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) return
        returnToNotes()
      }}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) setSelectedId(null)
      }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="writings-backdrop" />
        <Dialog.Popup data-switch-phase={switchPhase} data-switch-direction={switchDirection} ref={setPopupEl}
          // Closing over the list hands focus to the gallery, which is already
          // taking it; only a note with nothing underneath returns to the tile.
          finalFocus={() => (isNotesPath(window.location.pathname) ? false : triggerRef.current)}
          initialFocus={titleRef} data-scrolled={scrolled} data-sized={sized}
          data-origin-motion={prefersReducedMotion ? undefined : "true"}
          onKeyDown={(event) => {
            if (orderedWritings.length <= 1 || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
            if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
            event.preventDefault()
            moveWriting(event.key === "ArrowLeft" ? -1 : 1)
          }}
          className={(state) => `writings-dialog t-modal ${state.transitionStatus === "starting" ? "" : state.open ? "is-open" : "is-closing"}`}>
          <header className="writings-toolbar" ref={setToolbarEl}>
            <div className="writings-toolbar-leading">
              <button type="button" className="preview-gallery-nav writings-back" aria-label="Go back to Notes" onClick={returnToNotes}>
                <ChevronLeft className="preview-gallery-nav-icon preview-gallery-nav-icon-prev" aria-hidden="true" />
              </button>
              <Dialog.Title className="writings-toolbar-title">Notes</Dialog.Title>
            </div>
          </header>
          <Dialog.Description className="sr-only">Read this note. Use the back button to return to the list of notes, or the previous and next buttons or left and right arrow keys to browse notes.</Dialog.Description>
          <div className="writings-pages" ref={setPagesEl}>
            <div className="writings-scroll" ref={readerRef}
              onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}>
              {selected ? (
                <WritingArticle key={selected.id} writing={selected} titleRef={titleRef}
                  showLikes={open} onSelectWriting={readWriting} />
              ) : null}
            </div>
          </div>
          <div className="writings-navigation" role="group" aria-label="Note navigation">
            <button type="button" className="preview-gallery-nav writings-note-nav writings-note-nav-prev" aria-label="Previous note" aria-keyshortcuts="ArrowLeft"
              onClick={(event) => moveWriting(-1, event.detail > 0 ? event.currentTarget : undefined)} disabled={orderedWritings.length <= 1}>
              <ChevronLeft className="preview-gallery-nav-icon preview-gallery-nav-icon-prev" aria-hidden="true" />
            </button>
            <button type="button" className="preview-gallery-nav writings-note-nav writings-note-nav-next" aria-label="Next note" aria-keyshortcuts="ArrowRight"
              onClick={(event) => moveWriting(1, event.detail > 0 ? event.currentTarget : undefined)} disabled={orderedWritings.length <= 1}>
              <ChevronRight className="preview-gallery-nav-icon preview-gallery-nav-icon-next" aria-hidden="true" />
            </button>
            <Dialog.Close className="preview-gallery-nav writings-mobile-close" aria-label="Close note"><X className="preview-gallery-nav-icon" aria-hidden="true" /></Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
