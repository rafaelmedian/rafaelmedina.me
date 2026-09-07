// Shared by the article data and likes API; keep IDs stable to preserve saved likes.
export const writingIds = [
  "project-context-in-markdown",
  "ai-design-needs-control",
  "building-it-yourself-isnt-free",
  "room-to-figure-it-out",
  "a-song-we-all-know",
  "designing-matcha",
  "quote-to-confirmation",
  "protector-booking",
  "starting-with-discovery",
  "designing-for-active-traders",
  "keeping-wallet-context",
  "trading-on-a-small-screen",
  "building-a-dark-theme",
  "discovery-through-people",
] as const

export type WritingId = typeof writingIds[number]
