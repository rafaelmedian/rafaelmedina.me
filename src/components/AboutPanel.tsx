import { useEffect, useRef, type CSSProperties } from "react"

import type { SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"

type AboutPanelProps = {
  links: SiteLinks
  onClose: () => void
}

type StickerCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right"

type AboutSticker = {
  corner: StickerCorner
  src: string
  alt: string
  /** Degrees of tilt, so the sticker reads as placed by hand. Defaults to 0. */
  rotate?: number
}

/**
 * Corner stickers for the about panel: snapshots from places, mementos, etc.
 * Drop images in `public/Stickers/` and add an entry per corner, e.g.
 *   { corner: "top-left", src: "/Stickers/punta-cana.webp", alt: "Punta Cana", rotate: -6 }
 * Empty corners simply render nothing. Stickers are decorative and are hidden
 * below 900px, where the panel has no spare room for them.
 */
const aboutStickers: AboutSticker[] = []

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
      <div className="mosaic-about-panel">
        {aboutStickers.map((sticker) => (
          <img
            key={`${sticker.corner}-${sticker.src}`}
            src={sticker.src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className={`mosaic-about-sticker mosaic-about-sticker-${sticker.corner}`}
            style={
              sticker.rotate
                ? ({ "--sticker-rotate": `${sticker.rotate}deg` } as CSSProperties)
                : undefined
            }
          />
        ))}

        <div className="mosaic-about-body">
          <p className="mosaic-about-lede">Hi, I&rsquo;m Rafael.</p>
          <p>
            I&rsquo;ve been designing products for over ten years, mostly the unglamorous parts.
            Working out what to build, drawing it, putting it in front of people, then sticking
            around for the long tail of fixes after launch.
          </p>
          <p>
            I build my prototypes in code. Something you can click answers questions a static mockup
            can&rsquo;t, and it settles an argument faster than a meeting does.
          </p>
          <p>
            Most recently I worked with 0x and Matcha. Before that: Moody&rsquo;s, Chainlink,
            Twilio, Onit, Google, and Protector and Patrol.
          </p>

          <dl className="mosaic-about-facts">
            <div className="mosaic-about-fact">
              <dt>Now</dt>
              <dd>Freelance, splitting time between Punta Cana and NYC.</dd>
            </div>
            <div className="mosaic-about-fact">
              <dt>Lately</dt>
              <dd>Prototypes, AI tooling, and design systems.</dd>
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

          <p className="mosaic-about-closing">
            I&rsquo;m taking on new work at the moment. If you&rsquo;re building something,{" "}
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
              send me an email
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
