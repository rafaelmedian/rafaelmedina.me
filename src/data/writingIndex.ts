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
    id: "skills-i-reach-for",
    title: "Skills for craft and code",
    category: "Tools",
    description: "The skills I keep installed for interface details, building, and getting a change through review.",
    publishedAt: "2026-09-17",
  },
  {
    id: "review-ready-pull-requests",
    title: "Make pull requests easier to review",
    category: "Tools",
    description: "A good PR keeps the why, the proof, and the history in one place. I wrote a small skill so I stop skipping it.",
    publishedAt: "2026-09-11",
  },
  {
    id: "project-context-in-markdown",
    title: "My project context is moving into Markdown",
    category: "Notes",
    description: "The context behind my tasks, design decisions, and bugs keeps ending up in Markdown files that both an agent and I read. Also, how a status file goes stale.",
    publishedAt: "2026-09-07",
  },
  {
    id: "ai-design-needs-control",
    title: "AI design needs more control",
    category: "Notes",
    description: "Building a design you can already see: the first 60% flies, the next 30% is saying 'no, not like that,' and the last 10% feels like god mode.",
    publishedAt: "2026-07-29",
  },
  {
    id: "building-it-yourself-isnt-free",
    title: "Building it yourself still costs something",
    category: "Notes",
    description: "Paying for a tool or generating your own? Count the tokens, the time, and the upkeep. The first version won't tell you what it's like to live with.",
    publishedAt: "2026-06-16",
  },
  {
    id: "room-to-figure-it-out",
    title: "Room to figure it out",
    category: "Notes",
    description: "How much room do you get to practice being on your own while you still have people to fall back on? On leaving home and staying close.",
    publishedAt: "2026-05-21",
  },
  {
    id: "a-song-we-all-know",
    title: "A song we all know",
    category: "Notes",
    description: "Everyone gets their own perfect soundtrack now. What happens to the song you could bring up without playing it first?",
    publishedAt: "2026-04-08",
  },
  {
    id: "designing-matcha",
    title: "Designing Matcha",
    category: "Notes",
    description: "A swap fits in a small box. The product around it doesn't. Designing Matcha's homepage, token pages, wallets, trade module, mobile, and dark mode at the 0x Project.",
    publishedAt: "2026-03-02",
    social: { src: "/Projects/shot-small-16-poster.webp", alt: "Matcha discovery homepage with token search and market overview", width: 640, height: 480 },
  },
  {
    id: "designing-for-active-traders",
    title: "Designing for active traders",
    category: "Notes",
    description: "Matcha Pro puts live charts, token signals, transactions, and orders on one screen. Designing for density without losing people.",
    publishedAt: "2026-02-10",
  },
  {
    id: "quote-to-confirmation",
    title: "From quote to confirmation",
    category: "Notes",
    description: "The moment before you sign needs a little space. Designing the step from entering a trade to reviewing it in Matcha.",
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
