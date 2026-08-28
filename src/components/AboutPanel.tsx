import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react"

import { cvEducation, cvExperience } from "../data/cv"
import type { CvExperience } from "../data/cv"
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
 * Scattered stickers for the full About surface, echoing the copy below: the
 * places, the drawing, the tooling, and the code. The offsets are hand-picked
 * rather than randomised at runtime so the composition stays put across
 * re-renders. They sit in the side gutters, support pointer dragging and
 * keyboard movement, and hide below 900px where there is no spare room.
 */
const aboutStickers: AboutSticker[] = [
  { emoji: "🌴", label: "Palm tree", top: "8%", left: "2%", rotate: -12 },
  { emoji: "🎨", label: "Artist palette", top: "28%", right: "4%", rotate: 15 },
  { emoji: "✏️", label: "Pencil", bottom: "28%", left: "5%", rotate: 14 },
  { emoji: "🌊", label: "Ocean wave", bottom: "6%", right: "2%", rotate: -9 },
]

const workHistoryStickers: AboutSticker[] = [
  { emoji: "🗽", label: "Statue of Liberty", top: "3%", right: "4%", rotate: 9 },
  { emoji: "💻", label: "Laptop", top: "31%", left: "2%", rotate: -6 },
  { emoji: "🤖", label: "Robot", top: "62%", right: "5%", rotate: 11 },
  { emoji: "🛠️", label: "Tools", bottom: "4%", left: "3%", rotate: -7 },
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
  const { offsets, order, dragging, onKeyDown, onPointerDown, onPointerMove, onPointerUp } =
    useStickerMovement()
  const panelRef = useRef<HTMLElement | null>(null)

  // The copy blocks ship visible — the attribute is empty in the prerendered
  // markup, so nothing depends on JavaScript. On mount, blocks still below
  // the fold are held transparent and released with the shared intro rise the
  // first time they scroll into the sheet. Besides continuity with the hero
  // and mosaic entrances, the fade buys the sheet's composited layer a beat
  // to rasterise fresh text tiles behind intent instead of as a late paint.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel || typeof window.matchMedia !== "function") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (!("IntersectionObserver" in window)) return

    // Scroll restoration can land mid-sheet; anything already on screen (or
    // above it) stays put and only content still below the fold animates.
    const blocks = [...panel.querySelectorAll<HTMLElement>("[data-about-fade]")].filter(
      (block) => block.getBoundingClientRect().top > window.innerHeight,
    )
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
          block.style.setProperty("--about-fade-delay", `${onScreen ? visibleIndex * 60 : 0}ms`)
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
  }, [])

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
          <span className="mosaic-about-sticker-glyph" aria-hidden="true">
            {sticker.emoji}
          </span>
        </button>
      )
    })

  return (
    <article
      id="about-panel"
      ref={panelRef}
      className="mosaic-about"
      tabIndex={-1}
      aria-label="About Rafael Medina"
    >
      <h2 className="sr-only">About Rafael Medina</h2>
      {/* One dilate pass, shared by every sticker. The die-cut used to be eight
          chained `drop-shadow()`s, which Chrome lowers to eight separate GPU
          render passes each -- across eight stickers that is ~64 passes per
          frame, and the About takeover scrolled at ~27fps with three quarters
          of its frames dropped. `feMorphology` is the real dilation those
          offsets were approximating, in one pass, at ~110fps. */}
      <svg className="mosaic-about-sticker-filter" aria-hidden="true" focusable="false">
        <filter
          id="about-sticker-die-cut"
          primitiveUnits="objectBoundingBox"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology in="SourceAlpha" operator="dilate" radius="0.03" result="cut" />
          <feFlood floodColor="#ffffff" result="white" />
          <feComposite in="white" in2="cut" operator="in" result="border" />
          <feMerge>
            <feMergeNode in="border" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>
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

            {/* Keyboard users reach the section copy before its four movable
                decorative stickers. The intro section owns their bounds. */}
            {renderStickers(aboutStickers)}
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

              <p className="mosaic-about-resume-download" data-about-fade="">
                <a href={links.resumePdf} download className="mosaic-about-link">
                  Download CV in PDF
                </a>
              </p>
            </div>

            {renderStickers(workHistoryStickers)}
          </section>
        </div>
      </div>
    </article>
  )
}
