import { Dialog } from "@base-ui/react/dialog"
import { useSound } from "@web-kits/audio/react"
import { ArrowUpRight, ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react"


import { writings, type WritingImage } from "../data/writings"
import { backSound, nextSound, openSound } from "../lib/sounds"
import { groupWritingsByYear, writingYear } from "../lib/writings"
import { usePortfolioItemUrl } from "../lib/useProjectUrl"

// Match the project gallery’s sideways paging beat; CSS receives the same duration.
const writingSwitchMs = 190

function NoteImage({ image }: { image: WritingImage }) {
  return (
    <figure className="writing-reader-figure">
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  )
}

export function WritingsFolder({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const playOpen = useSound(openSound, { volume: 0.3 })
  const playNext = useSound(nextSound, { volume: 0.26 })
  const playBack = useSound(backSound, { volume: 0.26 })
  const { itemId: writingId, selectItem: selectWriting, clearItem: clearWriting } = usePortfolioItemUrl("writing")
  const [folderOpen, setFolderOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
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
  const activeWriting = writings.find((writing) => writing.id === writingId)
  const open = folderOpen || Boolean(activeWriting)
  // Retain the article during the modal exit, as the project gallery does.
  const reading = Boolean(activeWriting) || (!folderOpen && selectedId !== null)
  if (activeWriting && selectedId !== activeWriting.id) setSelectedId(activeWriting.id)
  const selected = writings.find((writing) => writing.id === selectedId)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const focusTitleOnRead = useRef(true)
  const readerRef = useRef<HTMLDivElement>(null)
  const notesRef = useRef<HTMLButtonElement>(null)
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

  useEffect(() => {
    if (!open) return
    if (reading) {
      readerRef.current?.scrollTo({ top: 0 })
      if (focusTitleOnRead.current) titleRef.current?.focus({ preventScroll: true })
    } else if (selectedId) {
      entryRefs.current.get(selectedId)?.focus({ preventScroll: true })
    }
  }, [selectedId, reading, open])

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
        if (nextOpen && !open) playOpen()
        setFolderOpen(nextOpen)
        if (!nextOpen && writingId !== null) clearWriting()
      }}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) { setSelectedId(null); setExpanded(false) }
      }}>
      <Dialog.Trigger className="writings-tile" aria-label="Open writings folder">
        <span className="writings-folder" aria-hidden="true">
          <img className="writings-folder-back" src="/writings/folder-back.png" alt="" width={237} height={200} loading="lazy" />
          {writings.slice(0, 3).map((writing) => (
            <span className="writings-paper" key={writing.id}>
              <span className="writings-paper-content">
                <strong>{writing.title}</strong>
                {writing.paragraphs.map((paragraph, index) => <span key={index}>{paragraph}</span>)}
              </span>
            </span>
          ))}
          <span className="writings-folder-front"><img src="/writings/folder-front.png" alt="" width={149} height={133} loading="lazy" /></span>
        </span>
        <span className="writings-tile-label">Writings &amp; notes</span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="writings-backdrop" />
        <Dialog.Popup data-switch-phase={switchPhase} data-switch-direction={switchDirection}
          style={{ "--writings-switch-duration": `${writingSwitchMs}ms` } as CSSProperties}
          initialFocus={reading ? titleRef : notesRef} data-reading={reading} data-expanded={expanded}
          onKeyDown={(event) => {
            if (!reading || orderedWritings.length <= 1 || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
            if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
            event.preventDefault()
            moveWriting(event.key === "ArrowLeft" ? -1 : 1)
          }}
          className={(state) => `writings-dialog t-modal ${state.transitionStatus === "starting" ? "" : state.open ? "is-open" : "is-closing"}`}>
          <header className="writings-toolbar">
            <div className="writings-toolbar-leading">
              <nav aria-label="Breadcrumb" className="writings-breadcrumbs">
                <ol>
                  <li><Dialog.Title className="writings-toolbar-title"><button ref={notesRef} type="button" onClick={returnToNotes}>Notes</button></Dialog.Title></li>
                  <li className="writings-year-crumb" data-visible={reading} aria-hidden={!reading} inert={!reading}>
                    <ChevronRight size={14} aria-hidden="true" />
                    <button type="button" className="writings-breadcrumb-button" onClick={returnToNotes}>{writingYear(selected)}</button>
                  </li>
                </ol>
              </nav>
            </div>
          </header>
          <Dialog.Description className="sr-only">{reading ? "Read this note. Use the breadcrumbs to return to the list, or the previous and next buttons or left and right arrow keys to browse notes." : "Choose a note, grouped by year."}</Dialog.Description>
          <div className="writings-pages t-page-slide" data-page={reading ? "2" : "1"}>
            <div className="writings-scroll t-page" data-page-id="2" ref={readerRef} aria-hidden={!reading} inert={!reading}>
              {selected ? (
              <article className="writing-reader" key={selected.id}>
                <header className="writing-reader-header">
                  <div className="writing-reader-date">
                    {selected.publishedAt ? (
                      <time dateTime={selected.publishedAt}>{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${selected.publishedAt}T00:00:00Z`))}</time>
                    ) : <span>{selected.archiveYear ? `Archive · ${selected.archiveYear}` : "Undated"}</span>}
                  </div>
                  <h2 ref={titleRef} tabIndex={-1} className="writings-page-title">{selected.title}</h2>
                </header>
                {selected.cover ? <NoteImage image={selected.cover} /> : null}
                <div className="writing-reader-prose">
                  {selected.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  {selected.image ? <NoteImage image={selected.image} /> : null}
                  {selected.sections?.map((section) => (
                    <section className="writing-reader-section" key={section.heading}>
                      <h3>{section.heading}</h3>
                      {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                      {section.image ? <NoteImage image={section.image} /> : null}
                    </section>
                  ))}
                  {selected.href ? <a href={selected.href} target="_blank" rel="noreferrer">Read original article <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
                </div>
                {moreWritings.length > 0 ? (
                  <section className="writing-more" aria-label="More articles">
                    <h3>More articles</h3>
                    <ul>{moreWritings.map((writing) => (
                      <li key={writing.id}>
                        <button type="button" className="writing-entry-trigger" onClick={() => readWriting(writing.id)}>
                          {writing.title}
                        </button>
                      </li>
                    ))}</ul>
                  </section>
                ) : null}
              </article>
              ) : null}
            </div>
            <div className="writings-scroll t-page" data-page-id="1" aria-hidden={reading} inert={reading}>
              <div className="writings-archive">
                <div className="writings-list">
                  {groups.map(({ year, entries }) => (
                    <section className="writings-year" key={year} aria-label={year}>
                      <h3>{year}</h3>
                      <ul>{entries.map((writing) => (
                        <li key={writing.id}>
                          <button type="button" className="writing-entry-trigger" onClick={() => readWriting(writing.id)}
                            ref={(node) => { if (node) entryRefs.current.set(writing.id, node); else entryRefs.current.delete(writing.id) }}>
                            {writing.title}
                          </button>
                        </li>
                      ))}</ul>
                    </section>
                  ))}
                  {writings.length === 0 ? <p className="writings-empty">More words soon.</p> : null}
                </div>
              </div>
            </div>
          </div>
          <div className="writings-navigation" role="group" aria-label="Note navigation">
            <button type="button" className="preview-gallery-nav writings-expand-nav" aria-label={expanded ? "Restore modal size" : "Expand modal"}
              title={expanded ? "Restore modal size" : "Expand modal"} aria-pressed={expanded} onClick={() => setExpanded((current) => !current)}>
              {expanded ? <Minimize2 className="preview-gallery-nav-icon" aria-hidden="true" /> : <Maximize2 className="preview-gallery-nav-icon" aria-hidden="true" />}
            </button>
            <button type="button" className="preview-gallery-nav writings-note-nav writings-note-nav-prev" aria-label="Previous note" aria-keyshortcuts="ArrowLeft" onClick={(event) => moveWriting(-1, event.detail > 0 ? event.currentTarget : undefined)} disabled={!reading || orderedWritings.length <= 1}>
              <ChevronLeft className="preview-gallery-nav-icon" aria-hidden="true" />
            </button>
            <button type="button" className="preview-gallery-nav writings-note-nav writings-note-nav-next" aria-label="Next note" aria-keyshortcuts="ArrowRight" onClick={(event) => moveWriting(1, event.detail > 0 ? event.currentTarget : undefined)} disabled={!reading || orderedWritings.length <= 1}>
              <ChevronRight className="preview-gallery-nav-icon" aria-hidden="true" />
            </button>
            <Dialog.Close className="preview-gallery-nav writings-mobile-close" aria-label="Close writings"><X className="preview-gallery-nav-icon" aria-hidden="true" /></Dialog.Close>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
