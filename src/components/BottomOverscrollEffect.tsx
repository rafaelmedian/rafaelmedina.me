import { useEffect, useRef } from "react"

import {
  DEFAULT_ELASTIC_EDGE_SETTINGS,
  ELASTIC_EDGE_RANDOMIZE_EVENT,
  ELASTIC_EDGE_SETTINGS_EVENT,
  paintElasticEdgeSettings,
  randomizeElasticEdgePalette,
  type ElasticEdgeSettings,
} from "../lib/elasticEdgeGradient"

const MAX_PULL = 72
const MAX_OPACITY = 0.92
const RELEASE_DELAY_MS = 90
const EMOJI_COMPANIONS = ["✨", "🥳", "🌴", "🚀", "💫", "🎉", "🫶", "😎"]
const EMOJI_ANCHORS = [18, 39, 61, 82]

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pickEmojiCompanions(count: number) {
  const choices = [...EMOJI_COMPANIONS]

  for (let index = choices.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const choice = choices[index]
    choices[index] = choices[swapIndex]
    choices[swapIndex] = choice
  }

  return choices.slice(0, count)
}

function launchEmojiBurst(layer: HTMLDivElement) {
  const emojis = ["😉", ...pickEmojiCompanions(3)]
  const fragment = document.createDocumentFragment()

  layer.replaceChildren()

  emojis.forEach((emoji, index) => {
    const particle = document.createElement("span")

    particle.className = "elastic-scroll-edge-emoji"
    particle.style.left = `${EMOJI_ANCHORS[index] + randomBetween(-6, 6)}%`
    particle.style.setProperty("--emoji-rise", `${randomBetween(-168, -104)}px`)
    particle.style.setProperty("--emoji-start-rotation", `${randomBetween(-22, 22)}deg`)
    particle.style.setProperty("--emoji-end-rotation", `${randomBetween(-70, 70)}deg`)
    particle.style.setProperty("--emoji-delay", `${index * 35}ms`)
    particle.style.setProperty("--emoji-size", `${randomBetween(1.3, 1.85)}rem`)
    particle.addEventListener("animationend", (event) => {
      if (event.target === particle) particle.remove()
    })
    particle.textContent = emoji
    fragment.append(particle)
  })

  layer.append(fragment)
}

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
  const emojiLayerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const edge = edgeRef.current
    const emojiLayer = emojiLayerRef.current
    if (!edge || !emojiLayer || typeof window.matchMedia !== "function") return

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
      })
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

        randomizeElasticEdgePalette(edge)
        launchEmojiBurst(emojiLayer)
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
      if (reducedMotion.matches) {
        release()
        emojiLayer.replaceChildren()
      }
    }

    const handleRandomize = () => randomizeElasticEdgePalette(edge)
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

    return () => {
      if (paintFrame !== undefined) window.cancelAnimationFrame(paintFrame)
      if (releaseTimer !== undefined) window.clearTimeout(releaseTimer)
      emojiLayer.replaceChildren()
      window.removeEventListener("wheel", handleWheel)
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
      document.removeEventListener("touchcancel", handleTouchEnd)
      reducedMotion.removeEventListener("change", handleMotionPreference)
      window.removeEventListener(ELASTIC_EDGE_RANDOMIZE_EVENT, handleRandomize)
      window.removeEventListener(ELASTIC_EDGE_SETTINGS_EVENT, handleSettings)
    }
  }, [])

  return (
    <>
      <div ref={edgeRef} className="elastic-scroll-edge" data-pulling="false" aria-hidden="true">
        <div className="elastic-scroll-edge-shade" />
      </div>
      <div ref={emojiLayerRef} className="elastic-scroll-edge-emojis" aria-hidden="true" />
    </>
  )
}
