import { useLayoutEffect, useRef } from "react"
import { cssTimeToMilliseconds } from "./cssTime"

/** The actual dialog button carries the shared surface; only the TOC's
 * non-interactive label is copied, so there is never a second focus target. */
export function usePhotoControlMorph(open: boolean) {
  const button = useRef<HTMLButtonElement>(null)
  const animations = useRef<Animation[]>([])
  const ghost = useRef<HTMLElement | null>(null)
  const returningToc = useRef<HTMLElement | null>(null)

  useLayoutEffect(() => {
    const control = button.current
    const toc = document.querySelector<HTMLElement>('.mosaic-mobile-toc[data-visible="true"]')
    const surface = toc?.querySelector<HTMLElement>(".mosaic-mobile-toc-surface")
    const label = toc?.querySelector<HTMLElement>(".mosaic-mobile-toc-trigger .mosaic-mobile-toc-row-content")
    const content = control?.querySelector<HTMLElement>(".personal-photos-wall-close-content")
    if (!control || !toc || !surface || !label || !content || matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const current = control.getBoundingClientRect()
    const currentStyle = getComputedStyle(control)
    const currentTransform = currentStyle.transform
    const contentOpacity = getComputedStyle(content).opacity
    const ghostOpacity = ghost.current ? getComputedStyle(ghost.current).opacity : "0"
    const interrupted = animations.current.some(animation => animation.playState === "running")
    animations.current.forEach(animation => animation.cancel())
    ghost.current?.remove()
    const resting = control.getBoundingClientRect()
    const target = surface.getBoundingClientRect()
    if (!target.width || !target.height) return
    const settings = getComputedStyle(control)
    const duration = cssTimeToMilliseconds(settings.getPropertyValue(open ? "--photo-open-duration" : "--photo-close-duration"))
    const easing = settings.getPropertyValue("--photo-motion-ease").trim()
    const deltaX = target.left + target.width / 2 - resting.left - resting.width / 2
    const deltaY = target.top + target.height / 2 - resting.top - resting.height / 2
    const tocPose = { width: `${target.width}px`, height: `${target.height}px`, transform: `translate(${deltaX}px, ${deltaY}px)` }
    const closePose = { width: `${resting.width}px`, height: `${resting.height}px`, transform: "translate(0px, 0px)" }
    const from = interrupted ? { width: `${current.width}px`, height: `${current.height}px`, transform: currentTransform } : open ? tocPose : closePose
    const copy = document.createElement("span")
    copy.className = "personal-photos-control-morph-label"
    copy.setAttribute("aria-hidden", "true")
    copy.appendChild(label.cloneNode(true))
    control.appendChild(copy)
    ghost.current = copy
    // The TOC must return immediately when the dialog unmounts, without its
    // usual reveal fade restarting underneath the arriving shared surface.
    if (!open) {
      toc.setAttribute("data-photo-returning", "")
      returningToc.current = toc
    } else {
      toc.removeAttribute("data-photo-returning")
    }
    const timing: KeyframeAnimationOptions = { duration, easing, fill: "both" }
    animations.current = [
      control.animate([from, open ? closePose : tocPose], timing),
      content.animate([{ opacity: interrupted ? contentOpacity : open ? 0 : 1 }, { opacity: 0, offset: 0.35 }, { opacity: open ? 1 : 0 }], timing),
      copy.animate([{ opacity: interrupted ? ghostOpacity : open ? 1 : 0 }, { opacity: 0, offset: 0.35 }, { opacity: open ? 0 : 1 }], timing),
    ]
    // Keep the return pose until the dialog's photo flights finish unmounting.
    if (open) {
      const batch = animations.current
      void Promise.all(batch.map(animation => animation.finished)).then(() => {
        if (animations.current !== batch) return
        batch.forEach(animation => animation.cancel())
        copy.remove()
        ghost.current = null
      }).catch(() => {})
    }
  }, [open])

  useLayoutEffect(() => () => {
    animations.current.forEach(animation => animation.cancel())
    ghost.current?.remove()
    const toc = returningToc.current
    // Allow the dock's dialog observer to reveal the restored TOC first.
    requestAnimationFrame(() => requestAnimationFrame(() => toc?.removeAttribute("data-photo-returning")))
  }, [])
  return button
}
