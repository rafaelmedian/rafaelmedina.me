// How long a pointer has to rest on a trigger before its card opens. Long
// enough that a cursor crossing the contact row on its way to the grid never
// flashes a card it was not aimed at; short enough that a deliberate hover
// still feels immediate. Close delays stay with each trigger: they are grace
// for the pointer's trip into the card, not intent.

/** Small hints: the reaction cards, the work-history chips, the activity card. */
export const HINT_OPEN_DELAY_MS = 160

/** Rich profile cards, which carry more to read and cover more of the page. */
export const RICH_CARD_OPEN_DELAY_MS = 260
