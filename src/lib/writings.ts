import type { WritingCategory } from "../data/writingIndex"

type CategorizedWriting = { category: WritingCategory; publishedAt?: string; archiveYear?: number }

export const writingCategoryOrder = ["Tools", "Notes", "Misc"] as const satisfies readonly WritingCategory[]

/** Categories keep a fixed editorial order; entries inside them are newest first. */
export function groupWritingsByCategory<T extends CategorizedWriting>(writings: readonly T[]) {
  const groups = new Map<WritingCategory, T[]>()
  const sortDate = (writing: T) => writing.publishedAt ?? writing.archiveYear?.toString() ?? ""
  for (const category of writingCategoryOrder) {
    const entries = writings.filter((writing) => writing.category === category)
      .sort((a, b) => sortDate(b).localeCompare(sortDate(a)))
    if (entries.length) groups.set(category, entries)
  }
  return [...groups].map(([category, entries]) => ({ category, entries }))
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
