import { type PortfolioCard } from "../data/portfolio"
import { resumeItemId } from "./projectMetadata"

/**
 * What the preview gallery pages through. The grid is not all projects -- the
 * folded CV sheet sits in the portraits group among them -- and a visitor arrowing across the
 * gallery expects to meet whatever the grid has, in the order the grid has it.
 * So the sequence is items rather than cards, and the résumé is one of them.
 */
export type GalleryItem =
  | { kind: "project"; id: string; card: PortfolioCard }
  | { kind: "resume"; id: typeof resumeItemId }

export const resumeGalleryItem = { kind: "resume", id: resumeItemId } as const

export function projectGalleryItem(card: PortfolioCard): GalleryItem {
  return { kind: "project", id: card.id, card }
}

/** The reader's heading, and the accessible name of its slide. */
export const resumeItemTitle = "Work history"

export function galleryItemTitle(item: GalleryItem) {
  return item.kind === "resume" ? resumeItemTitle : item.card.title
}
