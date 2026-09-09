import { useEffect, useRef } from "react"

import type { SiteLinks } from "../data/portfolio"
import { services } from "../data/services"
import { trackEvent } from "../lib/analytics"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { CompanyLogoGrid } from "./CompanyLogoGrid"
import { InlineBookingLink } from "./InlineBookingLink"
import { LocalTimeCard } from "./LocalTimeCard"

type AboutPanelProps = {
  links: SiteLinks
  localTimeLabel: string
}

const hobbies = [
  { emoji: "🥊", label: "Kickboxing" },
  { emoji: "🚵", label: "Mountain biking" },
  { emoji: "🏊", label: "Lap swimming" },
  { emoji: "🥾", label: "Hiking" },
  { emoji: "💃", label: "Salsa", learning: true },
  { emoji: "🥋", label: "Jiu jitsu", learning: true },
]

export function AboutPanel({ links, localTimeLabel }: AboutPanelProps) {
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

              {/* Where I am, in the section that is already about who I am.
                  The hero says the two cities; this says which one it is
                  tonight, and the map behind it says the rest. */}
              <LocalTimeCard timeLabel={localTimeLabel} reducedMotion={prefersReducedMotion} />

              {/* The address is spelled out here as persistent text; the corner
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
          </section>

          {/* The dated entries this used to introduce now live in the résumé
              reader, so the marks stand on their own: they are the fastest
              answer to "who has he worked with", and a visitor who wants the
              engagement behind a name they recognise opens the résumé for it.
              Not a table-of-contents stop. */}
          <section
            className="mosaic-about-section mosaic-about-companies"
            aria-labelledby="about-companies-heading"
          >
            <div className="mosaic-about-companies-copy">
              <h2
                id="about-companies-heading"
                className="mosaic-about-section-heading"
                data-about-fade=""
              >
                Worked with
              </h2>
              <div data-about-fade="">
                <CompanyLogoGrid />
              </div>
            </div>
          </section>

          {/* The sheet spends everything above this on what I have already
              done. This is the one block that says what can be bought and how
              to start it, so it closes the page rather than sitting between
              the work history entries a reader is still scanning. */}
          <section
            id="about-panel-services"
            tabIndex={-1}
            className="mosaic-about-section mosaic-about-services"
            aria-labelledby="about-services-heading"
          >
            <div className="mosaic-about-services-copy">
              <h2
                id="about-services-heading"
                className="mosaic-about-section-heading"
                data-about-fade=""
              >
                Services
              </h2>
              <p data-about-fade="">
                I take on a small number of client projects alongside my own product work. Three
                shapes, depending on how much of the problem is still open.
              </p>

              <ul className="mosaic-about-resume mosaic-about-services-list">
                {services.map((service) => (
                  <li
                    key={service.title}
                    className="mosaic-about-resume-entry mosaic-about-work-entry"
                    data-about-fade=""
                  >
                    <p className="mosaic-about-service-shape">{service.shape}</p>
                    <div className="mosaic-about-resume-details">
                      <h3 className="mosaic-about-resume-title">{service.title}</h3>
                      <p className="mosaic-about-resume-description">{service.description}</p>
                      {service.price ? (
                        <p className="mosaic-about-service-price">{service.price}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Every shape prints a figure now, so this paragraph is what
                  keeps the three of them from reading as a rate card: they are
                  the floor, and the quote still follows the scope. */}
              <p className="mosaic-about-services-pricing" data-about-fade="">
                Those are starting points rather than fixed rates — what an engagement costs follows
                its scope. Tell me what you are building and roughly when you need it, and I will
                come back with a number and a timeline.
              </p>

              <p className="mosaic-about-closing" data-about-fade="">
                Email me at{" "}
                <a
                  href={`mailto:${links.email}`}
                  className="mosaic-about-link"
                  onClick={() => {
                    trackEvent("social_link_click", {
                      social_label: "Email",
                      social_href: `mailto:${links.email}`,
                      social_placement: "about_services",
                    })
                  }}
                >
                  {links.email}
                </a>
                , or{" "}
                <InlineBookingLink
                  bookingUrl={links.booking}
                  placement="about_services"
                  className="mosaic-about-link mosaic-about-booking-link"
                >
                  book a 30-minute call
                </InlineBookingLink>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}
