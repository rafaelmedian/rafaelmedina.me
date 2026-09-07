import { useEffect } from "react"
import { collaborators, siteLinks, type PortfolioCard } from "../data/portfolio"
import { isVideoSource } from "../lib/media"
import { updatePageMetadata } from "../lib/projectMetadata"

/** Direct project visits have useful HTML even without hydration or a modal. */
export function ProjectPage({ card }: { card: PortfolioCard }) {
  useEffect(() => updatePageMetadata(card), [card])
  const team = [collaborators.rafael, ...(card.team ?? [])]

  return (
    <article className="standalone-page">
      <nav aria-label="Project navigation" className="standalone-nav">
        <a href="/#work">All work</a>
        <a href={`mailto:${siteLinks.email}`}>Contact Rafael</a>
      </nav>
      <header>
        <h1 className="standalone-title">{card.title}</h1>
        <p className="standalone-description">{card.detail}</p>
      </header>
      <div className="standalone-media">
        {isVideoSource(card.image) ? (
          <video src={card.image} poster={card.previewPoster} width={card.previewWidth}
            height={card.previewHeight} controls playsInline muted preload="none" aria-label={card.title} />
        ) : (
          <img src={card.image} width={card.previewWidth} height={card.previewHeight}
            alt={card.title} decoding="async" fetchPriority="high" />
        )}
      </div>
      <dl className="preview-gallery-details">
        {[
          ["Role", card.role], ["Outcome", card.outcome],
          ["Product", card.product ?? card.title], ["Industry", card.industry ?? "Product Design"],
        ].map(([label, value]) => (
          <div className="preview-gallery-detail-row" key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
        <div className="preview-gallery-detail-row">
          <dt>Team</dt>
          <dd>{team.map((person, index) => (
            <span key={person.href}>{index > 0 ? ", " : ""}<a href={person.href}>{person.name}</a></span>
          ))}</dd>
        </div>
        {card.ctaHref.startsWith("https://") ? (
          <div className="preview-gallery-detail-row"><dt>Link</dt><dd><a href={card.ctaHref}>{new URL(card.ctaHref).hostname}</a></dd></div>
        ) : null}
      </dl>
    </article>
  )
}
