import { useEffect, useRef, type ReactNode } from "react"
import type { AboutIntroMedia } from "../data/aboutIntro"
import { useLightweightMedia } from "../lib/useLightweightMedia"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"
import { usePageHidden } from "../lib/usePageHidden"

export function AboutIntroPortrait({ media, portrait, visible, children }: {
  media?: AboutIntroMedia
  portrait: string
  visible: boolean
  children: ReactNode
}) {
  const teaserRef = useRef<HTMLVideoElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const lightweight = useLightweightMedia()
  const pageHidden = usePageHidden()
  const teaserIsGif = /\.gif(?:\?|$)/i.test(media?.assets.teaser ?? "")
  // This chunk mounts after hydration. The shared motion hook starts false,
  // so consult the live preference before assigning an automatic media URL.
  const animateTeaser = Boolean(media) && !reducedMotion && !lightweight &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    const teaser = teaserRef.current
    if (!teaser) return
    const sync = () => {
      if (visible && !document.hidden) {
        void teaser.play().catch(() => { /* A poster remains if autoplay is blocked. */ })
      } else teaser.pause()
    }
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => {
      document.removeEventListener("visibilitychange", sync)
    }
  }, [visible, animateTeaser])

  return <div className="about-intro-media">
    <img className="about-intro-poster" src={media ? media.assets.poster : portrait} width={720} height={720} alt="" />
    {media && animateTeaser && teaserIsGif && visible && !pageHidden &&
      <img className="about-intro-teaser" src={media.assets.teaser} width={180} height={180} alt="" />}
    {media && animateTeaser && !teaserIsGif && <video ref={teaserRef} className="about-intro-teaser" src={media.assets.teaser}
      muted loop playsInline preload="metadata" aria-hidden="true" />}
    {children}
  </div>
}
