import type { PortfolioCard } from "../data/portfolio"
import { buildPreviewSrcSet } from "../lib/media"

export function ProjectCaseStudy({ card }: { card: PortfolioCard }) {
  const caseStudy = card.caseStudy
  if (!caseStudy) return null

  return (
    <section className="project-case-study" aria-labelledby={`${card.id}-case-study-title`}>
      <header className="project-case-study-heading">
        <p className="project-case-study-kicker">
          <span>{caseStudy.label}</span>
          <span>{caseStudy.period}</span>
        </p>
        <h2 id={`${card.id}-case-study-title`}>{caseStudy.title}</h2>
        <p>{caseStudy.introduction}</p>
      </header>

      <div className="project-case-study-sections">
        {caseStudy.sections.map((section) => (
          <section className="project-case-study-section" key={section.heading}>
            <div className="project-case-study-copy">
              <h3>{section.heading}</h3>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {section.media?.length ? (
              <div className="project-case-study-media" data-count={section.media.length}>
                {section.media.map((item) => {
                  const srcSet = buildPreviewSrcSet(item.source, item.width)
                  return (
                    <figure key={item.source}>
                      <img
                        src={item.source}
                        srcSet={srcSet}
                        sizes={srcSet ? "(max-width: 699px) calc(100vw - 5rem), 22rem" : undefined}
                        alt={item.label}
                        width={item.width}
                        height={item.height}
                        loading="lazy"
                        decoding="async"
                      />
                      <figcaption>{item.label}</figcaption>
                    </figure>
                  )
                })}
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  )
}
