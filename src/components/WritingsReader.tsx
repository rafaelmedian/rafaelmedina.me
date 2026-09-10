import { Dialog } from "@base-ui/react/dialog"
import { useSound } from "@web-kits/audio/react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties, type Ref, type RefObject } from "react"


import { writings, type Writing } from "../data/writings"
import { backSound, nextSound, openSound } from "../lib/sounds"
import { groupWritingsByYear, noteHash, pickFrom } from "../lib/writings"
import { usePortfolioItemUrl } from "../lib/portfolioUrl"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { useOriginTravel, visibleOriginRect } from "../lib/originMotion"
import { cssTimeToMilliseconds } from "../lib/cssTime"
import { WritingArticle } from "./WritingArticle"


// The deferred reader measures its sheet before it paints on the client.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

// The archive leaves the same two gutters empty that the reader hangs its
// marginalia in. Objects go into them down the list, in the same pencil the
// handwriting is set in, so the column of titles has something beside it
// rather than a bare page each side. The things a note gets written with, not
// icons: the sheet, the pencil, the cup it was written over.
//
// Pictures of pencil rather than shapes, for the same reason the brackets are.
// Drawn as vector outlines these were one clean stroke of even weight at every
// edge, which is the one thing a pencil never gives you, and no amount of
// detail in the path fixed it. They go through the Rough.js pass the marks do
// in scripts/build-writing-marks.mjs and ship as PNGs from
// public/writings/marks, black on transparent and used as masks, so they still
// take their colour from the list beside them.
const ARCHIVE_DRAWINGS = ["sheet", "pencil", "cup"]

// Rows a drawing is pinned to, counted across the whole list rather than within
// a year, so the spacing holds when a year has one note in it. One every few
// rows rather than one per year: a year with seven notes under it would
// otherwise carry a single mark at the top and leave the rest of the gutter
// bare. The gaps cycle rather than repeat, so a long list never settles into a
// mark every third row, and four of them run against three objects, so a list
// has to pass forty-five rows before an object comes back to the gap it had.
const DRAWING_GAPS = [4, 3, 5, 3]

// What a drawing varies by, hashed off the note it hangs beside the way the
// reader's margin notes are. Every mark used to be one size on one rail with
// its tilt following the side it sat on, which drew a second ruled column down
// each gutter under the first.
//
// The pull is the part that unrules them: it spends whatever room is left
// between the mark and the gutter's outer limit, so a mark tucked against the
// titles and one standing well off them are the same rule at two settings, and
// neither can reach past the sheet however wide it gets. The scales are five
// and six long, and a note draws from all four with one hash of its own id, so
// two marks agreeing on one of them still differ on the rest.
const DRAWING_SIZES = ["4rem", "5.5rem", "4.5rem", "5rem", "4.75rem"]
const DRAWING_PULLS = ["0", "0.5", "0.15", "0.8", "0.3"]
const DRAWING_DROPS = ["-0.75rem", "1.5rem", "0.25rem", "2.75rem", "0.75rem", "2rem"]
const DRAWING_TILTS = ["-11deg", "-5deg", "-2deg", "4deg", "8deg", "12deg"]

type DrawingPlacement = {
  row: number
  object: string
  place: "left" | "right"
  size: string
  pull: string
  drop: string
  tilt: string
}

// Which rows carry a mark and how each one sits. The side comes off the note's
// own id rather than off the count, so a run of them doesn't zigzag; three down
// one gutter would leave the other bare, so the third turns back, as does the
// second of a list short enough to carry two. Neighbours that do share a side
// never share a pull, which is what keeps a pair on one side from lining up
// into the column the alternating arrangement drew.
function archiveDrawings(rows: readonly Writing[]) {
  const drawings: DrawingPlacement[] = []
  for (let row = 0; row < rows.length; row += DRAWING_GAPS[(drawings.length - 1) % DRAWING_GAPS.length]) {
    const hash = noteHash(rows[row].id)
    const previous = drawings.at(-1)
    let place: "left" | "right" = hash % 2 ? "right" : "left"
    if (previous?.place === place && drawings.at(-2)?.place === place) place = place === "left" ? "right" : "left"
    let pull = pickFrom(DRAWING_PULLS, hash, 1)
    if (previous?.place === place && previous.pull === pull) pull = DRAWING_PULLS[(DRAWING_PULLS.indexOf(pull) + 2) % DRAWING_PULLS.length]
    drawings.push({
      row,
      object: ARCHIVE_DRAWINGS[drawings.length % ARCHIVE_DRAWINGS.length],
      place,
      pull,
      size: pickFrom(DRAWING_SIZES, hash, 2),
      drop: pickFrom(DRAWING_DROPS, hash, 3),
      tilt: pickFrom(DRAWING_TILTS, hash, 4),
    })
  }
  const last = drawings.at(-1)
  if (last && drawings.every((drawing) => drawing.place === drawings[0].place)) last.place = last.place === "left" ? "right" : "left"
  return new Map(drawings.map((drawing) => [drawing.row, drawing]))
}

function ArchiveDrawing({ drawing }: { drawing: DrawingPlacement }) {
  return (
    <span className="writings-drawing" data-place={drawing.place} aria-hidden="true" style={{
      "--writings-drawing-mark": `url("/writings/marks/drawing-${drawing.object}.png")`,
      "--writings-drawing-size": drawing.size,
      "--writings-drawing-pull": drawing.pull,
      "--writings-drawing-drop": drawing.drop,
      "--writings-drawing-tilt": drawing.tilt,
    } as CSSProperties} />
  )
}

// Dates are stored as plain YYYY-MM-DD, so they are read at UTC midnight rather
// than in the reader's zone, where a western offset would roll them back a day.
const noteDate = (publishedAt: string) => new Date(`${publishedAt}T00:00:00Z`)
// A list row sits under its own year heading, so it only carries day and month.
const dayMonthFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", timeZone: "UTC" })

// One row of either list: the title, and the date it was written on the right.
// Notes kept only as an archive year have nothing to put there, and the year
// heading above them already says as much.
//
// The date is a scanning aid rather than part of the entry's name, so it stays
// out of the accessible name: "Designing Matcha, button" beats reading a row as
// "Designing Matcha oh one slash oh nine", and the note's own header announces
// the full date the moment it opens.
function WritingEntry({ writing, ref, onClick }: { writing: Writing; ref?: (node: HTMLButtonElement | null) => void; onClick: () => void }) {
  return (
    <button type="button" className="writing-entry-trigger" onClick={onClick} ref={ref}>
      <span className="writing-entry-title">{writing.title}</span>
      {writing.publishedAt ? (
        <time className="writing-entry-date" dateTime={writing.publishedAt} aria-hidden="true">{dayMonthFormat.format(noteDate(writing.publishedAt))}</time>
      ) : null}
    </button>
  )
}

// The opener is passed in so the sheet flies out of the control that was
// actually used: the header's Notes button is nowhere near the mosaic tile.
export type WritingsFolderHandle = { openFolder: (opener?: HTMLElement | null) => void }

export function WritingsReader({ onOpenChange, ref, triggerRef }: { onOpenChange?: (open: boolean) => void; ref?: Ref<WritingsFolderHandle>; triggerRef: RefObject<HTMLButtonElement | null> }) {
  const playOpen = useSound(openSound, { volume: 0.3 })
  const playNext = useSound(nextSound, { volume: 0.26 })
  const playBack = useSound(backSound, { volume: 0.26 })
  const prefersReducedMotion = usePrefersReducedMotion()
  const { itemId: writingId, selectItem: selectWriting, clearItem: clearWriting } = usePortfolioItemUrl("writing")
  const [folderOpen, setFolderOpen] = useState(false)
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
  const open = folderOpen || Boolean(activeWriting)
  // Retain the article during the modal exit, as the project gallery does.
  const reading = Boolean(activeWriting) || (!folderOpen && selectedId !== null)
  if (activeWriting && selectedId !== activeWriting.id) setSelectedId(activeWriting.id)
  const selected = writings.find((writing) => writing.id === selectedId)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const focusTitleOnRead = useRef(true)
  const readerRef = useRef<HTMLDivElement>(null)
  const archiveRef = useRef<HTMLDivElement>(null)
  // Callback refs, not useRef: the popup lives in a portal that mounts a
  // commit after `open` flips, so the height effect has to re-run when these
  // nodes actually attach rather than when the dialog is asked to open.
  const [pagesEl, setPagesEl] = useState<HTMLDivElement | null>(null)
  const [toolbarEl, setToolbarEl] = useState<HTMLElement | null>(null)
  const [popupEl, setPopupEl] = useState<HTMLDivElement | null>(null)
  // Whatever opened the sheet, when it was not the tile itself.
  const openerRef = useRef<HTMLElement | null>(null)
  // Held off for a frame after the sheet opens so its first height lands
  // without a transition -- see the .writings-pages rule.
  const [sized, setSized] = useState(false)
  const notesRef = useRef<HTMLHeadingElement>(null)
  const entryRefs = useRef(new Map<string, HTMLButtonElement>())
  const groups = groupWritingsByYear(writings)
  const orderedWritings = groups.flatMap(({ entries }) => entries)
  const drawings = archiveDrawings(orderedWritings)

  useEffect(() => {
    // History can close or replace a note without going through a dialog control.
    if (!open || !reading || (switchWritingId.current !== null && switchWritingId.current !== writingId)) cancelSwitch()
  }, [open, reading, writingId, cancelSwitch])

  useEffect(() => () => {
    window.clearTimeout(switchTimer.current)
    if (switchFrame.current !== undefined) window.cancelAnimationFrame(switchFrame.current)
  }, [])

  useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  // The Notes link in the page header opens this same folder, and a Base UI
  // trigger only works inside its own root, so the open runs through a handle
  // instead. It goes through here rather than a bare setState so an outside
  // opener gets the tile's latch sound too.
  useImperativeHandle(ref, () => ({
    openFolder(opener) {
      if (open) return
      openerRef.current = opener ?? null
      playOpen()
      setFolderOpen(true)
    },
  }), [open, playOpen])

  useEffect(() => {
    if (!open) return
    if (reading) {
      readerRef.current?.scrollTo({ top: 0 })
      if (focusTitleOnRead.current) titleRef.current?.focus({ preventScroll: true })
    } else if (selectedId) {
      entryRefs.current.get(selectedId)?.focus({ preventScroll: true })
    }
    // Both pages stay mounted and keep their own offsets, so the divider has to
    // be read off whichever one just came forward rather than left as it was.
    setScrolled(((reading ? readerRef : archiveRef).current?.scrollTop ?? 0) > 0)
  }, [selectedId, reading, open])

  // The sheet is as tall as the page in front of it: the archive stops at its
  // last row, and opening a note grows it to the article. Only the content
  // height is measured here -- the clamp against the room the viewport leaves
  // is CSS, so 100dvh and the safe-area insets stay in the stylesheet. The
  // observers catch a note whose images settle after it is already forward.
  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setSized(false)
      return
    }
    const content = (reading ? readerRef : archiveRef).current?.firstElementChild
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
  }, [open, reading, selectedId, pagesEl, toolbarEl])

  // The sheet grows out of the control that opened it and shrinks back into it,
  // the way a project preview grows out of its card: same geometry, same two
  // curves, so moving between the two modals is one motion vocabulary rather
  // than a travelling surface and a surface that only scales in place. The
  // anchor is read live at both ends, so a sheet opened from the tile and
  // closed after scrolling it away falls back to the plain lift.
  const { run: runOriginTravel } = useOriginTravel({
    node: popupEl,
    getOriginRect: () => visibleOriginRect(openerRef.current ?? triggerRef.current),
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
    setFolderOpen(false)
    selectWriting(id, writingId !== null)
  }

  function moveWriting(direction: -1 | 1, pointerTarget?: HTMLButtonElement) {
    const index = orderedWritings.findIndex((writing) => writing.id === selectedId)
    if (!reading || index < 0 || orderedWritings.length <= 1 || switchPhase !== "idle") return
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

  function returnToNotes() {
    if (!reading) return
    cancelSwitch()
    playBack()
    setFolderOpen(true)
    clearWriting()
  }


  return (
    <Dialog.Root open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) cancelSwitch()
        // Only the tile can open the sheet through here, so it is the anchor
        // again until the next outside opener names itself.
        if (nextOpen) openerRef.current = null
        if (nextOpen && !open) playOpen()
        setFolderOpen(nextOpen)
        if (!nextOpen && writingId !== null) clearWriting()
      }}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) setSelectedId(null)
      }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="writings-backdrop" />
        <Dialog.Popup data-switch-phase={switchPhase} data-switch-direction={switchDirection} ref={setPopupEl}
          finalFocus={() => openerRef.current ?? triggerRef.current}
          initialFocus={reading ? titleRef : notesRef} data-reading={reading} data-scrolled={scrolled} data-sized={sized}
          data-origin-motion={prefersReducedMotion ? undefined : "true"}
          onKeyDown={(event) => {
            if (!reading || orderedWritings.length <= 1 || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
            if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
            event.preventDefault()
            moveWriting(event.key === "ArrowLeft" ? -1 : 1)
          }}
          className={(state) => `writings-dialog t-modal ${state.transitionStatus === "starting" ? "" : state.open ? "is-open" : "is-closing"}`}>
          <header className="writings-toolbar" ref={setToolbarEl}>
            <div className="writings-toolbar-leading">
              <button type="button" className="preview-gallery-nav writings-back" aria-label="Go back to Notes" onClick={returnToNotes}
                data-visible={reading} aria-hidden={!reading} inert={!reading}>
                <ChevronLeft className="preview-gallery-nav-icon preview-gallery-nav-icon-prev" aria-hidden="true" />
              </button>
              <Dialog.Title ref={notesRef} tabIndex={-1} className="writings-toolbar-title">Notes</Dialog.Title>
            </div>
          </header>
          <Dialog.Description className="sr-only">{reading ? "Read this note. Use the back button to return to the list, or the previous and next buttons or left and right arrow keys to browse notes." : "Choose a note, grouped by year."}</Dialog.Description>
          <div className="writings-pages t-page-slide" data-page={reading ? "2" : "1"} ref={setPagesEl}>
            <div className="writings-scroll t-page" data-page-id="2" ref={readerRef} aria-hidden={!reading} inert={!reading}
              onScroll={(event) => { if (reading) setScrolled(event.currentTarget.scrollTop > 0) }}>
              {selected ? (
                <WritingArticle key={selected.id} writing={selected} titleRef={titleRef}
                  showLikes={open && reading} onSelectWriting={readWriting} />
              ) : null}
            </div>
            <div className="writings-scroll t-page" data-page-id="1" ref={archiveRef} aria-hidden={reading} inert={reading}
              onScroll={(event) => { if (!reading) setScrolled(event.currentTarget.scrollTop > 0) }}>
              <div className="writings-archive">
                <div className="writings-list">
                  {groups.map(({ year, entries }) => (
                    <section className="writings-year" key={year} aria-label={year}>
                      <h3>{year}</h3>
                      <ul>{entries.map((writing) => {
                        const drawing = drawings.get(orderedWritings.indexOf(writing))
                        return (
                        <li key={writing.id}>
                          {drawing ? <ArchiveDrawing drawing={drawing} /> : null}
                          <WritingEntry writing={writing} onClick={() => readWriting(writing.id)}
                            ref={(node) => { if (node) entryRefs.current.set(writing.id, node); else entryRefs.current.delete(writing.id) }} />
                        </li>
                        )
                      })}</ul>
                    </section>
                  ))}
                  {writings.length === 0 ? <p className="writings-empty">More words soon.</p> : null}
                </div>
              </div>
            </div>
          </div>
          <div className="writings-navigation" role="group" aria-label="Note navigation">
            <button type="button" className="preview-gallery-nav writings-note-nav writings-note-nav-prev" aria-label="Previous note" aria-keyshortcuts="ArrowLeft" onClick={(event) => moveWriting(-1, event.detail > 0 ? event.currentTarget : undefined)} disabled={!reading || orderedWritings.length <= 1}>
              <ChevronLeft className="preview-gallery-nav-icon preview-gallery-nav-icon-prev" aria-hidden="true" />
            </button>
            <button type="button" className="preview-gallery-nav writings-note-nav writings-note-nav-next" aria-label="Next note" aria-keyshortcuts="ArrowRight" onClick={(event) => moveWriting(1, event.detail > 0 ? event.currentTarget : undefined)} disabled={!reading || orderedWritings.length <= 1}>
              <ChevronRight className="preview-gallery-nav-icon preview-gallery-nav-icon-next" aria-hidden="true" />
            </button>
            <Dialog.Close className="preview-gallery-nav writings-mobile-close" aria-label="Close writings"><X className="preview-gallery-nav-icon" aria-hidden="true" /></Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
