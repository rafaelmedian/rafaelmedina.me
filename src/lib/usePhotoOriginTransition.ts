import { useEffect, useLayoutEffect, useRef } from "react"

const useClientLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect
const frameProperties = ["height", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "borderRadius", "boxShadow"] as const
const imageProperties = ["height", "borderRadius", "objectPosition"] as const

function readStyles(element: HTMLElement, properties: readonly (keyof CSSStyleDeclaration)[]) {
  const computed = getComputedStyle(element)
  return Object.fromEntries(properties.map((property) => [property, String(computed[property])]))
}

// Express the small print in the flight's coordinate system. Its outer scale
// stays uniform; changing the image frame crops the photo instead of stretching it.
function scalePixels(styles: Record<string, string>, scale: number) {
  return Object.fromEntries(Object.entries(styles).map(([property, value]) => [
    property, value.replace(/(-?[\d.]+)px/g, (_, number) => `${Number(number) * scale}px`),
  ]))
}

// Both endpoints centre the flight on its own box with -50%, which resolves
// against a box that shrinks all the way home. A computed matrix bakes that
// half in at the size it was read, so interpolating from one carries the open
// card's half-height through a card that is no longer that tall: the photo
// arcs up and drops the last pixels onto the print. Recover the offsets and
// hand the interruption back the same percentage form.
function readFlightTransform(element: HTMLElement) {
  const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
  const x = matrix.e + element.offsetWidth / 2
  const y = matrix.f + element.offsetHeight / 2
  const angle = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI
  return `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle}deg) scale(${Math.hypot(matrix.a, matrix.b)})`
}

type PhotoOrigin = {
  id: string | undefined
  element: HTMLElement
  image: HTMLImageElement
  rect: DOMRect
  width: number
  angle: number
  frame: Record<string, string>
  imageStyles: Record<string, string>
}

export function measurePhotoOrigins(opener: HTMLElement): PhotoOrigin[] {
  const prints = Array.from(opener.querySelectorAll<HTMLElement>(".personal-photos-print"))
  // Closing measures prints that already wear the flat placeholder. Lift it for
  // the read, so the return lands on the same card shadow it hands off to.
  const away = prints.filter((print) => print.hasAttribute("data-photo-away"))
  away.forEach((print) => print.removeAttribute("data-photo-away"))
  const origins = prints.map((element) => {
    const rect = element.getBoundingClientRect()
    const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform)
    const angle = Math.atan2(matrix.b, matrix.a)
    const scale = rect.width / (element.offsetWidth * Math.abs(Math.cos(angle)) + element.offsetHeight * Math.abs(Math.sin(angle)))
    const image = element.querySelector("img")!
    return {
      id: element.dataset.photoId, element, image, rect,
      width: element.offsetWidth * scale, angle: angle * 180 / Math.PI,
      frame: readStyles(element, frameProperties), imageStyles: readStyles(image, imageProperties),
    }
  })
  away.forEach((print) => print.setAttribute("data-photo-away", ""))
  return origins
}

type Flight = { slide: HTMLElement; clone: HTMLElement; animations: Animation[] }

function removeFlight({ slide, clone, animations }: Flight) {
  animations.forEach((animation) => animation.cancel())
  clone.remove()
  slide.style.removeProperty("opacity")
}

/** Copies travel outside the scroller and match both endpoints before handoff. */
export function usePhotoOriginTransition(
  strip: HTMLDivElement | null,
  open: boolean,
  opener: HTMLElement | null,
  origins: PhotoOrigin[],
  reducedMotion: boolean,
  onCloseComplete: () => void,
) {
  const flights = useRef<Flight[]>([])
  const sourceFades = useRef<Animation[]>([])

  useClientLayoutEffect(() => {
    if (!strip || !opener) return
    const sources = measurePhotoOrigins(opener)
    sources.forEach(({ element }) => { element.setAttribute("data-photo-away", "") })
    return () => {
      sources.forEach(({ element }) => { element.removeAttribute("data-photo-away") })
    }
  }, [strip, origins, reducedMotion, opener, open])

  useClientLayoutEffect(() => {
    const clear = () => {
      flights.current.forEach(removeFlight)
      flights.current = []
      sourceFades.current.forEach((animation) => animation.cancel())
      sourceFades.current = []
    }

    if (!strip || reducedMotion || !opener) {
      clear()
      if (strip && !open) onCloseComplete()
      return
    }

    const sources = open ? origins : measurePhotoOrigins(opener)
    if (!sources.length) return
    const tokens = getComputedStyle(strip)
    const cssDuration = tokens.getPropertyValue(open ? "--photo-open-duration" : "--photo-close-duration").trim()
    // Production CSS can minify 200ms to .2s; WAAPI always expects milliseconds.
    const duration = parseFloat(cssDuration) * (cssDuration.endsWith("ms") ? 1 : 1000)
    const easing = tokens.getPropertyValue("--photo-motion-ease").trim()
    const timing: KeyframeAnimationOptions = { duration, easing, fill: "both" }
    const previousFlights = flights.current
    const returning = new Set<string | undefined>()
    flights.current = []

    const slides = Array.from(strip.querySelectorAll<HTMLElement>(".personal-photos-slide"))
    const bounds = strip.getBoundingClientRect()
    const sourceIndices = new Map(sources.map((source) => [source, slides.findIndex((slide) => slide.dataset.photoId === source.id)]))

    slides.forEach((slide, index) => {
      const target = slide.getBoundingClientRect()
      const previous = previousFlights.find((flight) => flight.slide === slide)
      const matchingSource = sources.find((item) => item.id === slide.dataset.photoId)
      // Wide screens can expose more photos than the preview holds. Open those
      // from the nearest retained print in the same beat, using their own image.
      const source = matchingSource ?? (open && target.right > bounds.left && target.left < bounds.right
        ? sources.reduce((nearest, candidate) => Math.abs(sourceIndices.get(candidate)! - index) < Math.abs(sourceIndices.get(nearest)! - index) ? candidate : nearest)
        : undefined)
      if (!source) {
        if (previous) removeFlight(previous)
        return
      }
      // Every retained print travels, even when its carousel endpoint is offscreen.
      if (!target.width || !target.height || !source.width) {
        if (previous) removeFlight(previous)
        return
      }
      returning.add(source.id)
      const dx = source.rect.left + source.rect.width / 2 - (target.left + target.width / 2)
      const dy = source.rect.top + source.rect.height / 2 - (target.top + target.height / 2)
      const scale = source.width / target.width
      const originTransform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${source.angle}deg) scale(${scale})`
      const restingTransform = "translate(-50%, -50%) rotate(0deg) scale(1)"
      const sourceFactor = target.width / source.element.offsetWidth
      const originFrame = { ...scalePixels(source.frame, sourceFactor), transform: originTransform }
      const targetFrame = { ...readStyles(slide, frameProperties), transform: restingTransform }
      const originImage = scalePixels(source.imageStyles, sourceFactor)
      const slideImage = slide.querySelector("img")!
      const targetImage = readStyles(slideImage, imageProperties)
      const clone = previous?.clone ?? slide.cloneNode(true) as HTMLElement
      const image = clone.querySelector("img")!
      const caption = clone.querySelector("figcaption")!

      if (!previous) {
        clone.classList.add("personal-photos-flight")
        clone.setAttribute("aria-hidden", "true")
        Object.assign(clone.style, targetFrame, {
          left: `${target.left + target.width / 2}px`, top: `${target.top + target.height / 2}px`,
          width: `${target.width}px`,
        })
        Object.assign(image.style, targetImage)
        // Keep one bitmap for the entire flight. Extra photos use their own
        // thumbnail, following the carousel's full-size/thumbnail naming pair.
        const imageLoaded = slideImage.complete && slideImage.naturalWidth
        image.src = imageLoaded
          ? slideImage.currentSrc
          : matchingSource?.image.currentSrc || slideImage.src.replace(/\.webp$/, "-thumb.webp")
        image.decoding = "sync"
        image.removeAttribute("srcset")
        image.style.backgroundImage = "none"
        document.body.appendChild(clone)
      }

      const currentFrame = { ...readStyles(clone, frameProperties), transform: readFlightTransform(clone) }
      const currentImage = readStyles(image, imageProperties)
      const currentCaptionOpacity = getComputedStyle(caption).opacity
      previous?.animations.forEach((animation) => animation.cancel())
      slide.style.opacity = "0"
      const animation = clone.animate([open ? originFrame : currentFrame, open ? targetFrame : originFrame], timing)
      const imageAnimation = image.animate([open ? originImage : currentImage, open ? targetImage : originImage], timing)
      const captionAnimation = caption.animate([
        { opacity: open ? 0 : currentCaptionOpacity }, { opacity: open ? 1 : 0 },
      ], timing)
      const flight = { slide, clone, animations: [animation, imageAnimation, captionAnimation] }
      flights.current.push(flight)
      animation.onfinish = () => {
        if (!open) source.element.removeAttribute("data-photo-away")
        removeFlight(flight)
        flights.current = flights.current.filter((item) => item !== flight)
      }
    })

    if (!open) {
      sourceFades.current = sources.filter((source) => !returning.has(source.id)).map(({ element, image }) => {
        element.removeAttribute("data-photo-away")
        return image.animate([{ opacity: 0 }, { opacity: 1 }], timing)
      })
    }

    let disposed = false
    if (!open) {
      const animations = [...flights.current.flatMap((flight) => flight.animations), ...sourceFades.current]
      void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
        if (!disposed) onCloseComplete()
      })
    }

    const startingScrollLeft = strip.scrollLeft
    const interruptOnScroll = () => {
      // Restoring the saved position queues a scroll event before these flights
      // start. Only a subsequent position change should interrupt the motion.
      if (Math.abs(strip.scrollLeft - startingScrollLeft) > 0.5) clear()
    }
    strip.addEventListener("scroll", interruptOnScroll)
    strip.addEventListener("pointerdown", clear, { once: true })
    window.addEventListener("resize", clear, { once: true })
    return () => {
      disposed = true
      strip.removeEventListener("scroll", interruptOnScroll)
      strip.removeEventListener("pointerdown", clear)
      window.removeEventListener("resize", clear)
    }
  }, [strip, open, opener, origins, reducedMotion, onCloseComplete])

  useEffect(() => () => {
    flights.current.forEach(removeFlight)
    flights.current = []
    sourceFades.current.forEach((animation) => animation.cancel())
    sourceFades.current = []
  }, [])
}
