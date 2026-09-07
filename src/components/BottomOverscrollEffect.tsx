import { useEffect, useRef, type CSSProperties } from "react"

import {
  DEFAULT_ELASTIC_EDGE_SETTINGS,
  ELASTIC_EDGE_RANDOMIZE_EVENT,
  ELASTIC_EDGE_REPLAY_EVENT,
  ELASTIC_EDGE_SETTINGS_EVENT,
  paintElasticEdgeSettings,
  randomizeElasticEdgePalette,
  type ElasticEdgeSettings,
} from "../lib/elasticEdgeGradient"

const MAX_PULL = 72
const MAX_CONTENT_TRAVEL = 8
const MAX_OPACITY = 0.92
const RELEASE_DELAY_MS = 90

/* ANIMATION STORYBOARD (defaults live in DEFAULT_ELASTIC_EDGE_SETTINGS)
 *   0ms  the low wash follows scroll pressure; first curtain starts rising
 *  40ms  each next curtain fades upward, for 240ms total stagger
 * 700ms  each curtain finishes its small rise at a different height
 *1260ms  the released glow finishes fading; curtains reset for the next pull
 */
const CURTAIN_HEIGHTS = [0.8, 1, 0.86, 0.96, 0.76, 0.92, 0.82]

function isAtDocumentBottom() {
  const root = document.documentElement
  return window.scrollY + window.innerHeight >= root.scrollHeight - 1
}

function isInsideScrollableRegion(target: EventTarget | null) {
  let element = target instanceof Element ? target : null

  while (element && element !== document.documentElement) {
    const styles = window.getComputedStyle(element)
    const canScroll = /(auto|scroll)/.test(styles.overflowY) && element.scrollHeight > element.clientHeight + 1
    if (canScroll) return true
    element = element.parentElement
  }

  return false
}

export function BottomOverscrollEffect() {
  const edgeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const edge = edgeRef.current
    if (!edge || typeof window.matchMedia !== "function") return
    const content = document.querySelector<HTMLElement>(".mosaic-about-body")

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let pull = 0
    let lastTouchY: number | null = null
    let paintFrame: number | undefined
    let releaseTimer: number | undefined

    randomizeElasticEdgePalette(edge)
    paintElasticEdgeSettings(edge, DEFAULT_ELASTIC_EDGE_SETTINGS)

    const paint = (nextPull: number) => {
      pull = Math.max(0, Math.min(MAX_PULL, nextPull))
      if (paintFrame !== undefined) return

      paintFrame = window.requestAnimationFrame(() => {
        paintFrame = undefined
        const progress = pull / MAX_PULL

        edge.style.setProperty("--elastic-edge-opacity", String(progress * MAX_OPACITY))
        edge.style.setProperty("--elastic-edge-offset", `${(1 - progress) * 44}px`)
        edge.style.setProperty("--elastic-edge-scale", String(0.35 + progress * 0.65))
        content?.style.setProperty("--elastic-content-offset", `${-progress * MAX_CONTENT_TRAVEL}px`)
      })
    }

    const release = () => {
      if (releaseTimer !== undefined) window.clearTimeout(releaseTimer)
      releaseTimer = undefined
      if (pull === 0) return

      edge.dataset.pulling = "false"
      if (content) content.dataset.edgePulling = "false"
      const glowWasPainted = Number.parseFloat(window.getComputedStyle(edge).opacity) > 0
      // Let the release transition take over from the exact point reached by
      // the gesture, including when intent reverses mid-pull.
      void edge.offsetHeight
      paint(0)
      // A busy frame can release before the first paint. In that case there is
      // no opacity transition (and no transitionend) to reset the curtains.
      if (!glowWasPainted) edge.dataset.glowing = "false"
    }

    const scheduleRelease = () => {
      if (releaseTimer !== undefined) window.clearTimeout(releaseTimer)
      releaseTimer = window.setTimeout(release, RELEASE_DELAY_MS)
    }

    const pullBy = (distance: number, changePalette = true) => {
      if (reducedMotion.matches || distance <= 0) return

      if (edge.dataset.pulling !== "true") {
        // Release writes the resting target immediately, so recover the value
        // still being rendered before interrupting its transition.
        const renderedOpacity = Number.parseFloat(window.getComputedStyle(edge).opacity)
        if (Number.isFinite(renderedOpacity)) {
          pull = Math.max(0, Math.min(MAX_PULL, (renderedOpacity / MAX_OPACITY) * MAX_PULL))
        }

        if (changePalette && edge.dataset.glowing !== "true") randomizeElasticEdgePalette(edge)
      }

      edge.dataset.pulling = "true"
      edge.dataset.glowing = "true"
      if (content) content.dataset.edgePulling = "true"
      // Resistance increases near the limit, like a short rubber sheet rather
      // than a progress bar that stops abruptly.
      const resistance = 1 - (pull / MAX_PULL) * 0.55
      paint(pull + distance * 0.24 * resistance)
      scheduleRelease()
    }

    const handleWheel = (event: WheelEvent) => {
      if (
        event.ctrlKey ||
        event.deltaY <= 0 ||
        Math.abs(event.deltaY) < Math.abs(event.deltaX) ||
        !isAtDocumentBottom() ||
        isInsideScrollableRegion(event.target)
      ) {
        if (event.deltaY < 0) release()
        return
      }

      const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerHeight : 1
      pullBy(event.deltaY * unit)
    }

    const handleTouchStart = (event: TouchEvent) => {
      lastTouchY = event.touches[0]?.clientY ?? null
    }

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY
      if (currentY == null || lastTouchY == null) return

      const distance = lastTouchY - currentY
      lastTouchY = currentY

      if (distance > 0 && isAtDocumentBottom() && !isInsideScrollableRegion(event.target)) {
        pullBy(distance)
      } else if (distance < 0) {
        release()
      }
    }

    const handleTouchEnd = () => {
      lastTouchY = null
      release()
    }

    const handleScroll = () => {
      if (!isAtDocumentBottom()) release()
    }

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        release()
        edge.dataset.glowing = "false"
      }
    }

    const handleGlowEnd = (event: TransitionEvent) => {
      if (event.target === edge && event.propertyName === "opacity" && pull === 0) {
        edge.dataset.glowing = "false"
      }
    }

    const handleRandomize = () => randomizeElasticEdgePalette(edge)
    const handleReplay = () => {
      if (reducedMotion.matches) return
      edge.dataset.glowing = "false"
      void edge.offsetHeight
      pullBy(MAX_PULL / 0.24, false)
    }
    const handleSettings = (event: Event) => {
      paintElasticEdgeSettings(edge, (event as CustomEvent<ElasticEdgeSettings>).detail)
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd, { passive: true })
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true })
    reducedMotion.addEventListener("change", handleMotionPreference)
    window.addEventListener(ELASTIC_EDGE_RANDOMIZE_EVENT, handleRandomize)
    window.addEventListener(ELASTIC_EDGE_SETTINGS_EVENT, handleSettings)
    window.addEventListener(ELASTIC_EDGE_REPLAY_EVENT, handleReplay)
    edge.addEventListener("transitionend", handleGlowEnd)

    return () => {
      if (paintFrame !== undefined) window.cancelAnimationFrame(paintFrame)
      if (releaseTimer !== undefined) window.clearTimeout(releaseTimer)
      content?.style.removeProperty("--elastic-content-offset")
      if (content) delete content.dataset.edgePulling
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
      document.removeEventListener("touchcancel", handleTouchEnd)
      reducedMotion.removeEventListener("change", handleMotionPreference)
      window.removeEventListener(ELASTIC_EDGE_RANDOMIZE_EVENT, handleRandomize)
      window.removeEventListener(ELASTIC_EDGE_SETTINGS_EVENT, handleSettings)
      window.removeEventListener(ELASTIC_EDGE_REPLAY_EVENT, handleReplay)
      edge.removeEventListener("transitionend", handleGlowEnd)
    }
  }, [])

  return (
    <div ref={edgeRef} className="elastic-scroll-edge" data-pulling="false" aria-hidden="true">
      <div className="elastic-scroll-edge-shade" />
      {CURTAIN_HEIGHTS.map((height, index) => (
        <div
          key={index}
          className="elastic-scroll-edge-curtain"
          style={{
            "--curtain-index": index,
            "--curtain-height": height,
            "--curtain-color": `var(--elastic-edge-color-${index + 1})`,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}
