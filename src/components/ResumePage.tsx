import { useEffect } from "react"
import { ArrowUpRight } from "lucide-react"

import { siteLinks } from "../data/portfolio"
import { resumeItemId, updatePageMetadata } from "../lib/projectMetadata"
import { ResumeContent } from "./ResumeContent"

/**
 * `/resume/` without hydration, and the markup the first client pass matches
 * before the gallery takes the URL over. A project page is the same idea: the
 * shared link has to answer for itself in HTML, so a crawler and a visitor
 * whose JavaScript never arrives still read the whole history.
 */
export function ResumePage() {
  useEffect(() => updatePageMetadata(resumeItemId), [])

  return (
    <article className="standalone-page standalone-resume">
      <nav aria-label="Résumé navigation" className="standalone-nav">
        <a href="/#work">All work</a>
        <a href={`mailto:${siteLinks.email}`}>Contact Rafael</a>
      </nav>
      <header>
        <h1 className="standalone-title">Résumé</h1>
        <p className="standalone-description">
          Ten years of product design across web3, fintech, and consumer products.
        </p>
      </header>
      <div className="standalone-resume-body mosaic-about-body">
        <ResumeContent level={2} />
        <p className="mosaic-about-resume-download">
          <a href={siteLinks.resumePdf} target="_blank" rel="noreferrer" className="mosaic-about-link">
            View resume PDF <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </p>
      </div>
    </article>
  )
}
