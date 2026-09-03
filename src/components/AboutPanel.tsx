import {
  Fragment,
  useCallback,
  useEffect,
  useId,
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
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"

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

/** Group context a keyboard event needs for roving focus between stickers. */
type StickerGroup = {
  groupId: string
  stickers: AboutSticker[]
}

/**
 * Peel-and-move stickers. Each one keeps a bounded translation offset in state,
 * so pointer and keyboard movement survives re-renders. The active sticker is
 * raised above its siblings and stays raised afterward, keeping overlaps in
 * last-touched order.
 *
 * Keyboard model: each group is one tab stop (roving tabindex), so the eight
 * decorative toys cost two Tab presses instead of eight on the way through the
 * About panel. Inside a group, arrow keys switch stickers; Enter or Space picks
 * the focused sticker up, arrow keys then move it, Enter/Space/Escape drops it,
 * and Home resets its position.
 */
function useStickerMovement() {
  const [offsets, setOffsets] = useState<Record<string, Offset>>({})
  const [order, setOrder] = useState<string[]>([])
  const [dragging, setDragging] = useState<string | null>(null)
  const [grabbed, setGrabbed] = useState<string | null>(null)
  const [activeByGroup, setActiveByGroup] = useState<Record<string, string>>({})
  const dragRef = useRef<DragState | null>(null)
  /** Mirrors `offsets` so a drag can read the current position without a stale closure. */
  const offsetsRef = useRef<Record<string, Offset>>({})
  const boundsRef = useRef<Record<string, OffsetBounds>>({})
  const stickerElementsRef = useRef(new Map<string, HTMLButtonElement>())

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

  const setStickerActive = useCallback((groupId: string, emoji: string) => {
    setActiveByGroup((current) =>
      current[groupId] === emoji ? current : { ...current, [groupId]: emoji },
    )
  }, [])

  const registerSticker = useCallback((emoji: string, element: HTMLButtonElement | null) => {
    if (element) stickerElementsRef.current.set(emoji, element)
    else stickerElementsRef.current.delete(emoji)
  }, [])

  const onPointerDown = useCallback((event: PointerEvent<HTMLButtonElement>, emoji: string, groupId: string) => {
    // Left button / touch / pen only, so a right-click doesn't strand a drag.
    if (event.button !== 0) return

    event.preventDefault()
    event.currentTarget.focus({ preventScroll: true })
    event.currentTarget.setPointerCapture(event.pointerId)
    // The pointer takes over: whatever the keyboard had picked up is dropped,
    // and the group's tab stop follows the sticker just touched.
    setGrabbed(null)
    setStickerActive(groupId, emoji)

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
  }, [getStickerBounds, raiseSticker, setStickerActive])

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
    (event: KeyboardEvent<HTMLButtonElement>, emoji: string, group: StickerGroup) => {
      const movementByKey: Partial<Record<string, Offset>> = {
        ArrowUp: { x: 0, y: -keyboardMoveDistance },
        ArrowDown: { x: 0, y: keyboardMoveDistance },
        ArrowLeft: { x: -keyboardMoveDistance, y: 0 },
        ArrowRight: { x: keyboardMoveDistance, y: 0 },
      }
      const movement = movementByKey[event.key]
      const held = grabbed === emoji

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        setGrabbed(held ? null : emoji)
        if (!held) raiseSticker(emoji)
        return
      }

      if (event.key === "Escape" && held) {
        event.preventDefault()
        setGrabbed(null)
        return
      }

      // Ungrabbed, arrows rove between the group's stickers instead of moving
      // one — that is what makes the group a single tab stop.
      if (movement && !held) {
        event.preventDefault()
        const stickers = group.stickers
        const index = stickers.findIndex((sticker) => sticker.emoji === emoji)
        const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1
        const next = stickers[(index + delta + stickers.length) % stickers.length]
        if (!next) return

        setStickerActive(group.groupId, next.emoji)
        stickerElementsRef.current.get(next.emoji)?.focus()
        return
      }

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
    [getStickerBounds, grabbed, raiseSticker, setStickerActive, setStickerOffset],
  )

  const onBlur = useCallback((emoji: string) => {
    // Leaving the sticker drops it, so focus can't wander off with a sticker
    // still announced as picked up.
    setGrabbed((current) => (current === emoji ? null : current))
  }, [])

  return {
    offsets,
    order,
    dragging,
    grabbed,
    activeByGroup,
    registerSticker,
    onBlur,
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
  const {
    offsets,
    order,
    dragging,
    grabbed,
    activeByGroup,
    registerSticker,
    onBlur,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useStickerMovement()
  const panelRef = useRef<HTMLElement | null>(null)
  const stickerInstructionsId = useId()
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

  const renderStickers = (stickers: AboutSticker[], groupId: string) =>
    stickers.map((sticker) => {
      const offset = offsets[sticker.emoji]
      const stackIndex = order.indexOf(sticker.emoji)
      const activeEmoji = activeByGroup[groupId] ?? stickers[0]?.emoji
      const isHeld = grabbed === sticker.emoji

      return (
        <button
          key={sticker.emoji}
          type="button"
          ref={(element) => registerSticker(sticker.emoji, element)}
          // Roving tabindex: one tab stop per sticker group. Arrow keys reach
          // the rest; the shared description spells the model out.
          tabIndex={sticker.emoji === activeEmoji ? 0 : -1}
          aria-label={`${sticker.label} sticker`}
          aria-describedby={stickerInstructionsId}
          aria-pressed={isHeld}
          aria-keyshortcuts="Enter Space Escape ArrowUp ArrowDown ArrowLeft ArrowRight Home"
          className="mosaic-about-sticker"
          data-dragging={dragging === sticker.emoji || isHeld ? "" : undefined}
          onBlur={() => onBlur(sticker.emoji)}
          onKeyDown={(event) => onKeyDown(event, sticker.emoji, { groupId, stickers })}
          onPointerDown={(event) => onPointerDown(event, sticker.emoji, groupId)}
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

              {/* The address is spelled out here as persistent text; the hero
                  copy action also exposes it in a pointer tooltip. */}
              <p className="mosaic-about-closing">
                Taking on new work. Building something? Email me at{" "}
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

            {/* Keyboard users reach the section copy before its four movable
                decorative stickers. The intro section owns their bounds. */}
            {renderStickers(aboutStickers, "about")}
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

            {renderStickers(workHistoryStickers, "work-history")}
          </section>
        </div>
      </div>
      {/* One shared description for all eight stickers keeps each button's own
          announcement short. */}
      <span id={stickerInstructionsId} className="sr-only">
        Arrow keys switch between the group&rsquo;s stickers. Press Enter or Space to pick a sticker up,
        arrow keys to move it, Enter or Space to drop it, and Home to reset its position.
      </span>
    </article>
  )
}
