import { useLayoutEffect, useRef } from "react"

type Point = { x: number; y: number }
type Camera = Point & { scale: number }
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

/** A camera over a repeating photo wall. Pointer and wheel events change only
 * its transform; React still owns selection, captions, and the dialog. */
export function usePhotoWall(stage: HTMLElement | null, open: boolean, onNavigate: () => boolean) {
  const camera = useRef<Camera>({ x: 0, y: 0, scale: 1 })
  const active = useRef(open)
  const controls = useRef<{ zoom: (factor: number) => void; reset: () => void; scale: () => number; followFocus: (x: number, y: number) => void }>({ zoom: () => {}, reset: () => {}, scale: () => camera.current.scale, followFocus: () => {} })
  useLayoutEffect(() => { active.current = open }, [open])

  useLayoutEffect(() => {
    const plane = stage?.querySelector<HTMLElement>(".personal-photos-masonry")
    if (!stage || !plane) return
    const panels = Array.from(plane.querySelectorAll<HTMLElement>(".personal-photos-wall-panel"))
    const columns = panels.map(panel => Array.from(panel.querySelectorAll<HTMLElement>(".personal-photos-column")))
    const pointers = new Map<number, Point>()
    let origin: Point | null = null
    let dragged = false
    let suppressClick = false
    let placement = ""
    let focus = { x: 0, y: 0 }
    // Keep each physical panel in its own modulo-three cell. Only a panel
    // leaving the surrounding ring moves; visible neighbours keep their slots.
    const recycledCell = (centre: number, offset: number) => centre + ((offset - centre + 1) % 3 + 3) % 3 - 1
    let focusRevision = 0
    const paint = (recycle = true) => {
      const pose = camera.current
      const width = plane.offsetWidth
      const heights = columns[0]?.map(column => column.offsetHeight) ?? []
      // Recycle horizontally by a complete collection, and vertically by
      // each column's own period. Unequal photo ratios cannot leave a blank
      // band below a short column when its taller neighbour repeats.
      if (recycle && width && heights.every(height => height > 0)) {
        const column = Math.floor((stage.clientWidth / 2 - pose.x - focus.x) / (width * pose.scale))
        const rows = heights.map(height => Math.floor((stage.clientHeight / 2 - pose.y - focus.y) / (height * pose.scale)))
        const nextPlacement = `${column},${rows},${width},${heights}`
        if (nextPlacement !== placement) {
          placement = nextPlacement
          panels.forEach((panel, panelIndex) => {
            panel.style.left = `${recycledCell(column, Number(panel.dataset.wallX)) * width}px`
            columns[panelIndex].forEach((item, index) => {
              item.style.top = `${recycledCell(rows[index], Number(panel.dataset.wallY)) * heights[index]}px`
            })
          })
        }
      }
      plane.style.transform = `translate(${pose.x}px, ${pose.y}px) scale(${pose.scale})`
    }
    const local = (point: Point) => {
      const rect = stage.getBoundingClientRect()
      return { x: point.x - rect.left, y: point.y - rect.top }
    }
    const releaseForNavigation = () => {
      // Transfer the drawn selection offset into the camera before releasing.
      // This keeps panning and zooming anchored to the visible wall.
      const drawnFocus = getComputedStyle(plane).translate.split(" ").map(Number.parseFloat)
      if (onNavigate()) {
        camera.current.x += Number.isFinite(drawnFocus[0]) ? drawnFocus[0] : 0
        camera.current.y += Number.isFinite(drawnFocus[1]) ? drawnFocus[1] : 0
        plane.style.transition = "none"
        plane.style.translate = "0px 0px"
      }
      focus = { x: 0, y: 0 }
    }
    const zoom = (factor: number, from: Point, to = from) => {
      releaseForNavigation()
      const pose = camera.current
      const scale = clamp(pose.scale * factor, 0.4, 2.5)
      const ratio = scale / pose.scale
      pose.x = to.x - (from.x - pose.x) * ratio
      pose.y = to.y - (from.y - pose.y) * ratio
      pose.scale = scale
      paint()
      if (plane.style.transition === "none") void plane.offsetWidth
    }
    const pan = (dx: number, dy: number) => {
      releaseForNavigation()
      camera.current.x += dx
      camera.current.y += dy
      paint()
      // Commit the equivalent camera pose without animating the offset twice.
      if (plane.style.transition === "none") void plane.offsetWidth
    }
    const reset = () => {
      onNavigate()
      focus = { x: 0, y: 0 }
      camera.current = { x: 20, y: 144, scale: stage.clientWidth < 700 ? 0.65 : 1 }
      paint()
    }
    const zoomCentre = (factor: number) => zoom(factor, { x: stage.clientWidth / 2, y: stage.clientHeight / 2 })
    controls.current = { zoom: zoomCentre, reset, scale: () => camera.current.scale, followFocus: (x, y) => {
      const releasing = x === 0 && y === 0 && (focus.x !== 0 || focus.y !== 0)
      const revision = ++focusRevision
      if (releasing) {
        // Selection moved the wall to this photo. Keep that drawn position
        // as the camera's new home, so zooming out only shrinks the photo.
        const drawn = getComputedStyle(plane).translate.split(" ").map(Number.parseFloat)
        camera.current.x += drawn[0] || 0
        camera.current.y += drawn[1] || 0
        plane.style.transition = "none"
        plane.style.translate = "0px 0px"
        paint(false)
        void plane.offsetWidth
      }
      focus = { x, y }
      plane.style.removeProperty("translate")
      plane.style.removeProperty("transition")
      paint(!releasing)
      if (releasing) {
        // Do not move a repeating panel under the photo while it shrinks.
        // Reading animations flushes the shrink transitions; reduced
        // motion has no transition and recycles immediately in the microtask.
        const transitions = plane.getAnimations({ subtree: true })
        void Promise.allSettled(transitions.map(animation => animation.finished)).then(() => {
          if (revision === focusRevision) paint()
        })
      }
    } }
    reset()

    const wheel = (event: WheelEvent) => {
      if (!active.current) return
      event.preventDefault()
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1
      if (event.ctrlKey || event.metaKey) zoom(Math.exp(-event.deltaY * unit * 0.01), local({ x: event.clientX, y: event.clientY }))
      else pan(-(event.shiftKey ? event.deltaY : event.deltaX) * unit, -(event.shiftKey ? 0 : event.deltaY) * unit)
    }
    const down = (event: PointerEvent) => {
      if (!active.current || event.button !== 0) return
      if (!pointers.size) {
        dragged = false
        suppressClick = false
        origin = { x: event.clientX, y: event.clientY }
      }
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    }
    const midpoint = (points: Point[]) => ({ x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2 })
    const distance = (points: Point[]) => Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
    const move = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId)
      if (!active.current || !previous) return
      const before = [...pointers.values()]
      const next = { x: event.clientX, y: event.clientY }
      pointers.set(event.pointerId, next)
      if (!dragged && pointers.size < 2 && origin && Math.hypot(next.x - origin.x, next.y - origin.y) < 6) return
      dragged = true
      suppressClick = true
      stage.setAttribute("data-wall-dragging", "")
      stage.setPointerCapture(event.pointerId)
      event.preventDefault()
      if (pointers.size >= 2) {
        const after = [...pointers.values()]
        zoom(distance(after) / Math.max(1, distance(before)), local(midpoint(before)), local(midpoint(after)))
      } else pan(next.x - previous.x, next.y - previous.y)
    }
    const up = (event: PointerEvent) => {
      pointers.delete(event.pointerId)
      if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId)
      if (!pointers.size) {
        origin = null
        stage.removeAttribute("data-wall-dragging")
      }
    }
    const lostCapture = (event: PointerEvent) => {
      // Touch transfers implicit capture from the photo to the stage. The
      // old target's bubbling loss does not end the continuing gesture.
      if (event.target === stage) up(event)
    }
    const cancel = () => {
      pointers.forEach((_, id) => { if (stage.hasPointerCapture(id)) stage.releasePointerCapture(id) })
      pointers.clear()
      origin = null
      stage.removeAttribute("data-wall-dragging")
    }
    const click = (event: MouseEvent) => {
      if (suppressClick && event.detail) {
        event.preventDefault()
        event.stopImmediatePropagation()
        suppressClick = false
      }
    }
    const key = (event: KeyboardEvent) => {
      if (!active.current || event.ctrlKey || event.metaKey || event.altKey) return
      const step = 80
      switch (event.key) {
        case "ArrowLeft": if (!event.shiftKey) return; pan(step, 0); break
        case "ArrowRight": if (!event.shiftKey) return; pan(-step, 0); break
        case "ArrowUp": if (!event.shiftKey) return; pan(0, step); break
        case "ArrowDown": if (!event.shiftKey) return; pan(0, -step); break
        case "+": case "=": zoomCentre(1.2); break
        case "-": zoomCentre(1 / 1.2); break
        case "0": reset(); break
        default: return
      }
      event.preventDefault()
    }
    const focusIn = (event: FocusEvent) => {
      const slide = (event.target as Element).closest<HTMLElement>(".personal-photos-slide")
      if (!slide || slide.hasAttribute("data-held") || !slide.matches(":focus-visible")) return
      // Only keyboard focus moves the camera. Pointer focus must leave an
      // edge photo under the pointer until its click has completed.
      // Browser focus must not secretly scroll the clipped stage.
      stage.scrollLeft = 0
      stage.scrollTop = 0
      const box = slide.getBoundingClientRect()
      const bounds = stage.getBoundingClientRect()
      if (box.left < bounds.left || box.right > bounds.right || box.top < bounds.top + 144 || box.bottom > bounds.bottom) {
        pan(bounds.left + stage.clientWidth / 2 - (box.left + box.width / 2), bounds.top + stage.clientHeight / 2 - (box.top + box.height / 2))
      }
    }
    const resize = () => { onNavigate(); paint() }
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    observer.observe(plane)
    stage.addEventListener("wheel", wheel, { passive: false })
    stage.addEventListener("pointerdown", down)
    stage.addEventListener("pointermove", move)
    stage.addEventListener("pointerup", up)
    stage.addEventListener("pointercancel", up)
    stage.addEventListener("lostpointercapture", lostCapture)
    stage.addEventListener("click", click, true)
    stage.addEventListener("keydown", key)
    stage.addEventListener("focusin", focusIn)
    window.addEventListener("blur", cancel)
    return () => {
      focusRevision++
      cancel()
      observer.disconnect()
      plane.style.removeProperty("transform")
      plane.style.removeProperty("translate")
      plane.style.removeProperty("transition")
      stage.removeEventListener("wheel", wheel)
      stage.removeEventListener("pointerdown", down)
      stage.removeEventListener("pointermove", move)
      stage.removeEventListener("pointerup", up)
      stage.removeEventListener("pointercancel", up)
      stage.removeEventListener("lostpointercapture", lostCapture)
      stage.removeEventListener("click", click, true)
      stage.removeEventListener("keydown", key)
      stage.removeEventListener("focusin", focusIn)
      window.removeEventListener("blur", cancel)
      controls.current = { zoom: () => {}, reset: () => {}, scale: () => 1, followFocus: () => {} }
    }
  }, [stage, onNavigate])
  return controls
}
