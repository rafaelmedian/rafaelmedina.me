import { type PortfolioCard } from "../data/portfolio"
import { resumeItemId, writingsItemId } from "./projectMetadata"

/**
 * What the preview gallery pages through. The grid is not all projects -- the
 * folded CV sheet sits in the portraits group among them, and the notes folder
 * on the first row -- and a visitor arrowing across the gallery expects to meet
 * whatever the grid has, in the order the grid has it. So the sequence is items
 * rather than cards, and the résumé and the folder are among them.
 *
 * The folder's slide has a nested article view. Notes keep their own URLs,
 * but share the gallery's dialog, backdrop and controls; Back returns to
 * the list and restores outer-gallery paging.
 */
export type GalleryItem =
  | { kind: "project"; id: string; card: PortfolioCard }
  | { kind: "resume"; id: typeof resumeItemId }
  | { kind: "writings"; id: typeof writingsItemId }

export const resumeGalleryItem = { kind: "resume", id: resumeItemId } as const
export const writingsGalleryItem = { kind: "writings", id: writingsItemId } as const

export function projectGalleryItem(card: PortfolioCard): GalleryItem {
  return { kind: "project", id: card.id, card }
}

/** The reader's heading, and the accessible name of its slide. */
export const resumeItemTitle = "Résumé"

/** The list's heading, and the accessible name of its slide. */
export const writingsItemTitle = "Notes"

export function galleryItemTitle(item: GalleryItem) {
  if (item.kind === "resume") return resumeItemTitle
  if (item.kind === "writings") return writingsItemTitle
  return item.card.title
}
