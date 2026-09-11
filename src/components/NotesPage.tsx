import { useEffect } from "react"

import { siteLinks } from "../data/portfolio"
import { updatePageMetadata, writingsItemId } from "../lib/projectMetadata"
import { WritingsArchive } from "./WritingsArchive"

/**
 * `/notes/` without hydration, and the markup the first client pass matches
 * before the gallery takes the URL over: the same list the notes slide shows,
 * with each row an ordinary link to the note's own page.
 */
export function NotesPage() {
  useEffect(() => updatePageMetadata(writingsItemId), [])

  return (
    <div className="standalone-page standalone-notes writings-surface">
      <nav aria-label="Notes navigation" className="standalone-nav">
        <a href="/#work">All work</a>
        <a href={`mailto:${siteLinks.email}`}>Contact Rafael</a>
      </nav>
      <header>
        <h1 className="standalone-title">Notes</h1>
        <p className="standalone-description">Notes and small tools about design, software, and working with agents.</p>
      </header>
      <WritingsArchive />
    </div>
  )
}
