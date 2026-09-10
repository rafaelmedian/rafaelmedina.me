import { useEffect } from "react"

import { siteLinks } from "../data/portfolio"
import type { WritingSummary } from "../data/writingIndex"
import { writings } from "../data/writings"
import { updatePageMetadata } from "../lib/projectMetadata"
import { WritingArticle } from "./WritingArticle"

/**
 * `/notes/<id>/` without hydration, and the markup the first client pass
 * matches before the reader takes the URL over. A project page and the résumé
 * are the same idea: the shared link has to answer for itself in HTML, so a
 * crawler and a visitor whose JavaScript never arrives still read the whole
 * note.
 *
 * This module is fetched rather than bundled -- see `lib/writingPageSlot`. The
 * articles behind it are 34KB of prose that only a visit to a note needs.
 */
export function WritingPage({ writing }: { writing: WritingSummary }) {
  useEffect(() => updatePageMetadata(writing), [writing])
  const article = writings.find((entry) => entry.id === writing.id)

  return (
    <div className="standalone-page standalone-writing">
      <nav aria-label="Note navigation" className="standalone-nav">
        <a href="/#work">All work</a>
        <a href={`mailto:${siteLinks.email}`}>Contact Rafael</a>
      </nav>
      {article ? <WritingArticle writing={article} heading="h1" /> : (
        <header>
          <h1 className="standalone-title">{writing.title}</h1>
          <p className="standalone-description">{writing.description}</p>
        </header>
      )}
    </div>
  )
}
