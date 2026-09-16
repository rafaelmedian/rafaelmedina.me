import { useLayoutEffect, useRef } from "react"
import { cssTimeToMilliseconds } from "./cssTime"

/** Keep photo labels attached to the moving photo from the start of selection.
 * React owns selection; this loop owns caption and inspector placement. */
export function usePhotoWallCaption(stage: HTMLElement | null, instance: string | undefined, text: string | undefined, reducedMotion: boolean) {
  const previous = useRef<HTMLElement | null>(null)
  useLayoutEffect(() => {
    const caption = stage?.querySelector<HTMLElement>(".personal-photos-stage-caption")
    if (!stage || !caption) return
    const surface = stage.parentElement
    const inspector = surface?.querySelector<HTMLElement>(".personal-photo-inspector")
    // Lay out the text at its destination size, then carry the entire overlay
    // with the print. Resizing the text on every frame would rewrap its lines.
    const detailLeft = parseFloat(inspector?.style.getPropertyValue("--detail-photo-left") ?? "0")
    const detailTop = parseFloat(inspector?.style.getPropertyValue("--detail-photo-top") ?? "0")
    const detailWidth = parseFloat(inspector?.style.getPropertyValue("--detail-photo-width") ?? "0")
    surface?.style.setProperty("--photo-label-visibility", "hidden")
    const slide = instance
      ? Array.from(stage.querySelectorAll<HTMLElement>(".personal-photos-slide")).find(slide => slide.dataset.photoInstance === instance)
      : previous.current
    if (!slide) return
    previous.current = slide
    const tokens = getComputedStyle(stage)
    const exit = reducedMotion ? 0 : cssTimeToMilliseconds(tokens.getPropertyValue("--duration-fast"))
    const start = performance.now()
    let frame = 0
    const label = caption.querySelector<HTMLElement>("[data-photo-caption-text]")!
    if (text) label.textContent = text
    caption.style.setProperty("--stage-caption-opacity", "0")
    const paint = (now: number) => {
      const bounds = slide.getBoundingClientRect()
      const viewport = stage.getBoundingClientRect()
      if (inspector && surface && detailWidth > 0) {
        const origin = surface.getBoundingClientRect()
        const scale = bounds.width / detailWidth
        const x = bounds.left - origin.left - detailLeft * scale
        const y = bounds.top - origin.top - detailTop * scale
        inspector.style.transformOrigin = "0 0"
        inspector.style.transform = `translate(${x}px, ${y}px) scale(${scale})`
      }
      caption.style.setProperty("--stage-caption-x", `${bounds.left + bounds.width / 2 - viewport.left}px`)
      caption.style.setProperty("--stage-caption-y", `${bounds.bottom - viewport.top}px`)
      const visible = Boolean(instance)
      surface?.style.setProperty("--photo-label-visibility", visible ? "visible" : "hidden")
      caption.style.setProperty("--stage-caption-opacity", visible ? "1" : "0")
      if (instance || now - start < exit) frame = requestAnimationFrame(paint)
      else {
        label.textContent = ""
        previous.current = null
      }
    }
    paint(start)
    return () => cancelAnimationFrame(frame)
  }, [stage, instance, text, reducedMotion])
}
