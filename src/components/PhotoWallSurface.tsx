import { useLayoutEffect, useRef, type ReactNode } from "react"
import { renderPhotoWall } from "../lib/renderPhotoWall"

/** The curve the stage asks for. Zero on both is the flat wall that ships. */
function isCurved(stage: HTMLElement) {
  const style = getComputedStyle(stage)
  return Boolean(parseFloat(style.getPropertyValue("--wall-bend")) || parseFloat(style.getPropertyValue("--wall-rim")))
}

/** Keep the original DOM for focus, gestures, selection and the flat fallback.
 * WebGL composites it into a single surface with one continuous curve.
 *
 * The renderer only starts once a curve is asked for. Building its context
 * and compiling its shaders took ~35ms of the click that opens the wall, in
 * the same task that mounts it, and the flat wall never draws with them: the
 * photos sat frozen on the white canvas for that long before their flights
 * began. The dev tuner's curve change starts it. */
export function PhotoWallSurface({ children, wall }: { children: ReactNode; wall: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    if (!wall || !ref.current || !canvas.current) return
    const surface = ref.current
    const stage = surface.parentElement!
    let stop: (() => void) | undefined
    // Once started it stays for the visit: its own paint already steps aside
    // for a flat wall, and releases any opening it was drawing.
    const sync = () => {
      if (!stop && isCurved(stage)) stop = renderPhotoWall(canvas.current!, stage, surface) ?? undefined
    }
    sync()
    window.addEventListener("photo-wall-curve-change", sync)
    return () => {
      window.removeEventListener("photo-wall-curve-change", sync)
      stop?.()
    }
  }, [wall])
  if (!wall) return children
  return <div ref={ref} className="personal-photos-wall-surface">
    {children}
    <canvas ref={canvas} className="personal-photos-wall-canvas" aria-hidden="true" />
  </div>
}
