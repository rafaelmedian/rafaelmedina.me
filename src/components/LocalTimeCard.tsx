import { useEffect, useRef, useState } from "react"

import { useHoverCard } from "../lib/hoverCard"
import { PuntaCanaLocationCard } from "./PuntaCanaLocationCard"

function LiveTimeLabel({ label, reducedMotion }: { label: string; reducedMotion: boolean }) {
  const [displayedLabel, setDisplayedLabel] = useState(label)
  const [incomingLabel, setIncomingLabel] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (reducedMotion || label === displayedLabel) return

    if (animationTimeoutRef.current !== null) {
      window.clearTimeout(animationTimeoutRef.current)
    }

    const frameId = window.requestAnimationFrame(() => {
      setIncomingLabel(label)
      setIsAnimating(true)
      animationTimeoutRef.current = window.setTimeout(() => {
        setDisplayedLabel(label)
        setIncomingLabel(null)
        setIsAnimating(false)
        animationTimeoutRef.current = null
      }, 240)
    })

    return () => {
      window.cancelAnimationFrame(frameId)
      if (animationTimeoutRef.current !== null) {
        window.clearTimeout(animationTimeoutRef.current)
        animationTimeoutRef.current = null
      }
    }
  }, [displayedLabel, label, reducedMotion])

  const resolvedLabel = reducedMotion ? label : displayedLabel
  const resolvedIncomingLabel = reducedMotion ? null : incomingLabel
  const resolvedAnimatingState = reducedMotion ? false : isAnimating

  return (
    // No aria-live: this is ambient info, and a live region would re-announce
    // the time to screen readers on every minute tick for the whole session.
    <span className={`mosaic-live-time ${resolvedAnimatingState ? "is-animating" : ""}`}>
      <span className="mosaic-live-time-track">
        <span className="mosaic-live-time-value mosaic-live-time-value-current">{resolvedLabel}</span>
        {resolvedIncomingLabel ? <span className="mosaic-live-time-value mosaic-live-time-value-next">{resolvedIncomingLabel}</span> : null}
      </span>
    </span>
  )
}

/**
 * Where I am and what time it is there, with the map behind it on hover.
 *
 * This used to sit in the page's top-right corner, opposite the section links.
 * It is ambient rather than actionable, and the corner is the most valuable
 * real estate on the page, so the address took the corner and the clock moved
 * down here, where "when I am reachable" sits beside the rest of the answer to
 * "who is this".
 */
export function LocalTimeCard({
  timeLabel,
  reducedMotion,
}: {
  timeLabel: string
  reducedMotion: boolean
}) {
  const { isOpen, hoverProps } = useHoverCard()

  return (
    <div className="mosaic-about-local-time">
      <span className="mosaic-hover-anchor mosaic-local-time-anchor" {...hoverProps}>
        <span
          className="mosaic-social-time"
          tabIndex={0}
          aria-describedby="local-time-location"
        >
          Local time: <LiveTimeLabel label={timeLabel} reducedMotion={reducedMotion} />
        </span>
        {/* The description target is plain text on purpose: the visual card
            below contains a link, which a tooltip/description must not. */}
        <span id="local-time-location" className="sr-only">
          Punta Cana, Dominican Republic
        </span>
        <PuntaCanaLocationCard isOpen={isOpen} timeLabel={timeLabel} />
      </span>
    </div>
  )
}
