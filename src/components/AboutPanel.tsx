import { useEffect, useRef } from "react"

import type { SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"

type AboutPanelProps = {
  links: SiteLinks
  onClose: () => void
}

const elsewhereLinks = (links: SiteLinks) => [
  { label: "X", href: links.x },
  { label: "Telegram", href: links.telegram },
  { label: "GitHub", href: links.github },
  { label: "LinkedIn", href: links.linkedin },
  { label: "Dribbble", href: links.dribbble },
]

export function AboutPanel({ links, onClose }: AboutPanelProps) {
  const panelRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <article
      ref={panelRef}
      id="about-panel"
      className="mosaic-about"
      tabIndex={-1}
      aria-label="About Rafael Medina"
    >
      <h2 className="sr-only">About Rafael Medina</h2>
      <div className="mosaic-about-body">
        <p className="mosaic-about-lede">
          Hey — I&rsquo;m Rafael. I&rsquo;ve spent more than ten years designing products, most of it
          in the messy middle: working out what a thing should be, drawing it, prototyping it, and
          staying on until it ships.
        </p>

        <div className="mosaic-about-columns">
          <p>
            I prototype in code, because something you can click tells you more in a minute than
            something you can only look at. That habit is most of how I work — build the smallest
            real version, put it in front of people, and let it argue back.
          </p>
          <p>
            Most recently that&rsquo;s been with 0x and Matcha. Before that, stretches with
            Moody&rsquo;s, Chainlink, Twilio, Onit, Google, and Protector and Patrol.
          </p>
          <p>
            The work I like best is the kind that stays useful after launch — clear flows, careful
            craft, and interfaces that hold up once real people get their hands on them.
          </p>
        </div>

        <dl className="mosaic-about-facts">
          <div className="mosaic-about-fact">
            <dt>Now</dt>
            <dd>Freelance product design, between Punta Cana and NYC.</dd>
          </div>
          <div className="mosaic-about-fact">
            <dt>Lately</dt>
            <dd>Interactive prototypes, AI workflows, and design systems.</dd>
          </div>
          <div className="mosaic-about-fact">
            <dt>Elsewhere</dt>
            <dd>
              {elsewhereLinks(links).map((link, index) => (
                <span key={link.label}>
                  {index > 0 ? <span aria-hidden="true"> · </span> : null}
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mosaic-about-link"
                    onClick={() => {
                      trackEvent("social_link_click", {
                        social_label: link.label,
                        social_href: link.href,
                        social_placement: "about_panel",
                      })
                    }}
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="mosaic-about-footer">
          <p className="mosaic-about-closing">
            I&rsquo;m taking on work right now. If you&rsquo;re building something that deserves
            care,{" "}
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
              say hello
            </a>
            .
          </p>

          <button type="button" className="mosaic-about-back" onClick={onClose}>
            <span aria-hidden="true">←</span> Back to work
          </button>
        </div>
      </div>
    </article>
  )
}
