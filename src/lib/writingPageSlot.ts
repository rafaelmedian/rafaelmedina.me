import type { WritingPage } from "../components/WritingPage"

/**
 * A note's own page is the one standalone article the main bundle does not
 * carry: `writings.ts` is 34KB of prose, and a visitor who came for the grid
 * never reads a word of it.
 *
 * It is held in a slot rather than behind `lazy`, because `lazy` suspends on
 * its first render however warm its import is, and a suspended boundary where
 * the server rendered an article throws that article away. `main.tsx` fills
 * this before it hydrates a `/notes/` document and `entry-server` fills it
 * before it prerenders one, so both passes render the same markup. A fetch that
 * fails leaves it empty and the visit falls through to the feed, which is where
 * the URL was heading a commit later anyway.
 */
let loaded: typeof WritingPage | null = null

export const getWritingPage = () => loaded

export async function loadWritingPage() {
  loaded = (await import("../components/WritingPage")).WritingPage
}
