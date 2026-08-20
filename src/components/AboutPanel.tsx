import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react"

import { cvEducation, cvExperience } from "../data/cv"
import type { SiteLinks } from "../data/portfolio"
import { trackEvent } from "../lib/analytics"

export type AboutTab = "about" | "resume"

type AboutPanelProps = {
  links: SiteLinks
  // Owned by the feed so the top nav can deep-link straight into a tab.
  activeTab: AboutTab
  onTabChange: (tab: AboutTab) => void
}

type AboutSticker = {
  emoji: string
  label: string
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
 * 34rem text column. Each sticker supports pointer dragging and keyboard
 * movement, and they are hidden below 900px where the panel has no spare room.
 */
const aboutStickers: AboutSticker[] = [
  { emoji: "🌴", label: "Palm tree", top: "7%", left: "7%", rotate: -12 },
  { emoji: "🎨", label: "Artist palette", top: "38%", left: "3%", rotate: 15 },
  { emoji: "✏️", label: "Pencil", bottom: "28%", left: "9%", rotate: 14 },
  { emoji: "🌊", label: "Ocean wave", bottom: "5%", left: "4%", rotate: -9 },
  { emoji: "🗽", label: "Statue of Liberty", top: "10%", right: "8%", rotate: 9 },
  { emoji: "💻", label: "Laptop", top: "40%", right: "3%", rotate: -6 },
  { emoji: "🤖", label: "Robot", bottom: "30%", right: "9%", rotate: 11 },
  { emoji: "🛠️", label: "Tools", bottom: "6%", right: "4%", rotate: -7 },
]

const resumeStickers: AboutSticker[] = [
  { emoji: "🎓", label: "Graduation cap", top: "6%", left: "5%", rotate: 10 },
  { emoji: "🖋️", label: "Fountain pen", top: "34%", left: "8%", rotate: -14 },
  { emoji: "☕", label: "Coffee", bottom: "30%", left: "3%", rotate: 9 },
  { emoji: "🚀", label: "Rocket", bottom: "7%", left: "8%", rotate: -11 },
  { emoji: "💼", label: "Briefcase", top: "9%", right: "5%", rotate: -8 },
  { emoji: "📈", label: "Chart trending up", top: "38%", right: "9%", rotate: 12 },
  { emoji: "💡", label: "Light bulb", bottom: "32%", right: "3%", rotate: -6 },
  { emoji: "🏆", label: "Trophy", bottom: "6%", right: "8%", rotate: 7 },
]

type Offset = { x: number; y: number }

type OffsetBounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

type DragState = {
  emoji: string
  pointerId: number
  originX: number
  originY: number
  startX: number
  startY: number
  bounds: OffsetBounds
}

const keyboardMoveDistance = 16
const stickerEdgeInset = 4

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function clampOffset(offset: Offset, bounds: OffsetBounds): Offset {
  return {
    x: clamp(offset.x, bounds.minX, bounds.maxX),
    y: clamp(offset.y, bounds.minY, bounds.maxY),
  }
}

function getOffsetBounds(element: HTMLButtonElement, offset: Offset): OffsetBounds | null {
  const panel = element.parentElement
  if (!panel) return null

  const panelRect = panel.getBoundingClientRect()
  const stickerRect = element.getBoundingClientRect()

  return {
    minX: offset.x + panelRect.left + stickerEdgeInset - stickerRect.left,
    maxX: offset.x + panelRect.right - stickerEdgeInset - stickerRect.right,
    minY: offset.y + panelRect.top + stickerEdgeInset - stickerRect.top,
    maxY: offset.y + panelRect.bottom - stickerEdgeInset - stickerRect.bottom,
  }
}

/**
 * Peel-and-move stickers. Each one keeps a bounded translation offset in state,
 * so pointer and keyboard movement survives re-renders but resets when the
 * panel is closed and reopened. The active sticker is raised above its siblings
 * and stays raised afterward, keeping overlaps in last-touched order.
 */
function useStickerMovement() {
  const [offsets, setOffsets] = useState<Record<string, Offset>>({})
  const [order, setOrder] = useState<string[]>([])
  const [dragging, setDragging] = useState<string | null>(null)
  const dragRef = useRef<DragState | null>(null)
  /** Mirrors `offsets` so a drag can read the current position without a stale closure. */
  const offsetsRef = useRef<Record<string, Offset>>({})
  const boundsRef = useRef<Record<string, OffsetBounds>>({})

  useEffect(() => {
    const invalidateBounds = () => {
      boundsRef.current = {}
    }

    window.addEventListener("resize", invalidateBounds)
    return () => window.removeEventListener("resize", invalidateBounds)
  }, [])

  const setStickerOffset = useCallback((emoji: string, offset: Offset) => {
    offsetsRef.current = { ...offsetsRef.current, [emoji]: offset }
    setOffsets(offsetsRef.current)
  }, [])

  const raiseSticker = useCallback((emoji: string) => {
    setOrder((current) => [...current.filter((item) => item !== emoji), emoji])
  }, [])

  const getStickerBounds = useCallback(
    (emoji: string, element: HTMLButtonElement, offset: Offset) => {
      const cachedBounds = boundsRef.current[emoji]
      if (cachedBounds) return cachedBounds

      const bounds = getOffsetBounds(element, offset)
      if (bounds) boundsRef.current = { ...boundsRef.current, [emoji]: bounds }
      return bounds
    },
    [],
  )

  const onPointerDown = useCallback((event: PointerEvent<HTMLButtonElement>, emoji: string) => {
    // Left button / touch / pen only, so a right-click doesn't strand a drag.
    if (event.button !== 0) return

    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)

    const origin = offsetsRef.current[emoji] ?? { x: 0, y: 0 }
    const bounds = getStickerBounds(emoji, event.currentTarget, origin)
    if (!bounds) return

    dragRef.current = {
      emoji,
      pointerId: event.pointerId,
      originX: origin.x,
      originY: origin.y,
      startX: event.clientX,
      startY: event.clientY,
      bounds,
    }
    setDragging(emoji)
    raiseSticker(emoji)
  }, [getStickerBounds, raiseSticker])

  const onPointerMove = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    setStickerOffset(
      drag.emoji,
      clampOffset(
        {
          x: drag.originX + (event.clientX - drag.startX),
          y: drag.originY + (event.clientY - drag.startY),
        },
        drag.bounds,
      ),
    )
  }, [setStickerOffset])

  const onPointerUp = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    dragRef.current = null
    setDragging(null)
  }, [])

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, emoji: string) => {
      const movementByKey: Partial<Record<string, Offset>> = {
        ArrowUp: { x: 0, y: -keyboardMoveDistance },
        ArrowDown: { x: 0, y: keyboardMoveDistance },
        ArrowLeft: { x: -keyboardMoveDistance, y: 0 },
        ArrowRight: { x: keyboardMoveDistance, y: 0 },
      }
      const movement = movementByKey[event.key]
      if (!movement && event.key !== "Home") return

      event.preventDefault()
      const origin = offsetsRef.current[emoji] ?? { x: 0, y: 0 }
      const bounds = getStickerBounds(emoji, event.currentTarget, origin)
      const nextOffset =
        movement === undefined
          ? { x: 0, y: 0 }
          : { x: origin.x + movement.x, y: origin.y + movement.y }

      setStickerOffset(emoji, bounds ? clampOffset(nextOffset, bounds) : nextOffset)
      raiseSticker(emoji)
    },
    [getStickerBounds, raiseSticker, setStickerOffset],
  )

  return {
    offsets,
    order,
    dragging,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  }
}

const hobbies = [
  { emoji: "🥊", label: "Kickboxing" },
  { emoji: "🚵", label: "Mountain biking" },
  { emoji: "🏊", label: "Lap swimming" },
  { emoji: "🥾", label: "Hiking" },
  { emoji: "💃", label: "Salsa", learning: true },
  { emoji: "🥋", label: "Jiu jitsu", learning: true },
]

const elsewhereLinks = (links: SiteLinks) => [
  { name: "X", href: links.x },
  { name: "GitHub", href: links.github },
  { name: "LinkedIn", href: links.linkedin },
  { name: "Dribbble", href: links.dribbble },
]

const aboutTabs: { id: AboutTab; label: string }[] = [
  { id: "about", label: "About me" },
  { id: "resume", label: "Work history" },
]

export function AboutPanel({ links, activeTab, onTabChange }: AboutPanelProps) {
  const tabRefs = useRef<Record<AboutTab, HTMLButtonElement | null>>({ about: null, resume: null })
  const { offsets, order, dragging, onKeyDown, onPointerDown, onPointerMove, onPointerUp } =
    useStickerMovement()

  const selectTab = (tab: AboutTab) => {
    if (tab === activeTab) return
    trackEvent("about_tab_change", { about_tab: tab })
    onTabChange(tab)
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    const next: AboutTab = activeTab === "about" ? "resume" : "about"
    selectTab(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <article
      id="about-panel"
      className="mosaic-about"
      tabIndex={-1}
      aria-label="About Rafael Medina"
    >
      <h2 className="sr-only">About Rafael Medina</h2>
      <div id="about-panel-resume" className="mosaic-about-panel">
        <div className="mosaic-about-body">
          <div
            className="mosaic-about-tabs"
            role="tablist"
            aria-label="About me or work history"
            data-active-tab={activeTab}
          >
            <span className="mosaic-about-tab-indicator" aria-hidden="true" />
            {aboutTabs.map((tab) => (
              <button
                key={tab.id}
                ref={(element) => {
                  tabRefs.current[tab.id] = element
                }}
                type="button"
                role="tab"
                id={`about-tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`about-tabpanel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                className="mosaic-about-tab"
                onClick={() => selectTab(tab.id)}
                onKeyDown={handleTabKeyDown}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Both panels stay mounted -- the inactive one is `hidden` -- so the
              resume prerenders into the shipped HTML instead of being
              client-only. */}
          <div
            id="about-tabpanel-resume"
            role="tabpanel"
            aria-labelledby="about-tab-resume"
            className="mosaic-about-tabpanel"
            hidden={activeTab !== "resume"}
          >
              <p className="mosaic-about-lede">Senior Product Designer.</p>
              <p>
                Ten years across web3, fintech, and consumer products — from early strategy to
                shipped interfaces.
              </p>
              <ol className="mosaic-about-resume">
                {cvExperience.map((job) => (
                  <li key={`${job.company}-${job.dates}`} className="mosaic-about-resume-entry">
                    <h3 className="mosaic-about-resume-company">
                      {job.logoUrls ? (
                        <span className="mosaic-about-resume-logos" aria-hidden="true">
                          {job.logoUrls.map((logoUrl) => (
                            <span key={logoUrl} className="mosaic-about-resume-logo-wrap">
                              <img src={logoUrl} alt="" loading="lazy" decoding="async" />
                            </span>
                          ))}
                        </span>
                      ) : null}
                      {job.company}
                    </h3>
                    <p className="mosaic-about-resume-meta">
                      {job.role} <span aria-hidden="true">·</span> {job.dates}
                    </p>
                    <ul className="mosaic-about-resume-highlights">
                      {job.achievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>

              <div className="mosaic-about-resume-education">
                <h3 className="mosaic-about-resume-heading">Education</h3>
                <ul className="mosaic-about-resume">
                  {cvEducation.map((school) => (
                    <li key={school.school} className="mosaic-about-resume-entry">
                      <h4 className="mosaic-about-resume-company">{school.school}</h4>
                      <p className="mosaic-about-resume-meta">
                        {school.credential} <span aria-hidden="true">·</span> {school.location}
                      </p>
                      {school.details ? (
                        <p className="mosaic-about-resume-note">{school.details}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div
              id="about-tabpanel-about"
              role="tabpanel"
              aria-labelledby="about-tab-about"
              className="mosaic-about-tabpanel"
              hidden={activeTab !== "about"}
            >
          <p className="mosaic-about-lede">Hi, I&rsquo;m Rafael.</p>
          <p>
            I&rsquo;ve spent the last ten years designing products, mostly the complicated parts people
            prefer not to think about. I figure out what to build, test it with real people, and stay
            for the fixes after launch.
          </p>
          <p>
            I prototype in code. A working interaction answers questions faster than a static mockup,
            and usually faster than a meeting.
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
                      {link.name}
                    </a>
                  </span>
                ))}
              </dd>
            </div>
          </dl>

          <p className="mosaic-about-closing">
            Taking on new work. Building something?{" "}
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
              Send me an email
            </a>
            .
          </p>
            </div>
        </div>

        {/* After the body on purpose: they are absolutely positioned, so the
            visual result is identical, but keyboard users reach the tabs and
            content before these eight decorative tab stops. */}
        {(activeTab === "resume" ? resumeStickers : aboutStickers).map((sticker) => {
          const offset = offsets[sticker.emoji]
          const stackIndex = order.indexOf(sticker.emoji)

          return (
            <button
              key={sticker.emoji}
              type="button"
              aria-label={`${sticker.label} sticker. Use arrow keys to move; Home to reset.`}
              aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home"
              className="mosaic-about-sticker"
              data-dragging={dragging === sticker.emoji ? "" : undefined}
              onKeyDown={(event) => onKeyDown(event, sticker.emoji)}
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
              <span aria-hidden="true">{sticker.emoji}</span>
            </button>
          )
        })}
      </div>
    </article>
  )
}
