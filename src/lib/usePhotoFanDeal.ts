import { useCallback, useEffect, useRef, type RefObject } from "react"

const isDeal = (animation: Animation) => animation instanceof CSSAnimation && animation.animationName === "personal-photos-deal"

/** Deals the fan in the first time it scrolls into view: the middle print
    first, then a beat later for each step out towards the ends (the deal
    itself is `personal-photos-deal` in personal-photos.css).

    The prints ship visible — the attribute is absent from the prerendered
    markup, so nothing depends on JavaScript. On mount a fan still below the
    fold is held back and released the first time it enters the viewport; a
    fan already on screen, or above it, has been seen and stays put, as the
    About sheet's copy does. Returns a finish that snaps the hand to rest, for
    a click that opens the sheet mid-deal: the flights measure the prints, and
    a print still rising would send its photo home to a frame below its own. */
export function usePhotoFanDeal(root: RefObject<HTMLDivElement | null>) {
  const finishRef = useRef<() => void>(() => {})
  const finishDeal = useCallback(() => finishRef.current(), [])

  useEffect(() => {
    const stack = root.current?.querySelector<HTMLElement>(".personal-photos-stack")
    if (!stack || !("IntersectionObserver" in window)) return
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (stack.getBoundingClientRect().top <= innerHeight) return

    // The top margin stretches the root far above the viewport, so a jump
    // that carries the fan straight past the trigger line still deals it
    // rather than leaving the tile empty until it is scrolled back to.
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      stack.dataset.deal = "dealing"
    }, { rootMargin: "9999px 0px -12% 0px" })
    // Retired once the last print has landed, so a print the row gains later
    // — a fifth when a phone turns to landscape — simply appears.
    const onEnd = (event: AnimationEvent) => {
      if (event.animationName !== "personal-photos-deal") return
      if (!stack.getAnimations({ subtree: true }).some(isDeal)) finish()
    }
    const finish = () => {
      observer.disconnect()
      stack.removeEventListener("animationend", onEnd)
      stack.removeEventListener("animationcancel", onEnd)
      stack.removeAttribute("data-deal")
    }

    stack.dataset.deal = "pending"
    stack.addEventListener("animationend", onEnd)
    stack.addEventListener("animationcancel", onEnd)
    observer.observe(stack)
    finishRef.current = finish
    return () => {
      finishRef.current = () => {}
      finish()
    }
  }, [root])

  return finishDeal
}
