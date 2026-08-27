import { useEffect, useRef } from "react"

const MAX_PULL = 72
const MAX_OPACITY = 0.92
const RELEASE_DELAY_MS = 90

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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let pull = 0
    let lastTouchY: number | null = null
    let releaseTimer: number | undefined

    const paint = (nextPull: number) => {
      pull = Math.max(0, Math.min(MAX_PULL, nextPull))
      const progress = pull / MAX_PULL

      edge.style.setProperty("--elastic-edge-opacity", String(progress * MAX_OPACITY))
      edge.style.setProperty("--elastic-edge-offset", `${(1 - progress) * 44}px`)
      edge.style.setProperty("--elastic-edge-scale", String(0.35 + progress * 0.65))
    }

    const release = () => {
      if (releaseTimer !== undefined) window.clearTimeout(releaseTimer)
      releaseTimer = undefined
      if (pull === 0) return

      edge.dataset.pulling = "false"
      // Let the release transition take over from the exact point reached by
      // the gesture, including when intent reverses mid-pull.
      void edge.offsetHeight
      paint(0)
    }

    const scheduleRelease = () => {
      if (releaseTimer !== undefined) window.clearTimeout(releaseTimer)
      releaseTimer = window.setTimeout(release, RELEASE_DELAY_MS)
    }

    const pullBy = (distance: number) => {
      if (reducedMotion.matches || distance <= 0) return

      if (edge.dataset.pulling !== "true") {
        // Release writes the resting target immediately, so recover the value
        // still being rendered before interrupting its transition.
        const renderedOpacity = Number.parseFloat(window.getComputedStyle(edge).opacity)
        if (Number.isFinite(renderedOpacity)) {
          pull = Math.max(0, Math.min(MAX_PULL, (renderedOpacity / MAX_OPACITY) * MAX_PULL))
        }
      }

      edge.dataset.pulling = "true"
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

      pullBy(event.deltaY)
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
      if (reducedMotion.matches) release()
    }

    window.addEventListener("wheel", handleWheel, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })
    document.addEventListener("touchstart", handleTouchStart, { passive: true })
    document.addEventListener("touchmove", handleTouchMove, { passive: true })
    document.addEventListener("touchend", handleTouchEnd, { passive: true })
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true })
    reducedMotion.addEventListener("change", handleMotionPreference)

    return () => {
      if (releaseTimer !== undefined) window.clearTimeout(releaseTimer)
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
      document.removeEventListener("touchcancel", handleTouchEnd)
      reducedMotion.removeEventListener("change", handleMotionPreference)
    }
  }, [])

  return (
    <div ref={edgeRef} className="elastic-scroll-edge" data-pulling="false" aria-hidden="true">
      <div className="elastic-scroll-edge-shade" />
    </div>
  )
}
