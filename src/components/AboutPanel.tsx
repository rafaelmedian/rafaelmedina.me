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

type AboutPanelProps = {
  links: SiteLinks
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
  { emoji: "🌴", label: "Palm tree", top: "5%", left: "2%", rotate: -12 },
  { emoji: "🎨", label: "Artist palette", top: "34%", left: "5%", rotate: 15 },
  { emoji: "✏️", label: "Pencil", bottom: "34%", left: "2%", rotate: 14 },
  { emoji: "🌊", label: "Ocean wave", bottom: "5%", left: "5%", rotate: -9 },
  { emoji: "🗽", label: "Statue of Liberty", top: "10%", right: "4%", rotate: 9 },
  { emoji: "💻", label: "Laptop", top: "38%", right: "2%", rotate: -6 },
  { emoji: "🤖", label: "Robot", bottom: "30%", right: "5%", rotate: 11 },
  { emoji: "🛠️", label: "Tools", bottom: "8%", right: "2%", rotate: -7 },
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
 * so pointer and keyboard movement survives re-renders. The active sticker is
 * raised above its siblings and stays raised afterward, keeping overlaps in
 * last-touched order.
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

function ResumeCompanyLink({ company, href, logoUrls }: { company: string; href: string; logoUrls: string[] }) {
  const [open, setOpen] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mosaic-company-inline-link mosaic-about-resume-company-trigger"
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onPointerEnter={() => {
        if (window.matchMedia("(hover: hover)").matches) setOpen(true)
      }}
      onPointerLeave={(event) => {
        if (document.activeElement !== event.currentTarget) setOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false)
      }}
    >
      <span className="mosaic-company-inline-name">{company}</span>
      <span
        aria-hidden="true"
        className="mosaic-company-inline-hover-logos"
        data-open={open ? "true" : "false"}
      >
        {open
          ? logoUrls.map((logoUrl) => (
              <span key={`${company}-${logoUrl}`} className="mosaic-company-inline-hover-logo-wrap">
                <img
                  src={logoUrl}
                  alt=""
                  loading="eager"
                  decoding="async"
                  className="mosaic-company-inline-hover-logo"
                />
              </span>
            ))
          : null}
      </span>
    </a>
  )
}

export function AboutPanel({ links }: AboutPanelProps) {
  const { offsets, order, dragging, onKeyDown, onPointerDown, onPointerMove, onPointerUp } =
    useStickerMovement()

  const renderStickers = (stickers: AboutSticker[]) =>
    stickers.map((sticker) => {
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
    })

  return (
    <article
      id="about-panel"
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
            <div className="mosaic-about-section-copy">
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

            {/* Keyboard users reach the section copy before its eight movable
                decorative stickers. The intro section owns their bounds. */}
            {renderStickers(aboutStickers)}
          </section>

          <section
            id="about-panel-resume"
            className="mosaic-about-section mosaic-about-work-history"
            aria-labelledby="about-work-history-heading"
          >
            <div className="mosaic-about-work-history-copy">
              <div className="mosaic-about-section-heading-row">
                <h2 id="about-work-history-heading" className="mosaic-about-section-heading">
                  Work history
                </h2>
                <a
                  href={links.resumePdf}
                  target="_blank"
                  rel="noreferrer"
                  className="mosaic-about-link mosaic-about-resume-link"
                  onClick={() => {
                    trackEvent("social_link_click", {
                      social_label: "Download Resume",
                      social_href: links.resumePdf,
                      social_placement: "about_panel",
                    })
                  }}
                >
                  Full résumé
                </a>
              </div>
              <ol className="mosaic-about-resume mosaic-about-work-list">
                {cvExperience.map((job) => (
                  <li
                    key={`${job.company}-${job.dates}`}
                    className="mosaic-about-resume-entry mosaic-about-work-entry"
                  >
                    <p className="mosaic-about-resume-dates">{job.dates}</p>
                    <div className="mosaic-about-resume-details">
                      <h3
                        className="mosaic-about-resume-title"
                        aria-label={`${job.role} at ${job.company}`}
                      >
                        {job.role} at{" "}
                        {job.href && job.logoUrls ? (
                          <ResumeCompanyLink company={job.company} href={job.href} logoUrls={job.logoUrls} />
                        ) : (
                          <span>{job.company}</span>
                        )}
                      </h3>
                      <p className="mosaic-about-resume-location">{job.location}</p>
                      <p className="mosaic-about-resume-description">{job.highlight}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mosaic-about-resume-education">
                <h3 className="mosaic-about-resume-heading">Education</h3>
                <ul className="mosaic-about-resume mosaic-about-education-list">
                  {cvEducation.map((school) => (
                    <li
                      key={school.school}
                      className="mosaic-about-resume-entry mosaic-about-work-entry"
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
            </div>
          </section>
        </div>
      </div>
    </article>
  )
}
