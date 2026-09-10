import { useLayoutEffect, useRef, useState, type RefObject } from "react"
import { cssTimeToMilliseconds } from "./cssTime"

export type GalleryPageDirection = "prev" | "next"

/** A route-driven page turn. Retains outgoing content and cancels stale turns. */
export function useGalleryPage(
  target: string | null,
  direction: RefObject<GalleryPageDirection>,
  surface: RefObject<HTMLElement | null>,
  immediate: boolean,
) {
  const [displayed, setDisplayed] = useState(target)
  const current = useRef(target)
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle")
  const [travelDirection, setTravelDirection] = useState<GalleryPageDirection>("next")

  useLayoutEffect(() => {
    if (immediate || current.current === target) {
      current.current = target
      setDisplayed(target)
      setPhase("idle")
      return
    }
    const duration = cssTimeToMilliseconds(getComputedStyle(surface.current ?? document.documentElement)
      .getPropertyValue("--pg-switch-ms"))
    let frame = 0
    setTravelDirection(target === null ? "prev" : current.current === null ? "next" : direction.current)
    setPhase("out")
    const timer = window.setTimeout(() => {
      current.current = target
      setDisplayed(target)
      setPhase("in")
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => setPhase("idle"))
      })
    }, duration)
    return () => {
      window.clearTimeout(timer)
      window.cancelAnimationFrame(frame)
    }
  }, [target, immediate, direction, surface])

  return { displayed, phase, direction: travelDirection }
}
