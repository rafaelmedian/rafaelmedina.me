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

const hobbies = [
  { emoji: "🥊", label: "kickboxing" },
  { emoji: "🚵", label: "mountain biking" },
  { emoji: "🏊", label: "lap swimming" },
  { emoji: "🥾", label: "hiking" },
  { emoji: "💃", label: "salsa", learning: true },
  { emoji: "🥋", label: "jiu jitsu", learning: true },
]

/** `label` is what renders (lowercase, to match the panel); `name` is what analytics records. */
const elsewhereLinks = (links: SiteLinks) => [
  { label: "x", name: "X", href: links.x },
  { label: "telegram", name: "Telegram", href: links.telegram },
  { label: "github", name: "GitHub", href: links.github },
  { label: "linkedin", name: "LinkedIn", href: links.linkedin },
  { label: "dribbble", name: "Dribbble", href: links.dribbble },
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
          <button type="button" className="mosaic-about-back" onClick={onClose}>
            <span aria-hidden="true">←</span> back
          </button>

          <p className="mosaic-about-lede">hi, i&rsquo;m rafael.</p>
          <p>
            i&rsquo;ve been designing products for over ten years, mostly the unglamorous parts.
            working out what to build, drawing it, putting it in front of people, then sticking
            around for the long tail of fixes after launch.
          </p>
          <p>
            i build my prototypes in code. something you can click answers questions a static mockup
            can&rsquo;t, and it settles an argument faster than a meeting does.
          </p>
          <p>
            outside of work i&rsquo;m usually moving, and i pick up something new every year. right
            now that&rsquo;s salsa and jiu jitsu, both of which i am comfortably bad at.
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

          <dl className="mosaic-about-facts">
            <div className="mosaic-about-fact">
              <dt>now</dt>
              <dd>freelance, splitting time between punta cana and nyc.</dd>
            </div>
            <div className="mosaic-about-fact">
              <dt>lately</dt>
              <dd>prototypes, ai tooling, and design systems.</dd>
            </div>
            <div className="mosaic-about-fact">
              <dt>elsewhere</dt>
              <dd>
                {elsewhereLinks(links).map((link, index) => (
                  <span key={link.name}>
                    {index > 0 ? <span aria-hidden="true"> · </span> : null}
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mosaic-about-link"
                      onClick={() => {
                        trackEvent("social_link_click", {
                          social_label: link.name,
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
            i&rsquo;m taking on new work at the moment. if you&rsquo;re building something,{" "}
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
        </div>
      </div>
    </article>
  )
}
