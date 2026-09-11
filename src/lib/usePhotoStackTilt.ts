import { useCallback, useEffect, useRef, type RefObject } from "react"

import { cssTimeToMilliseconds } from "./cssTime"

/** The fan's pointer model. A pointer travelling over the tile opens the
    hand (`data-fan-open` on the trigger). Over the label or the margin the
    whole hand tilts toward the pointer; over a print the hand flattens and
    that print alone tilts (`data-print-tilt`, `--print-rotate`) and lifts
    (`data-print-hover`). A press on a print pulls it: it follows the
    pointer with a rubber band's resistance (`data-print-drag`,
    `--print-drag-x/y`) and turns further as it is pulled, and when it is
    let go it springs back into the hand while the click it was opens the
    sheet on that photo. Every state comes from pointer travel, never from
    `:hover`: when the sheet closes over a resting pointer the browser
    re-evaluates `:hover` without the pointer moving, and the hand used to
    spring open on its own — which read as a print still selected. Nothing
    here answers until the pointer moves again. Reset synchronously before
    measuring a gallery flight, so its source and return rectangles stay
    flat. */
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
    /** A press on a print: where it began, and whether it has become a pull. */
    let press: { print: HTMLElement; id: number; x: number; y: number; moved: boolean } | null = null
    /** The spring home that a release has put off until its click has been
        answered. */
    let springTimer = 0
    /** How far a pull of `p` pixels moves the print: p * L / (L + p), so it
        follows the hand at first and then resists — 100px pulls 32, 200px
        39, 400px 43. */
    const pullReach = 48
    /** Travel before a press counts as a pull; a click that never became a
        pull has nothing to spring back from. */
    const pullSlop = 6
    /** How far the whole hand tips toward a pointer at the tile's edge. It
        was 10deg, which read as the tile lurching rather than leaning. */
    const handTilt = 6
    /** How far one print turns toward a pointer at its own edge. A print is a
        third of the hand's width, so the same 10deg the hand once took swept
        three times as fast under the pointer; half of it reads as the lean
        the whole hand used to have. */
    const printTurn = 5

    const printFrom = (node: Element | null) => node?.closest<HTMLElement>(".personal-photos-print") ?? null
    const hover = (print: HTMLElement | null) => {
      if (print === hovered) return
      hovered?.removeAttribute("data-print-hover")
      hovered?.removeAttribute("data-print-tilt")
      hovered?.style.removeProperty("--print-rotate")
      hovered = print
      hovered?.setAttribute("data-print-hover", "")
    }
    /** Lets the whole hand back down, keeping the hand open and the print
        under the pointer where it is. */
    const flattenHand = () => {
      tilt.removeAttribute("data-tilt-active")
      tilt.style.removeProperty("--photo-stack-rotate-x")
      tilt.style.removeProperty("--photo-stack-rotate-y")
    }
    /** Turns one print toward the pointer, about the axis square to the
        pointer's offset from the print's own centre, up to `printTurn` at
        its edge. Measured from the stationary stack and the print's layout box,
        never from the print's own rect: a print turning under the pointer
        would move its own reference and chase itself. */
    const readPrintRotation = (print: HTMLElement, stackRect: DOMRect, x: number, y: number, reach: number) => {
      const nx = Math.max(-reach, Math.min(reach, (x - (stackRect.left + print.offsetLeft + print.offsetWidth / 2)) / (print.offsetWidth / 2)))
      const ny = Math.max(-reach, Math.min(reach, (y - (stackRect.top + print.offsetTop + print.offsetHeight / 2)) / (print.offsetHeight / 2)))
      const angle = printTurn * Math.hypot(nx, ny)
      return angle < 0.05 ? "none" : `${(-ny).toFixed(3)} ${nx.toFixed(3)} 0 ${angle.toFixed(2)}deg`
    }
    /** Lets a pulled print go. Sprung, it glides back into the hand from
        where it was let go; otherwise the pull is simply dropped. */
    const endPull = (spring: boolean) => {
      clearTimeout(springTimer)
      springTimer = 0
      const held = press
      press = null
      if (!held) return
      const { print } = held
      if (print.hasPointerCapture(held.id)) print.releasePointerCapture(held.id)
      const tokens = getComputedStyle(print)
      // Where the print is as it is let go, lift and pull together.
      const from = tokens.translate
      print.removeAttribute("data-print-drag")
      print.style.removeProperty("--print-drag-x")
      print.style.removeProperty("--print-drag-y")
      if (!spring || !held.moved || reduced.matches) return
      // A Web Animation rather than the transition: the print becomes the
      // flight's placeholder a beat later, and the placeholder has none.
      print.animate([{ translate: from }, { translate: "0px 0px" }], {
        duration: cssTimeToMilliseconds(tokens.getPropertyValue("--duration-slow")),
        easing: tokens.getPropertyValue("--ease-smooth").trim() || "ease-out",
      })
    }
    const reset = (immediate = false) => {
      cancelAnimationFrame(frame)
      frame = 0
      endPull(false)
      point = { x: NaN, y: NaN }
      if (immediate) tilt.setAttribute("data-tilt-reset", "")
      flattenHand()
      tilt.style.removeProperty("--photo-stack-light-x")
      tilt.style.removeProperty("--photo-stack-light-y")
      trigger.removeAttribute("data-fan-open")
      hover(null)
    }
    /** The click that opens the sheet measures the prints right after this,
        so the hand and every turn are flattened in the same frame — but a
        pulled print keeps its pull for the measurement, so its photo takes
        off from where the pointer let it go and the placeholder springs home
        beneath the sheet once the measurement has been taken. */
    const resetBeforeFlight = () => {
      locked = true
      const pulled = press
      if (pulled) {
        clearTimeout(springTimer)
        springTimer = 0
        queueMicrotask(() => { if (press === pulled) endPull(true) })
        press = null
        reset(true)
        press = pulled
        return
      }
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
      target = event.target as Element | null
      if (press && event.pointerId === press.id && !press.moved && Math.hypot(point.x - press.x, point.y - press.y) > pullSlop) press.moved = true
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const rect = stack.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        const x = Math.max(-1, Math.min(1, (point.x - rect.left) / rect.width * 2 - 1))
        const y = Math.max(-1, Math.min(1, (point.y - rect.top) / rect.height * 2 - 1))
        const print = press?.print ?? printFrom(target)
        const rotation = print ? readPrintRotation(print, rect, point.x, point.y, press ? 1.6 : 1) : "none"
        tilt.removeAttribute("data-tilt-reset")
        tilt.style.setProperty("--photo-stack-light-x", `${35 + x * 20}%`)
        tilt.style.setProperty("--photo-stack-light-y", `${25 + y * 15}%`)
        trigger.setAttribute("data-fan-open", "")
        if (!press) hover(print)
        if (print) {
          flattenHand()
          print.style.setProperty("--print-rotate", rotation)
          print.setAttribute("data-print-tilt", "")
        }
        if (press) {
          // Pulled: the print follows the pointer with resistance, and turns
          // further the further it is pulled.
          const dx = point.x - press.x
          const dy = point.y - press.y
          const pull = Math.hypot(dx, dy)
          const give = pull ? pullReach / (pullReach + pull) : 0
          press.print.style.setProperty("--print-drag-x", `${(dx * give).toFixed(1)}px`)
          press.print.style.setProperty("--print-drag-y", `${(dy * give).toFixed(1)}px`)
          return
        }
        if (!print) {
          tilt.style.setProperty("--photo-stack-rotate-x", `${(-y * handTilt).toFixed(2)}deg`)
          tilt.style.setProperty("--photo-stack-rotate-y", `${(x * handTilt).toFixed(2)}deg`)
          tilt.setAttribute("data-tilt-active", "")
        }
      })
    }
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || press || locked || reduced.matches || !fine.matches || event.pointerType !== "mouse" || trigger.hasAttribute("data-photo-away")) return
      const print = printFrom(event.target as Element | null)
      if (!print) return
      press = { print, id: event.pointerId, x: event.clientX, y: event.clientY, moved: false }
      // Captured by the print, so the release and the click it becomes keep
      // the print as their target however far it was pulled.
      print.setPointerCapture(event.pointerId)
      hover(print)
      print.setAttribute("data-print-drag", "")
    }
    const up = (event: PointerEvent) => {
      if (!press || event.pointerId !== press.id) return
      if (event.type === "pointercancel") {
        endPull(true)
        return
      }
      // The click follows on the same beat and, if it opens the sheet, takes
      // the pull for its measurement first; a release that becomes no click
      // springs home on its own.
      springTimer = window.setTimeout(() => endPull(true), 0)
    }
    const leave = () => { if (press) return; locked = false; reset() }
    const clear = () => reset(true)
    const away = new MutationObserver(() => {
      if (trigger.hasAttribute("data-photo-away")) resetBeforeFlight()
      else locked = false
    })
    away.observe(trigger, { attributes: true, attributeFilter: ["data-photo-away"] })
    trigger.addEventListener("pointerdown", down)
    trigger.addEventListener("pointermove", move)
    trigger.addEventListener("pointerup", up)
    trigger.addEventListener("pointercancel", up)
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
      trigger.removeEventListener("pointerdown", down)
      trigger.removeEventListener("pointermove", move)
      trigger.removeEventListener("pointerup", up)
      trigger.removeEventListener("pointercancel", up)
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
