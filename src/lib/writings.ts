import type { Writing } from "../data/writings"

export function writingYear(writing?: Writing) {
  return writing?.publishedAt?.slice(0, 4) || writing?.archiveYear?.toString() || "Undated"
}

/** Publication dates or archive years sort newest first; undated notes go last. */
export function groupWritingsByYear(writings: readonly Writing[]) {
  const groups = new Map<string, Writing[]>()
  const sortDate = (writing: Writing) => writing.publishedAt ?? writing.archiveYear?.toString() ?? ""
  const sorted = [...writings].sort((a, b) => sortDate(b).localeCompare(sortDate(a)))
  for (const writing of sorted) {
    const year = writingYear(writing)
    const entries = groups.get(year) ?? []
    entries.push(writing)
    groups.set(year, entries)
  }
  return [...groups].map(([year, entries]) => ({ year, entries }))
}
