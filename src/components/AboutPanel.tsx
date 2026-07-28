import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react"

import type { SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"

type AboutPanelProps = {
  links: SiteLinks
  onClose: () => void
}

type AboutSticker = {
  emoji: string
  /** Percentage offsets from the panel edges. Only the two set here are applied. */
  top?: string
  bottom?: string
  left?: string
  right?: string
  /** Degrees of tilt, so the sticker reads as placed by hand. */
  rotate: number
}

/**
 * Scattered stickers for the about panel, echoing the copy below: the two
 * places, the drawing, the tooling, the code. The offsets are hand-picked
 * rather than randomised at runtime so the scatter stays put across
 * re-renders, and they sit in the panel's side gutters to stay clear of the
 * 34rem text column. Purely decorative, so they carry no alt text, and they
 * are hidden below 900px where the panel has no spare room for them.
 */
const aboutStickers: AboutSticker[] = [
  { emoji: "🌴", top: "7%", left: "7%", rotate: -12 },
  { emoji: "🎨", top: "38%", left: "3%", rotate: 15 },
  { emoji: "✏️", bottom: "28%", left: "9%", rotate: 14 },
  { emoji: "🌊", bottom: "5%", left: "4%", rotate: -9 },
  { emoji: "🗽", top: "10%", right: "8%", rotate: 9 },
  { emoji: "💻", top: "40%", right: "3%", rotate: -6 },
  { emoji: "🤖", bottom: "30%", right: "9%", rotate: 11 },
  { emoji: "🛠️", bottom: "6%", right: "4%", rotate: -7 },
]

type DragState = {
  emoji: string
  pointerId: number
  originX: number
  originY: number
  startX: number
  startY: number
}

type Offset = { x: number; y: number }

/**
 * Peel-and-move stickers. Each one keeps a translation offset in state, so a
 * drag survives re-renders but resets when the panel is closed and reopened.
 * The dragged sticker is raised above its siblings and stays raised after the
 * drop, which keeps a stack of overlapping stickers in the order they were
 * last touched.
 */
function useStickerDrag() {
  const [offsets, setOffsets] = useState<Record<string, Offset>>({})
  const [order, setOrder] = useState<string[]>([])
  const [dragging, setDragging] = useState<string | null>(null)
  const dragRef = useRef<DragState | null>(null)
  /** Mirrors `offsets` so a drag can read the current position without a stale closure. */
  const offsetsRef = useRef<Record<string, Offset>>({})

  const onPointerDown = useCallback((event: PointerEvent<HTMLSpanElement>, emoji: string) => {
    // Left button / touch / pen only, so a right-click doesn't strand a drag.
    if (event.button !== 0) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)

    const origin = offsetsRef.current[emoji] ?? { x: 0, y: 0 }
    dragRef.current = {
      emoji,
      pointerId: event.pointerId,
      originX: origin.x,
      originY: origin.y,
      startX: event.clientX,
      startY: event.clientY,
    }
    setDragging(emoji)
    setOrder((current) => [...current.filter((item) => item !== emoji), emoji])
  }, [])

  const onPointerMove = useCallback((event: PointerEvent<HTMLSpanElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const x = drag.originX + (event.clientX - drag.startX)
    const y = drag.originY + (event.clientY - drag.startY)
    offsetsRef.current = { ...offsetsRef.current, [drag.emoji]: { x, y } }
    setOffsets(offsetsRef.current)
  }, [])

  const onPointerUp = useCallback((event: PointerEvent<HTMLSpanElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null
    setDragging(null)
  }, [])

  return { offsets, order, dragging, onPointerDown, onPointerMove, onPointerUp }
}

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
  const { offsets, order, dragging, onPointerDown, onPointerMove, onPointerUp } = useStickerDrag()

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
        {aboutStickers.map((sticker) => {
          const offset = offsets[sticker.emoji]
          const stackIndex = order.indexOf(sticker.emoji)

          return (
            <span
              key={sticker.emoji}
              aria-hidden="true"
              className="mosaic-about-sticker"
              data-dragging={dragging === sticker.emoji ? "" : undefined}
              onPointerDown={(event) => onPointerDown(event, sticker.emoji)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={
                {
                  top: sticker.top,
                  bottom: sticker.bottom,
                  left: sticker.left,
                  right: sticker.right,
                  zIndex: stackIndex < 0 ? undefined : stackIndex + 1,
                  "--sticker-rotate": `${sticker.rotate}deg`,
                  "--sticker-x": `${offset?.x ?? 0}px`,
                  "--sticker-y": `${offset?.y ?? 0}px`,
                } as CSSProperties
              }
            >
              {sticker.emoji}
            </span>
          )
        })}

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
