import { useEffect, useRef, useState } from "react"

import type { HoverMedia } from "../data/portfolio"

type LinkedInHoverCardProps = {
  media: HoverMedia
  isOpen: boolean
}

const isVideoSource = (source: string) => /\.(webm|mp4)$/.test(source)

/**
 * A single piece of media hanging off the LinkedIn pill. Purely decorative: it
 * carries no links, so it stays out of the accessibility tree.
 */
export function LinkedInHoverCard({ media, isOpen }: LinkedInHoverCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return

    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setPrefersReducedMotion(query.matches)
    sync()

    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  // The clip only runs while the card is up, so a hover the user never opens
  // costs nothing and a closed card isn't animating off screen.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isOpen && !prefersReducedMotion) {
      void video.play().catch(() => undefined)
    } else {
      video.pause()
    }
  }, [isOpen, prefersReducedMotion])

  return (
    <span
      className={`mosaic-linkedin-card${isOpen ? " is-open" : ""}`}
      data-state={isOpen ? "open" : "closed"}
      aria-hidden="true"
    >
      {isVideoSource(media.src) ? (
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          width={media.width}
          height={media.height}
          muted
          loop={!prefersReducedMotion}
          playsInline
          preload="none"
          className="mosaic-linkedin-card-media"
        />
      ) : (
        <img
          src={media.src}
          alt=""
          width={media.width}
          height={media.height}
          loading="lazy"
          decoding="async"
          className="mosaic-linkedin-card-media"
        />
      )}
    </span>
  )
}
