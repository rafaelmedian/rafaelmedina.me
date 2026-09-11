import type { WritingId } from "./writingIds"

export type WritingCategory = "Tools" | "Notes" | "Misc"

/**
 * Every note's name, date, and blurb, without the article behind it.
 *
 * The notes are gallery items now -- they page with the projects and the
 * résumé, and each one owns `/notes/<id>/` -- so the sequence, the URLs, and
 * the social metadata are all needed on the first paint. The prose is not:
 * `writings.ts` is 34KB of it and belongs in the chunk that renders an article,
 * not in the bundle that draws the grid. This is the half that has to be eager,
 * and `writings.ts` builds its entries from these so a title or a date is only
 * ever written once.
 */
export type WritingSummary = {
  id: WritingId
  title: string
  /** The archive section this entry belongs to. */
  category: WritingCategory
  /** The blurb a shared `/notes/<id>/` link previews with. */
  description: string
  /** Publication or editorial edition date, YYYY-MM-DD. */
  publishedAt?: string
  /** Year grouping for sample notes without an exact publication date. */
  archiveYear?: number
  /** The note's cover, when it has one, as its social card. */
  social?: { src: string; alt: string; width: number; height: number }
}

// Newest first, the order `writings.ts` declares its articles in.
export const writingSummaries = [
  {
    id: "review-ready-pull-requests",
    title: "Make pull requests easier to review",
    category: "Tools",
    description: "A review-ready pull request keeps its reasoning, proof, and history together — and a small skill can make that care repeatable.",
    publishedAt: "2026-09-11",
  },
  {
    id: "project-context-in-markdown",
    title: "My project context is moving into Markdown",
    category: "Notes",
    description: "Why the history behind a task, a design decision, and a bug keeps ending up in Markdown files an agent and I can both read — and how a status file becomes another place to forget things.",
    publishedAt: "2026-09-07",
  },
  {
    id: "ai-design-needs-control",
    title: "AI design needs more control",
    category: "Notes",
    description: "Building a design you can already see, in code, in three stretches: the first 60% flies, the next 30% is saying 'no, not like that,' and the final 10% feels like god mode.",
    publishedAt: "2026-07-29",
  },
  {
    id: "building-it-yourself-isnt-free",
    title: "Building it yourself still costs something",
    category: "Notes",
    description: "Tokens, time, and upkeep belong in the comparison between paying for a tool and generating one. A note on what the first working version doesn't tell you about living with it.",
    publishedAt: "2026-06-16",
  },
  {
    id: "room-to-figure-it-out",
    title: "Room to figure it out",
    category: "Notes",
    description: "How much room does someone get to practise independence while they still have support? A note on leaving home, staying close, and who deals with what follows a decision.",
    publishedAt: "2026-05-21",
  },
  {
    id: "a-song-we-all-know",
    title: "A song we all know",
    category: "Notes",
    description: "Personalised discovery gives everyone a better soundtrack for themselves. A note on what happens to the overlap — the song you could mention without playing a clip first.",
    publishedAt: "2026-04-08",
  },
  {
    id: "designing-matcha",
    title: "Designing Matcha",
    category: "Notes",
    description: "A swap fits in a small rectangle; the product around it does not. Designing Matcha's homepage, token pages, wallets, trade module, mobile, and dark theme at the 0x Project.",
    publishedAt: "2026-03-02",
    social: { src: "/Projects/shot-small-16-poster.webp", alt: "Matcha discovery homepage with token search and market overview", width: 640, height: 480 },
  },
  {
    id: "designing-for-active-traders",
    title: "Designing for active traders",
    category: "Notes",
    description: "Matcha Pro puts live charts, token signals, transactions, and order management in one workspace. A note on designing density so people keep finding what they came back for.",
    publishedAt: "2026-02-10",
  },
  {
    id: "quote-to-confirmation",
    title: "From quote to confirmation",
    category: "Notes",
    description: "The moment before signing deserves some space. A note on the handoff from entering a trade to reviewing it, and on quote, fee, route, and transaction states in Matcha.",
    publishedAt: "2025-11-12",
    social: { src: "/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg", alt: "Matcha trade module showing the quote, review, and confirmation interface", width: 1600, height: 1200 },
  },
] satisfies WritingSummary[]

export function writingSummary(id: WritingId): WritingSummary {
  const summary = writingSummaries.find(entry => entry.id === id)
  if (!summary) throw new Error(`Missing writing summary: ${id}`)
  return summary
}

/**
 * The fields an article carries itself. The blurb and the social card are the
 * shared link's business, not the reader's, so they stay out of the spread.
 */
export function writingFields(id: WritingId) {
  const { description, social, ...fields } = writingSummary(id)
  void description
  void social
  return fields
}
