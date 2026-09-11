import { collaborators, type PortfolioCard } from "../data/portfolio"
import { ArticleContents } from "./ArticleContents"
import { buildPreviewSrcSet } from "../lib/media"
import { useId } from "react"

export function ProjectCaseStudy({ card }: { card: PortfolioCard }) {
  const signatureId = useId()
  const caseStudy = card.caseStudy
  if (!caseStudy) return null
  const signatures = [collaborators.rafael, ...(card.team ?? [])]

  return (
    <section className="project-case-study" aria-labelledby={`${card.id}-case-study-title`}>
      <div className="project-case-study-layout">
        {caseStudy.sections.length > 1 ? <ArticleContents label="Case study contents" revealAfter={`${card.id}-case-study-section-1`}
          sections={caseStudy.sections.map((section, index) => ({
            id: `${card.id}-case-study-section-${index + 1}`, heading: section.heading,
          }))} /> : null}

        <div className="project-case-study-body">
          <header className="project-case-study-heading">
            <h2 id={`${card.id}-case-study-title`}>{caseStudy.title}</h2>
            <ul className="project-case-study-introduction project-case-study-list">
              {caseStudy.introduction.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </header>

          <div className="project-case-study-sections">
            {caseStudy.sections.map((section, index) => (
              <section
                className="project-case-study-section"
                id={`${card.id}-case-study-section-${index + 1}`}
                tabIndex={-1}
                key={section.heading}
              >
                <div className="project-case-study-copy">
                  <h3>{section.heading}</h3>
                  <ul className="project-case-study-list">
                    {section.paragraphs.map((paragraph) => <li key={paragraph}>{paragraph}</li>)}
                  </ul>
                </div>
                {section.media?.length ? (
                  <div className="project-case-study-media" data-layout={section.media.length === 1 ? "feature" : "pair"}>
                    {section.media.map((item) => {
                      const srcSet = buildPreviewSrcSet(item.source, item.width)
                      return (
                        <figure key={item.source}>
                          <img
                            src={item.source}
                            srcSet={srcSet}
                            sizes={srcSet ? section.media?.length === 1
                              ? "(max-width: 699px) calc(100vw - 2.5rem), 36rem"
                              : "(max-width: 699px) calc(100vw - 2.5rem), 18rem" : undefined}
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

          {caseStudy.showSignatures ? <footer className="project-case-study-signatures" aria-label="Signatures">
            {signatures.map((person, index) => (
              <a href={person.href} target="_blank" rel="noreferrer" key={person.href}
                aria-label={person.name}
                data-signature={person.href === collaborators.rafael.href ? "rafael" : undefined}>
                <svg viewBox="0 0 160 56" aria-hidden="true" focusable="false">
                  <defs>
                    <path id={`${signatureId}-${index}`} d={index === 0 ? "M 8 33 Q 76 21 151 29" : "M 8 27 Q 75 38 151 25"} />
                  </defs>
                  <text><textPath href={`#${signatureId}-${index}`}>{person.name}</textPath></text>
                  <path className="project-signature-underline"
                    d={index === 0 ? "M 9 43 C 38 46 90 35 137 38 C 142 38 145 39 143 40" : "M 8 39 C 40 48 83 43 117 39 M 21 45 Q 67 49 106 42"} />
                </svg>
              </a>
            ))}
          </footer> : null}
        </div>
      </div>
    </section>
  )
}
