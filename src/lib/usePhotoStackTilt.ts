import { useCallback, useEffect, useRef, type RefObject } from "react"

/** Marks genuine pointer travel over the card so the prints can change angle.
    This remains event-driven instead of using :hover: when the sheet closes
    over a resting pointer, the browser re-evaluates :hover without movement.
    Keeping that from reactivating the pose also gives gallery flights a stable
    resting frame at both ends. */
export function usePhotoStackTilt(root: RefObject<HTMLDivElement | null>) {
  const resetRef = useRef<() => void>(() => {})
  const resetBeforeOpen = useCallback(() => resetRef.current(), [])

  useEffect(() => {
    const trigger = root.current?.querySelector<HTMLButtonElement>(".personal-photos-trigger")
    const tilt = root.current?.querySelector<HTMLElement>(".personal-photos-stack-tilt")
    if (!trigger || !tilt) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const fine = matchMedia("(hover: hover) and (pointer: fine)")
    let point = { x: NaN, y: NaN }
    let locked = false
    const reset = (immediate = false) => {
      point = { x: NaN, y: NaN }
      if (immediate) tilt.setAttribute("data-tilt-reset", "")
      trigger.removeAttribute("data-fan-open")
    }
    const resetBeforeFlight = () => {
      locked = true
      reset(true)
    }
    resetRef.current = resetBeforeFlight
    const move = (event: PointerEvent) => {
      if (locked || reduced.matches || !fine.matches || event.pointerType !== "mouse" || trigger.hasAttribute("data-photo-away")) return
      // Only travel is intent: a move that reports the pointer where it
      // already was (a re-dispatch after the sheet's pointer-events change,
      // say) opens nothing.
      if (event.clientX === point.x && event.clientY === point.y) return
      point = { x: event.clientX, y: event.clientY }
      tilt.removeAttribute("data-tilt-reset")
      trigger.setAttribute("data-fan-open", "")
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
      reduced.removeEventListener("change", clear)
      fine.removeEventListener("change", clear)
      window.removeEventListener("blur", clear)
      window.removeEventListener("resize", clear)
      window.removeEventListener("scroll", clear)
    }
  }, [root])

  return resetBeforeOpen
}
