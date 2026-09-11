import { useCallback, useEffect, useRef, type RefObject } from "react"

/** The fan's pointer model. A pointer travelling over the tile opens the
    hand (`data-fan-open` on the trigger) and tilts it as a whole; the one
    print under the pointer is marked `data-print-hover` and lifts. Every
    state comes from pointer travel, never from `:hover`: when the sheet
    closes over a resting pointer the browser re-evaluates `:hover` without
    the pointer moving, and the hand used to spring open on its own — which
    read as a print still selected. Nothing here answers until the pointer
    moves again. Reset synchronously before measuring a gallery flight, so
    its source and return rectangles stay flat. */
export function usePhotoStackTilt(root: RefObject<HTMLDivElement | null>) {
  const resetRef = useRef<() => void>(() => {})
  const resetBeforeOpen = useCallback(() => resetRef.current(), [])

  useEffect(() => {
    const trigger = root.current?.querySelector<HTMLButtonElement>(".personal-photos-trigger")
    const stack = root.current?.querySelector<HTMLElement>(".personal-photos-stack")
    const tilt = root.current?.querySelector<HTMLElement>(".personal-photos-stack-tilt")
    if (!trigger || !stack || !tilt) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const fine = matchMedia("(hover: hover) and (pointer: fine)")
    let frame = 0
    let point = { x: NaN, y: NaN }
    let target: Element | null = null
    let hovered: HTMLElement | null = null
    let locked = false

    const printFrom = (node: Element | null) => node?.closest<HTMLElement>(".personal-photos-print") ?? null
    const hover = (print: HTMLElement | null) => {
      if (print === hovered) return
      hovered?.removeAttribute("data-print-hover")
      hovered = print
      hovered?.setAttribute("data-print-hover", "")
    }
    const reset = (immediate = false) => {
      cancelAnimationFrame(frame)
      frame = 0
      point = { x: NaN, y: NaN }
      if (immediate) tilt.setAttribute("data-tilt-reset", "")
      tilt.removeAttribute("data-tilt-active")
      tilt.style.removeProperty("--photo-stack-rotate-x")
      tilt.style.removeProperty("--photo-stack-rotate-y")
      tilt.style.removeProperty("--photo-stack-light-x")
      tilt.style.removeProperty("--photo-stack-light-y")
      trigger.removeAttribute("data-fan-open")
      hover(null)
    }
    const resetBeforeFlight = () => { locked = true; reset(true) }
    resetRef.current = resetBeforeFlight
    const move = (event: PointerEvent) => {
      if (locked || reduced.matches || !fine.matches || event.pointerType !== "mouse" || trigger.hasAttribute("data-photo-away")) return
      // Only travel is intent: a move that reports the pointer where it
      // already was (a re-dispatch after the sheet's pointer-events change,
      // say) opens nothing.
      if (event.clientX === point.x && event.clientY === point.y) return
      point = { x: event.clientX, y: event.clientY }
      target = event.target as Element | null
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const rect = stack.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        const x = Math.max(-1, Math.min(1, (point.x - rect.left) / rect.width * 2 - 1))
        const y = Math.max(-1, Math.min(1, (point.y - rect.top) / rect.height * 2 - 1))
        tilt.removeAttribute("data-tilt-reset")
        tilt.style.setProperty("--photo-stack-rotate-x", `${(-y * 10).toFixed(2)}deg`)
        tilt.style.setProperty("--photo-stack-rotate-y", `${(x * 10).toFixed(2)}deg`)
        tilt.style.setProperty("--photo-stack-light-x", `${35 + x * 20}%`)
        tilt.style.setProperty("--photo-stack-light-y", `${25 + y * 15}%`)
        tilt.setAttribute("data-tilt-active", "")
        trigger.setAttribute("data-fan-open", "")
        hover(printFrom(target))
      })
    }
    const leave = () => { locked = false; reset() }
    const clear = () => reset(true)
    const away = new MutationObserver(() => {
      if (trigger.hasAttribute("data-photo-away")) resetBeforeFlight()
      else locked = false
    })
    away.observe(trigger, { attributes: true, attributeFilter: ["data-photo-away"] })
    trigger.addEventListener("pointermove", move)
    trigger.addEventListener("pointerleave", leave)
    trigger.addEventListener("pointercancel", leave)
    reduced.addEventListener("change", clear)
    fine.addEventListener("change", clear)
    window.addEventListener("blur", clear)
    window.addEventListener("resize", clear)
    window.addEventListener("scroll", clear, { passive: true })
    return () => {
      reset(true)
      resetRef.current = () => {}
      away.disconnect()
      trigger.removeEventListener("pointermove", move)
      trigger.removeEventListener("pointerleave", leave)
      trigger.removeEventListener("pointercancel", leave)
      reduced.removeEventListener("change", clear)
      fine.removeEventListener("change", clear)
      window.removeEventListener("blur", clear)
      window.removeEventListener("resize", clear)
      window.removeEventListener("scroll", clear)
    }
  }, [root])

  return resetBeforeOpen
}
