import { renderToString } from "react-dom/server"

import App from "./App"
import { loadWritingPage } from "./lib/writingPageSlot"
import { portfolioCards } from "./data/portfolio"
import { writingSummaries } from "./data/writingIndex"
import { notesPath, pageMetadata, projectPath, resumeItemId, resumePath, writingPath, writingsItemId } from "./lib/projectMetadata"

/**
 * The note article lives in its own chunk on the client, so the prerender has
 * to have it in hand before it can write those pages out. It is a promise
 * rather than a top-level await: the chunk imports back into this module for
 * the page metadata, and awaiting it here would deadlock the cycle.
 */
export const ready = loadWritingPage()

export const pages = [
  { pathname: "/", metadata: pageMetadata() },
  { pathname: resumePath, metadata: pageMetadata(resumeItemId) },
  { pathname: notesPath, metadata: pageMetadata(writingsItemId) },
  ...portfolioCards.map(card => ({ pathname: projectPath(card), metadata: pageMetadata(card) })),
  ...writingSummaries.map(writing => ({ pathname: writingPath(writing), metadata: pageMetadata(writing) })),
]

export function render(pathname = "/") {
  return renderToString(<App pathname={pathname} />)
}
