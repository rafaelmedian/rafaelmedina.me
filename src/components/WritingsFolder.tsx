import { Dialog } from "@base-ui/react/dialog"
import { useSound } from "@web-kits/audio/react"
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type CSSProperties, type Ref } from "react"


import { writings, type Writing, type WritingAnnotation, type WritingCode, type WritingImage } from "../data/writings"
import { backSound, nextSound, openSound } from "../lib/sounds"
import { groupWritingsByYear } from "../lib/writings"
import { usePortfolioItemUrl } from "../lib/portfolioUrl"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { useOriginTravel, visibleOriginRect } from "../lib/originMotion"
import { cssTimeToMilliseconds } from "../lib/cssTime"


// A note is written as plain strings, and backticks are the one piece of markup
// they carry: file names and paths, which read quieter than the sentence holding
// them. Everything that prints a paragraph goes through here so the tile's
// miniature pages never show the ticks themselves.
// The sheet measures itself before it paints, and it only ever renders on the
// client, but the component itself is server-rendered.
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

function inlineProse(text: string) {
  return text.split(/`([^`]+)`/).map((part, index) => (index % 2 ? <code className="writing-code" key={index}>{part}</code> : part))
}

// The reader's pencil marks are pictures, not paths. A bezier written by hand
// draws one clean stroke of even weight, which is the one thing a pencil never
// does; these are rendered with Rough.js in scripts/build-writing-marks.mjs,
// which retraces every line with randomised bowing, and shipped as PNGs from
// public/writings/marks. They are black on transparent and used as masks, so
// they still take their colour from the text they sit beside.
const MARK_VARIANTS = ["a", "b", "c"]

// Everything about a note that varies -- which mark it wears, how far it drops,
// which rail it sits on, how far it tilts -- comes off this. It is a hash of
// the note's own text rather than a random number, because the page is
// prerendered: the server and the browser have to agree, and a note should keep
// the place it had the last time someone read it.
function noteHash(text: string) {
  let hash = 0
  for (let index = 0; index < text.length; index += 1) hash = (Math.imul(hash, 31) + text.charCodeAt(index)) | 0
  return Math.abs(hash)
}

const pickFrom = <T,>(choices: readonly T[], hash: number, digit: number) =>
  choices[Math.floor(hash / 7 ** digit) % choices.length]

// How far a note drops into its paragraph, which rail it sits on, and how far
// it leans. Notes that shared one offset drew a second column down each edge;
// spread over these they read as written into the gutter at different moments.
// The lift stays under three lines so a note cannot fall past the paragraph it
// belongs to and land against the next one's.
const NOTE_LIFTS = ["0em", "0.5em", "1.1em", "1.7em", "2.3em", "2.9em"]
const NOTE_GAPS = ["0.45rem", "0.6rem", "0.75rem", "0.9rem", "1.05rem"]
const NOTE_TILTS = ["-2.4deg", "-1.6deg", "-0.9deg", "0.9deg", "1.6deg", "2.4deg"]
// A bracket is drawn at the height of the note it holds, so the mask is never
// stretched by more than the line the estimate missed by. About twenty
// characters fit a 122px gutter line at --text-xs, which is the gutter from
// 1320px up; below that the gutter narrows and a long note runs a line past
// this, which is the miss the mask is sized to absorb.
const NOTE_CHARS_PER_LINE = 20

// A gutter note: a drawn bracket holding the passage, and the handwriting
// beside it. It is absolutely positioned next to its paragraph once the modal
// is wide enough to have gutters, so it lives inside the paragraph and reads
// after it rather than interrupting the sentence.
function MarginNote({ annotation }: { annotation: WritingAnnotation }) {
  const hash = noteHash(annotation.text)
  const lines = Math.min(4, Math.max(1, Math.ceil(annotation.text.length / NOTE_CHARS_PER_LINE)))
  const mark = `bracket-${lines}-${pickFrom(MARK_VARIANTS, hash, 0)}`
  return (
    <span className="writing-margin-note" data-place={annotation.place ?? "right"} style={{
      "--writing-mark": `url("/writings/marks/${mark}.png")`,
      "--writing-note-lift": pickFrom(NOTE_LIFTS, hash, 1),
      "--writing-note-gap": pickFrom(NOTE_GAPS, hash, 2),
      "--writing-note-tilt": pickFrom(NOTE_TILTS, hash, 3),
    } as CSSProperties}>
      <span className="writing-margin-note-bracket" aria-hidden="true" />
      <span className="writing-margin-note-label">{annotation.text}</span>
    </span>
  )
}

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

// One drawing every few rows rather than one per year: a year with seven notes
// under it would otherwise carry a single mark at the top and leave the rest of
// the gutter bare. Sides alternate so no two are drawn against each other, and
// the three objects cycle, so the list has to pass ten notes before one repeats.
function ArchiveDrawing({ index }: { index: number }) {
  const place = index % 2 ? "right" : "left"
  const object = ARCHIVE_DRAWINGS[index % ARCHIVE_DRAWINGS.length]
  return (
    <span className="writings-drawing" data-place={place} data-lift={index % 3} aria-hidden="true"
      style={{ "--writings-drawing-mark": `url("/writings/marks/drawing-${object}.png")` } as CSSProperties} />
  )
}

// Rows a drawing is pinned to, counted across the whole list rather than within
// a year, so the spacing holds when a year has one note in it.
const DRAWING_EVERY = 3

// The one code sample in the reader, and it is Markdown, which the article it
// sits in is about. That is narrow enough to tokenise here rather than pull in
// a highlighter: the grammar below is the part of Markdown a note actually
// uses, and everything it does not recognise falls through as plain text.
//
// Five token kinds, and the stylesheet gives each one a hue: a code block is
// the one place on this site that carries colour, because a reader arrives at
// one already knowing what coloured code means and reads the structure faster
// for it than they would from weight alone.
type CodeToken = { text: string; kind?: "mark" | "strong" | "literal" | "link" }

// Backticked spans, bold, and links. Each alternative keeps its delimiters in
// its own group so they can be dimmed away from the content they wrap.
const INLINE_MARKDOWN = /(`)([^`]+)(`)|(\*\*)([^*]+)(\*\*)|(\[)([^\]]+)(\]\()([^)]+)(\))/g

function inlineMarkdown(text: string): CodeToken[] {
  const tokens: CodeToken[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_MARKDOWN)) {
    if (match.index > last) tokens.push({ text: text.slice(last, match.index) })
    const [, tick, code, tickEnd, stars, bold, starsEnd, open, label, middle, href, close] = match
    if (tick) tokens.push({ text: tick, kind: "mark" }, { text: code, kind: "literal" }, { text: tickEnd, kind: "mark" })
    else if (stars) tokens.push({ text: stars, kind: "mark" }, { text: bold, kind: "strong" }, { text: starsEnd, kind: "mark" })
    else tokens.push({ text: open, kind: "mark" }, { text: label, kind: "literal" },
      { text: middle, kind: "mark" }, { text: href, kind: "link" }, { text: close, kind: "mark" })
    last = match.index + match[0].length
  }
  if (last < text.length) tokens.push({ text: text.slice(last) })
  return tokens
}

// A heading is emphasis for its whole line; a bullet or a quote only marks its
// opening, and what follows is ordinary inline Markdown.
function markdownTokens(line: string): CodeToken[] {
  const heading = /^(#{1,6} )(.*)$/.exec(line)
  if (heading) return [{ text: heading[1], kind: "mark" }, { text: heading[2], kind: "strong" }]
  const led = /^(\s*(?:[-*+] |\d+\. |> ))(.*)$/.exec(line)
  if (led) return [{ text: led[1], kind: "mark" }, ...inlineMarkdown(led[2])]
  return inlineMarkdown(line)
}

// The newline rides inside each line's span rather than the span being a block:
// `white-space: pre` is what breaks the lines, so a blank entry still gets a
// line box, and selecting the sample copies it back out with its breaks.
function NoteCode({ code }: { code: WritingCode }) {
  return (
    <figure className="writing-code-figure">
      <pre className="writing-code-block"><code>
        {code.lines.map((line, index) => (
          <span className="writing-code-line" key={index}>
            {markdownTokens(line).map((token, position) => (
              <span data-code={token.kind} key={position}>{token.text}</span>
            ))}
            {"\n"}
          </span>
        ))}
      </code></pre>
      {code.caption ? <figcaption>{code.caption}</figcaption> : null}
    </figure>
  )
}

// Prose plus its marginalia. Paragraph order is unchanged: a note rides inside
// the paragraph it belongs to and hangs in the gutter beside it, so nothing
// ever comes between one paragraph and the next.
function NoteProse({ paragraphs, annotations }: { paragraphs: string[]; annotations?: WritingAnnotation[] }) {
  return paragraphs.map((paragraph, index) => (
    <p key={index}>
      {inlineProse(paragraph)}
      {annotations?.filter((annotation) => annotation.at === index).map((annotation) => (
        <MarginNote annotation={annotation} key={annotation.text} />
      ))}
    </p>
  ))
}

// Dates are stored as plain YYYY-MM-DD, so they are read at UTC midnight rather
// than in the reader's zone, where a western offset would roll them back a day.
const noteDate = (publishedAt: string) => new Date(`${publishedAt}T00:00:00Z`)
const fullDateFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
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

function NoteImage({ image }: { image: WritingImage }) {
  return (
    <figure className="writing-reader-figure">
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  )
}

// The opener is passed in so the sheet flies out of the control that was
// actually used: the header's Notes button is nowhere near the mosaic tile.
export type WritingsFolderHandle = { openFolder: (opener?: HTMLElement | null) => void }

export function WritingsFolder({ onOpenChange, ref }: { onOpenChange?: (open: boolean) => void; ref?: Ref<WritingsFolderHandle> }) {
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
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  // Whatever opened the sheet, when it was not the tile itself.
  const openerRef = useRef<HTMLElement | null>(null)
  // Held off for a frame after the sheet opens so its first height lands
  // without a transition -- see the .writings-pages rule.
  const [sized, setSized] = useState(false)
  const notesRef = useRef<HTMLHeadingElement>(null)
  const entryRefs = useRef(new Map<string, HTMLButtonElement>())
  const groups = groupWritingsByYear(writings)
  const orderedWritings = groups.flatMap(({ entries }) => entries)
  const moreWritings = orderedWritings.filter((writing) => writing.id !== selectedId).slice(0, 3)

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
      <Dialog.Trigger className="writings-tile" aria-label="Open writings folder" ref={triggerRef}>
        <span className="writings-folder" aria-hidden="true">
          <img className="writings-folder-back" src="/writings/folder-back.png" alt="" width={237} height={200} loading="lazy" />
          {writings.slice(0, 3).map((writing) => (
            <span className="writings-paper" key={writing.id}>
              <span className="writings-paper-content">
                <strong>{writing.title}</strong>
                {writing.paragraphs.map((paragraph, index) => <span key={index}>{inlineProse(paragraph)}</span>)}
              </span>
            </span>
          ))}
          <span className="writings-folder-front"><img src="/writings/folder-front.png" alt="" width={149} height={133} loading="lazy" /></span>
        </span>
        <span className="writings-tile-label">Writings &amp; notes</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="writings-backdrop" />
        <Dialog.Popup data-switch-phase={switchPhase} data-switch-direction={switchDirection} ref={setPopupEl}
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
              <article className="writing-reader" key={selected.id}>
                <header className="writing-reader-header">
                  <div className="writing-reader-date">
                    {selected.publishedAt ? (
                      <time dateTime={selected.publishedAt}>{fullDateFormat.format(noteDate(selected.publishedAt))}</time>
                    ) : <span>{selected.archiveYear ? `Archive · ${selected.archiveYear}` : "Undated"}</span>}
                  </div>
                  <h2 ref={titleRef} tabIndex={-1} className="writings-page-title">{selected.title}</h2>
                </header>
                {selected.cover ? <NoteImage image={selected.cover} /> : null}
                <div className="writing-reader-prose">
                  <NoteProse paragraphs={selected.paragraphs} annotations={selected.annotations} />
                  {selected.code ? <NoteCode code={selected.code} /> : null}
                  {selected.image ? <NoteImage image={selected.image} /> : null}
                  {selected.sections?.map((section) => (
                    <section className="writing-reader-section" key={section.heading}>
                      <h3>{section.heading}</h3>
                      <NoteProse paragraphs={section.paragraphs} annotations={section.annotations} />
                      {section.code ? <NoteCode code={section.code} /> : null}
                      {section.image ? <NoteImage image={section.image} /> : null}
                    </section>
                  ))}
                  {selected.href ? <a href={selected.href} target="_blank" rel="noreferrer">Read original article <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
                </div>
                {selected.acknowledgements ? (
                  <section className="writing-acknowledgements" aria-label="Acknowledgements">
                    <h3>Acknowledgements</h3>
                    <p>{inlineProse(selected.acknowledgements)}</p>
                  </section>
                ) : null}
                {moreWritings.length > 0 ? (
                  <section className="writing-more" aria-label="More articles">
                    <h3>More articles</h3>
                    <ul>{moreWritings.map((writing) => (
                      <li key={writing.id}>
                        <WritingEntry writing={writing} onClick={() => readWriting(writing.id)} />
                      </li>
                    ))}</ul>
                  </section>
                ) : null}
              </article>
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
                        const row = orderedWritings.indexOf(writing)
                        return (
                        <li key={writing.id}>
                          {row % DRAWING_EVERY === 0 ? <ArchiveDrawing index={row / DRAWING_EVERY} /> : null}
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
