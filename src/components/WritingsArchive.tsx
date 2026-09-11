import { type CSSProperties } from "react"

import { writingSummaries, type WritingSummary } from "../data/writingIndex"
import { writingPath } from "../lib/projectMetadata"
import { groupWritingsByYear, noteHash, pickFrom } from "../lib/writings"

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
function archiveDrawings(rows: readonly WritingSummary[]) {
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
// A list row sits under its own year heading, so it only carries month and day.
const monthDayFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

// One row of either list: the title, and the date it was written on the right.
// Notes kept only as an archive year have nothing to put there, and the year
// heading above them already says as much.
//
// The date is a scanning aid rather than part of the entry's name, so it stays
// out of the accessible name: "Designing Matcha, button" beats reading a row as
// "Designing Matcha Sep 1", and the note's own header announces
// the full date the moment it opens.
function WritingEntry({ writing, busy, onClick }: {
  writing: WritingSummary
  busy?: boolean
  onClick?: (trigger: HTMLButtonElement) => void
}) {
  const date = writing.publishedAt ? (
    <time className="writing-entry-date" dateTime={writing.publishedAt} aria-hidden="true">{monthDayFormat.format(noteDate(writing.publishedAt))}</time>
  ) : null
  if (!onClick) {
    return (
      <a className="writing-entry-trigger" href={writingPath(writing)}>
        <span className="writing-entry-title">{writing.title}</span>
        {date}
      </a>
    )
  }
  return (
    <button type="button" className="writing-entry-trigger" data-writing-id={writing.id}
      onClick={(event) => onClick?.(event.currentTarget)} aria-busy={busy || undefined}>
      <span className="writing-entry-title">{writing.title}</span>
      {date}
    </button>
  )
}


type WritingsArchiveProps = {
  /**
   * Open a nested note within the gallery; the static `/notes/` page has no dialog, so its
   * rows are ordinary links to each note's own address.
   */
  onSelectWriting?: (id: string, trigger: HTMLButtonElement) => void
  /** The note whose reader is on its way, while its chunk downloads. */
  pendingId?: string | null
  /** What to say under the heading while a reader fails to arrive. */
  status?: string | null
}

/**
 * Every note by year, with the pencil objects in the gutters beside them. It is
 * the folder's slide in the preview gallery -- at the place the folder tile
 * occupies on the grid, so the arrow keys walk from a project into the notes
 * and out the other side -- and the `/notes/` a crawler reads instead.
 */
export function WritingsArchive({ onSelectWriting, pendingId, status }: WritingsArchiveProps) {
  const groups = groupWritingsByYear(writingSummaries)
  const orderedWritings = groups.flatMap(({ entries }) => entries)
  const drawings = archiveDrawings(orderedWritings)

  return (
    <div className="writings-archive">
      {status ? <p className="writings-status" role="status">{status}</p> : null}
      <div className="writings-list">
        {groups.map(({ year, entries }) => (
          <section className="writings-year" key={year} aria-label={year}>
            <h3>{year}</h3>
            <ul>{entries.map((writing) => {
              const drawing = drawings.get(orderedWritings.indexOf(writing))
              return (
                <li key={writing.id}>
                  {drawing ? <ArchiveDrawing drawing={drawing} /> : null}
                  <WritingEntry writing={writing} busy={pendingId === writing.id}
                    onClick={onSelectWriting ? (trigger) => onSelectWriting(writing.id, trigger) : undefined} />
                </li>
              )
            })}</ul>
          </section>
        ))}
        {writingSummaries.length === 0 ? <p className="writings-empty">More words soon.</p> : null}
      </div>
    </div>
  )
}
