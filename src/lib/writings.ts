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

// Everything about a note that varies -- which mark it wears, how far it drops,
// which rail it sits on, how far it tilts -- comes off this. It is a hash of
// the note's own text rather than a random number, because the page is
// prerendered: the server and the browser have to agree, and a note should keep
// the place it had the last time someone read it. The reader's marginalia and
// the archive's drawings are dealt from the same two, so they live here rather
// than in either component.
export function noteHash(text: string) {
  let hash = 0
  for (let index = 0; index < text.length; index += 1) hash = (Math.imul(hash, 31) + text.charCodeAt(index)) | 0
  return Math.abs(hash)
}

export const pickFrom = <T,>(choices: readonly T[], hash: number, digit: number) =>
  choices[Math.floor(hash / 7 ** digit) % choices.length]
