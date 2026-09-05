import { Fragment, useEffect, useRef } from "react"

import { cvEducation, cvExperience } from "../data/cv"
import type { CvExperience } from "../data/cv"
import type { SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { PersonalPhotos } from "./PersonalPhotos"

type AboutPanelProps = {
  links: SiteLinks
}

const hobbies = [
  { emoji: "🥊", label: "Kickboxing" },
  { emoji: "🚵", label: "Mountain biking" },
  { emoji: "🏊", label: "Lap swimming" },
  { emoji: "🥾", label: "Hiking" },
  { emoji: "💃", label: "Salsa", learning: true },
  { emoji: "🥋", label: "Jiu jitsu", learning: true },
]

function ResumeCompanyLink({ company, href }: { company: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mosaic-company-inline-link"
    >
      <span className="mosaic-company-inline-name">{company}</span>
    </a>
  )
}

function getCompanyLabel(job: CvExperience) {
  if (!job.clients) return job.company

  const clientNames = job.clients.map((client) => client.name)
  const clients =
    clientNames.length > 1
      ? `${clientNames.slice(0, -1).join(", ")}, and ${clientNames.at(-1)}`
      : clientNames[0]

  return `${job.company} (${clients})`
}

function ResumeCompany({ job }: { job: CvExperience }) {
  const clients = job.clients

  if (clients) {
    return (
      <>
        <span>{job.company} (</span>
        {clients.map((client, index) => (
          <Fragment key={client.name}>
            {index > 0 ? (index === clients.length - 1 ? ", and " : ", ") : null}
            <ResumeCompanyLink company={client.name} href={client.href} />
          </Fragment>
        ))}
        <span>)</span>
      </>
    )
  }

  if (job.href) {
    return <ResumeCompanyLink company={job.company} href={job.href} />
  }

  return <span>{job.company}</span>
}

export function AboutPanel({ links }: AboutPanelProps) {
  const panelRef = useRef<HTMLElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  // The copy blocks ship visible — the attribute is empty in the prerendered
  // markup, so nothing depends on JavaScript. On mount, blocks still below
  // the fold are held transparent and released with the shared intro rise the
  // first time they scroll into the sheet. Besides continuity with the hero
  // and mosaic entrances, the fade buys the sheet's composited layer a beat
  // to rasterise fresh text tiles behind intent instead of as a late paint.
  useEffect(() => {
    const panel = panelRef.current
    // The shared hook hydrates from false, so consult the live query before
    // its first effect-driven update can reach this effect.
    const reducedMotionEnabled =
      prefersReducedMotion ||
      (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    if (!panel || reducedMotionEnabled) return
    if (!("IntersectionObserver" in window)) return

    // Scroll restoration can land mid-sheet; anything already on screen (or
    // above it) stays put and only content still below the fold animates.
    const blocks = [...panel.querySelectorAll<HTMLElement>("[data-about-fade]")].filter((block) => {
      if (block.dataset.aboutFade === "in") return false
      if (block.getBoundingClientRect().top > window.innerHeight) return true

      // Reduced motion can leave an observed block pending while the user
      // scrolls it into view. Retire that marker before motion is restored so
      // removing the media-query override cannot hide content they have seen.
      if (block.dataset.aboutFade === "pending") block.removeAttribute("data-about-fade")
      return false
    })
    if (blocks.length === 0) return

    // The top margin stretches the root far above the viewport so an instant
    // jump (a nav link, a hard fling) that skips a block past the trigger
    // line still counts as entering — otherwise the skipped block would stay
    // transparent until it re-entered from above. Blocks arriving in the same
    // batch cascade top-down on a short stagger so the sheet reads in order —
    // but only blocks actually on screen join the cascade. The first visible
    // block always starts at 0ms and skipped offscreen blocks reveal
    // instantly, so a jump never lands on a blank page waiting its turn.
    const observer = new IntersectionObserver(
      (entries) => {
        const arrivals = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        let visibleIndex = 0
        for (const entry of arrivals) {
          const block = entry.target as HTMLElement
          const rect = entry.boundingClientRect
          const onScreen = rect.bottom > 0 && rect.top < window.innerHeight
          // Capped at five steps: past ~300ms of total stagger the last block
          // reads as late rather than sequenced, and a tall viewport can batch
          // more blocks than a short one.
          const staggerStep = Math.min(visibleIndex, 5)
          block.style.setProperty("--about-fade-delay", `${onScreen ? staggerStep * 60 : 0}ms`)
          if (onScreen) visibleIndex += 1
          block.dataset.aboutFade = "in"
          observer.unobserve(block)
        }
      },
      { rootMargin: "9999px 0px -8% 0px" },
    )

    for (const block of blocks) {
      block.dataset.aboutFade = "pending"
      observer.observe(block)
    }
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <article
      id="about-panel"
      ref={panelRef}
      className="mosaic-about"
      tabIndex={-1}
      aria-label="About Rafael Medina"
    >
      <h2 className="sr-only">About Rafael Medina</h2>
      <div className="mosaic-about-panel">
        <div className="mosaic-about-body">
          <section
            id="about-section"
            className="mosaic-about-section mosaic-about-section-intro"
            aria-labelledby="about-section-heading"
          >
            <div className="mosaic-about-section-copy" data-about-fade="">
              <h2 id="about-section-heading" className="mosaic-about-lede">
                About me
              </h2>
              <p>
                I design the complicated parts of products people prefer not to think about. I figure out
                what to build, test it with real people, and prototype in code because working interactions
                answer questions faster than static mockups.
              </p>
              <p>
                When I&rsquo;m not working, I&rsquo;m probably kickboxing, swimming, riding a bike, or being humbled
                by salsa and jiu jitsu.
              </p>

              <ul className="mosaic-about-hobbies">
                {hobbies.map((hobby) => (
                  <li key={hobby.label}>
                    <span className="mosaic-about-hobby-emoji" aria-hidden="true">
                      {hobby.emoji}
                    </span>
                    {hobby.label}
                    {hobby.learning ? (
                      <span className="mosaic-about-hobby-note"> (learning)</span>
                    ) : null}
                  </li>
                ))}
              </ul>

              {/* The address is spelled out here as persistent text; the hero
                  copy action also exposes it in a pointer tooltip. */}
              <p className="mosaic-about-closing">
                Building something? Email me at{" "}
                <a
                  href={`mailto:${links.email}`}
                  className="mosaic-about-link"
                  onClick={() => {
                    trackEvent("social_link_click", {
                      social_label: "Email",
                      social_href: `mailto:${links.email}`,
                      social_placement: "about_panel",
                    })
                  }}
                >
                  {links.email}
                </a>
                .
              </p>
            </div>

            <PersonalPhotos />
          </section>

          <section
            id="about-panel-resume"
            className="mosaic-about-section mosaic-about-work-history"
            aria-labelledby="about-work-history-heading"
          >
            <div className="mosaic-about-work-history-copy">
              <h2
                id="about-work-history-heading"
                className="mosaic-about-section-heading"
                data-about-fade=""
              >
                Work history
              </h2>
              <ol className="mosaic-about-resume mosaic-about-work-list">
                {cvExperience.map((job) => (
                  <li
                    key={`${job.company}-${job.dates}`}
                    className="mosaic-about-resume-entry mosaic-about-work-entry"
                    data-about-fade=""
                  >
                    <p className="mosaic-about-resume-dates">{job.dates}</p>
                    <div className="mosaic-about-resume-details">
                      <h3
                        className="mosaic-about-resume-title"
                        aria-label={`${job.role} at ${getCompanyLabel(job)}`}
                      >
                        {job.role} at <ResumeCompany job={job} />
                      </h3>
                      <p className="mosaic-about-resume-location">{job.location}</p>
                      <p className="mosaic-about-resume-description">{job.highlight}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mosaic-about-resume-education">
                <h3 className="mosaic-about-resume-heading" data-about-fade="">
                  Education
                </h3>
                <ul className="mosaic-about-resume mosaic-about-education-list">
                  {cvEducation.map((school) => (
                    <li
                      key={school.school}
                      className="mosaic-about-resume-entry mosaic-about-work-entry"
                      data-about-fade=""
                    >
                      <p className="mosaic-about-resume-dates">{school.dates}</p>
                      <div className="mosaic-about-resume-details">
                        <h4
                          className="mosaic-about-resume-title"
                          aria-label={`${school.credential} at ${school.school}`}
                        >
                          {school.credential} at <span>{school.school}</span>
                        </h4>
                        <p className="mosaic-about-resume-location">{school.location}</p>
                        {school.details ? (
                          <p className="mosaic-about-resume-description">{school.details}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Same term and behavior as the corner "Resume" link: one
                  artifact, one verb. The browser's PDF viewer keeps its own
                  download button for people who want the file. */}
              <p className="mosaic-about-resume-download" data-about-fade="">
                <a
                  href={links.resumePdf}
                  target="_blank"
                  rel="noreferrer"
                  className="mosaic-about-link"
                  onClick={() => {
                    trackEvent("social_link_click", {
                      social_label: "View Resume",
                      social_href: links.resumePdf,
                      social_placement: "about_panel",
                    })
                  }}
                >
                  View resume (PDF)
                </a>
              </p>
            </div>

          </section>
        </div>
      </div>
    </article>
  )
}
