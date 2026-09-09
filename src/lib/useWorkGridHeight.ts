import { useEffect, useRef } from "react"

/** Keep the sticky offset in step with the grid, including its breathing room.
 * Layout sizes ignore the takeover's scale, so scrolling cannot feed back into
 * the measurement. The stage and runway themselves remain naturally sized. */
export function useWorkGridHeight() {
  const gridRef = useRef<HTMLDivElement>(null)
  const runwayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    const runway = runwayRef.current
    if (!grid || !runway) return

    const measure = () => {
      runway.style.setProperty("--takeover-gallery-height", `${grid.offsetHeight}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(grid, { box: "border-box" })
    return () => {
      observer.disconnect()
      runway.style.removeProperty("--takeover-gallery-height")
    }
  }, [])

  return { gridRef, runwayRef }
}
