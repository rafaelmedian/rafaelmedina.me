import { useSound } from "@web-kits/audio/react"
import { useRef, type PointerEvent } from "react"

import { writingSummaries, type WritingSummary } from "../data/writingIndex"
import { archiveDate } from "../lib/writingDate"
import { writingPath } from "../lib/projectMetadata"
import { keyClickSounds } from "../lib/sounds"
import { groupWritingsByCategory } from "../lib/writings"

// One row of either list: the title, and the date it was written on the right.
// Notes kept only as an archive year have no exact date to put there.
//
// The date is a scanning aid rather than part of the entry's name, so it stays
// out of the accessible name: "Designing Matcha, link" beats reading a row as
// "Designing Matcha Sep 1", and the note's own header announces
// the full date the moment it opens.
function WritingEntry({ writing, busy, onClick }: {
  writing: WritingSummary
  busy?: boolean
  onClick?: (trigger: HTMLAnchorElement) => void
}) {
  const date = writing.publishedAt ? (
    <time className="writing-entry-date" dateTime={writing.publishedAt} aria-hidden="true">{archiveDate(writing.publishedAt)}</time>
  ) : null
  return (
    <a className="writing-entry-trigger" href={writingPath(writing)} data-writing-id={writing.id}
      onClick={event => {
        if (!onClick || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        onClick(event.currentTarget)
      }} aria-busy={busy || undefined}>
      <span className="writing-entry-title">{writing.title}</span>
      {date}
    </a>
  )
}

// Under the gallery's open sound (0.3) and its paging (0.26): this one plays
// on every row the pointer crosses.
const KEY_CLICK_VOLUME = { volume: 0.15 }
// The shortest gap between two keys. A fast sweep down the list crosses a row
// every 20ms or so, and at that rate the clicks fuse into a buzz; held apart
// by this much it still reads as someone typing quickly.
const KEY_CLICK_GAP_MS = 45

/**
 * A key click for each row the mouse moves onto. It listens to movement rather
 * than to rows being entered, because a list scrolled under a still pointer
 * enters rows too, and a wheel through the archive would otherwise rattle off
 * a key per title it passed. A touch or pen press already answers with the
 * note opening, so only a mouse plays. Before the visitor has pressed anything
 * the page may not start audio at all, so nothing is asked of it until then --
 * a shared /notes/ link opens this list with no press behind it.
 */
function useRowKeyClicks() {
  const plays = [
    useSound(keyClickSounds[0], KEY_CLICK_VOLUME),
    useSound(keyClickSounds[1], KEY_CLICK_VOLUME),
    useSound(keyClickSounds[2], KEY_CLICK_VOLUME),
  ]
  const hovered = useRef<Element | null>(null)
  const last = useRef({ at: -Infinity, key: 0 })

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse" || (event.movementX === 0 && event.movementY === 0)) return
    const row = event.target instanceof Element ? event.target.closest(".writing-entry-trigger") : null
    if (row === hovered.current) return
    hovered.current = row
    if (!row || event.timeStamp - last.current.at < KEY_CLICK_GAP_MS) return
    if (navigator.userActivation?.hasBeenActive === false) return
    // Any key but the one just struck, so two rows in a row never sound alike.
    const key = (last.current.key + 1 + Math.floor(Math.random() * (plays.length - 1))) % plays.length
    last.current = { at: event.timeStamp, key }
    plays[key]()
  }
  const onPointerLeave = () => { hovered.current = null }
  return { onPointerMove, onPointerLeave }
}

type WritingsArchiveProps = {
  /**
   * Open a nested note within the gallery; the static `/notes/` page has no dialog, so its
   * rows are ordinary links to each note's own address.
   */
  onSelectWriting?: (id: string, trigger: HTMLAnchorElement) => void
  /** The note whose reader is on its way, while its chunk downloads. */
  pendingId?: string | null
  /** What to say under the heading while a reader fails to arrive. */
  status?: string | null
}

/**
 * Every entry by category. It is the folder's slide in the preview gallery -- at the place the folder tile
 * occupies on the grid, so the arrow keys walk from a project into the notes
 * and out the other side -- and the `/notes/` a crawler reads instead.
 */
export function WritingsArchive({ onSelectWriting, pendingId, status }: WritingsArchiveProps) {
  const groups = groupWritingsByCategory(writingSummaries)
  // Only the gallery's list types: the standalone page is what a crawler, or
  // a visitor without JavaScript, reads.
  const keyClicks = useRowKeyClicks()

  return (
    <div className="writings-archive">
      {status ? <p className="writings-status" role="status">{status}</p> : null}
      <div className="writings-list" {...(onSelectWriting ? keyClicks : null)}>
        {groups.map(({ category, entries }) => (
          <section className="writings-category" key={category} aria-label={category}>
            <h3>{category}</h3>
            <ul>{entries.map((writing) => (
              <li key={writing.id}>
                <WritingEntry writing={writing} busy={pendingId === writing.id}
                  onClick={onSelectWriting ? (trigger) => onSelectWriting(writing.id, trigger) : undefined} />
              </li>
            ))}</ul>
          </section>
        ))}
        {writingSummaries.length === 0 ? <p className="writings-empty">More words soon.</p> : null}
      </div>
    </div>
  )
}
