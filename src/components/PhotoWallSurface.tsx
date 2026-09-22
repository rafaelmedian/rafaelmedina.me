import { useLayoutEffect, useRef, type ReactNode } from "react"
import { renderPhotoWall } from "../lib/renderPhotoWall"

/** Keep the original DOM for focus, gestures, selection and the flat fallback.
 * WebGL composites it into a single surface with one continuous curve. */
export function PhotoWallSurface({ children, wall }: { children: ReactNode; wall: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    if (!wall || !ref.current || !canvas.current) return
    return renderPhotoWall(canvas.current, ref.current.parentElement!, ref.current) ?? undefined
  }, [wall])
  if (!wall) return children
  return <div ref={ref} className="personal-photos-wall-surface">
    {children}
    <canvas ref={canvas} className="personal-photos-wall-canvas" aria-hidden="true" />
  </div>
}
