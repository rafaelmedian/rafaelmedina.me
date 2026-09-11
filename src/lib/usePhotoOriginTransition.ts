import { useEffect, useLayoutEffect, useRef } from "react"

import { cssTimeToMilliseconds } from "./cssTime"

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
  height: number
  angle: number
  depth: number
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
    const computed = getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    const matrix = new DOMMatrixReadOnly(computed.transform)
    const angle = Math.atan2(matrix.b, matrix.a)
    const scale = rect.width / (element.offsetWidth * Math.abs(Math.cos(angle)) + element.offsetHeight * Math.abs(Math.sin(angle)))
    const image = element.querySelector("img")!
    return {
      id: element.dataset.photoId, element, image, rect,
      // The print's own box, before its lean: `rect` is the leaning card's
      // bounding box, which is wider and taller than the card itself.
      width: element.offsetWidth * scale, height: element.offsetHeight * scale,
      angle: angle * 180 / Math.PI, depth: Number(computed.zIndex) || 0,
      frame: readStyles(element, frameProperties), imageStyles: readStyles(image, imageProperties),
    }
  })
  away.forEach((print) => print.setAttribute("data-photo-away", ""))
  return origins
}

/** The print a photo with no frame of its own comes out of, and goes home to:
    the one nearest it across the fan. Aiming every one of them at the same
    point would draw the sheet down a single line; nearest-by-column keeps the
    left of the sheet going to the left of the pile, so it is dealt the way it
    gathers. Both directions borrow the same print, so a photo leaves by the
    way it came. */
function nearestPrint(sources: PhotoOrigin[], target: DOMRect) {
  const centre = target.left + target.width / 2
  const distance = (source: PhotoOrigin) => Math.abs(source.rect.left + source.rect.width / 2 - centre)
  return sources.reduce((closest, source) => distance(source) < distance(closest) ? source : closest)
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
    // The opener wears it only while the sheet is actually over it. The fan
    // answers to the pointer as a whole, and the pointer is still on the tile
    // — the sheet just happens to be covering it — so without this the hand
    // opens again the moment the sheet stops taking pointer events. Holding it
    // shut for the flight as well only moved that to the end: the photos came
    // home to a closed hand and the whole row opened out from under them a
    // beat later. Letting it go as the close begins puts the hand in its
    // resting shape before anything leaves the sheet, and the photos fly to
    // the frames they will actually sit in.
    if (open) opener.setAttribute("data-photo-away", "")
    return () => {
      sources.forEach(({ element }) => { element.removeAttribute("data-photo-away") })
      opener.removeAttribute("data-photo-away")
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

    if (!open) {
      // Give the tile its focus back before anything leaves the sheet. The
      // dialog returns it here anyway, but only on unmount, and the flight
      // holds that off until the photos have landed — so the hand used to
      // open out from under them a beat after they arrived, which read as the
      // whole row settling a second time. Flushing while the prints still
      // wear the placeholder, which has no transition, snaps the hand into
      // its new shape in one frame, and the flights below are measured
      // against the frames it actually keeps.
      opener.focus({ preventScroll: true })
      void opener.offsetWidth
    }
    const sources = open ? origins : measurePhotoOrigins(opener)
    if (!sources.length) return
    const tokens = getComputedStyle(strip)
    const cssDuration = tokens.getPropertyValue(open ? "--photo-open-duration" : "--photo-close-duration").trim()
    const duration = cssTimeToMilliseconds(cssDuration)
    const easing = tokens.getPropertyValue("--photo-motion-ease").trim()
    // A borrowed print has no frame to morph into, so those photos fade at the
    // pile: in on the entrance curve, out on the accelerating one.
    const fadeEasing = tokens.getPropertyValue(open ? "--ease-smooth" : "--ease-exit").trim()
    // One beat in both directions: every print leaves the fan together and
    // every print comes home together, the way the project preview grows out
    // of its card in a single move. Dealing them out one after another read as
    // the fan scattering rather than as one thing opening.
    const timing: KeyframeAnimationOptions = { duration, easing, fill: "both" }
    const previousFlights = flights.current
    const returning = new Set<string | undefined>()
    flights.current = []

    const slides = Array.from(strip.querySelectorAll<HTMLElement>(".personal-photos-slide"))
    const bounds = strip.getBoundingClientRect()

    slides.forEach((slide) => {
      const target = slide.getBoundingClientRect()
      const previous = previousFlights.find((flight) => flight.slide === slide)
      // A photo flies only while its slot is on screen: a card bound for a slot
      // a screen away would have to cross all of it inside one 200ms beat,
      // which reads as the sheet scattering rather than gathering.
      const lands = target.right > bounds.left && target.left < bounds.right && target.bottom > bounds.top && target.top < bounds.bottom
      // The whole screenful travels, in both directions: a photo with a print
      // of its own grows out of that print and lands back on it, and one
      // without borrows the print nearest it, sliding out from under the cards
      // that carry their own photo and slipping back under them on the way
      // home. Left to fade where they stood, those photos went transparent in
      // place with the page showing through them, and the sheet arrived by a
      // different move than the one it left by.
      const own = lands ? sources.find((item) => item.id === slide.dataset.photoId) : undefined
      const source = own ?? (lands ? nearestPrint(sources, target) : undefined)
      if (!source) {
        if (previous) removeFlight(previous)
        return
      }
      // A slot can be on screen and still have no box to fly to mid-relayout.
      if (!target.width || !target.height || !source.width) {
        if (previous) removeFlight(previous)
        return
      }
      if (own) returning.add(own.id)
      // A slide can wear a scale of its own — the sphere shrinks the photos
      // that sit back from its face — so the flight is built at the slide's
      // layout size and carries that scale in its transform, just as it
      // carries the print's at the other end. Read at the drawn size instead,
      // the frame's padding and caption kept their full size inside a card
      // that had shrunk around them.
      const layoutWidth = slide.offsetWidth
      const slideScale = target.width / layoutWidth
      const dx = source.rect.left + source.rect.width / 2 - (target.left + target.width / 2)
      const dy = source.rect.top + source.rect.height / 2 - (target.top + target.height / 2)
      const homeTransform = (scale: number) => `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${source.angle}deg) scale(${scale})`
      const originTransform = homeTransform(source.width / layoutWidth)
      // A photo with no print of its own has to come to rest inside the print
      // it borrowed, or it hangs out past the edges of the very card that is
      // meant to hide it. Its slot is the taller shape, so the print's height
      // is usually what it has to fit rather than the print's width.
      const tuckedTransform = homeTransform(Math.min(source.width / layoutWidth, source.height / slide.offsetHeight))
      const restingTransform = `translate(-50%, -50%) rotate(0deg) scale(${slideScale})`
      const targetFrame = { ...readStyles(slide, frameProperties), transform: restingTransform }
      const slideImage = slide.querySelector("img")!
      const targetImage = readStyles(slideImage, imageProperties)
      const clone = previous?.clone ?? slide.cloneNode(true) as HTMLElement
      const image = clone.querySelector("img")!
      const caption = clone.querySelector("figcaption")!

      if (!previous) {
        clone.classList.add("personal-photos-flight")
        clone.setAttribute("aria-hidden", "true")
        // A slide the keyboard can reach would leave a copy of that stop in
        // the page for the length of the flight.
        clone.removeAttribute("tabindex")
        // The fan is a pile, not a row: the middle print is in front and every
        // print behind it steps back. A flight that travelled on one flat tier
        // came down in DOM order instead, and the print beside it swallowed it
        // whole — a photo that plainly never came back. A borrowed print is
        // somebody else's frame, so a flight without one rides home beneath
        // the whole pile and is gone behind it.
        if (own) clone.style.setProperty("--print-depth", String(own.depth))
        else clone.setAttribute("data-photo-trailing", "")
        Object.assign(clone.style, targetFrame, {
          left: `${target.left + target.width / 2}px`, top: `${target.top + target.height / 2}px`,
          width: `${layoutWidth}px`,
        })
        Object.assign(image.style, targetImage)
        // Keep one bitmap for the entire flight: the sheet's full-size image
        // once it has arrived, otherwise the thumbnail the print already
        // shows. A borrowed print carries the wrong photo, so a flight with no
        // print of its own keeps whatever the slide was already showing.
        const imageLoaded = slideImage.complete && slideImage.naturalWidth
        if (imageLoaded || own) {
          image.src = imageLoaded ? slideImage.currentSrc : own!.image.currentSrc
          image.removeAttribute("srcset")
          image.style.backgroundImage = "none"
        }
        image.decoding = "sync"
        document.body.appendChild(clone)
      }

      // The print's own frame and crop, expressed at the size the slide is now.
      const originFrame = (print: PhotoOrigin) => ({
        ...scalePixels(print.frame, layoutWidth / print.element.offsetWidth), transform: originTransform,
      })
      const originImage = (print: PhotoOrigin) => scalePixels(print.imageStyles, layoutWidth / print.element.offsetWidth)
      const currentTransform = readFlightTransform(clone)
      const currentFrame = { ...readStyles(clone, frameProperties), transform: currentTransform }
      const currentImage = readStyles(image, imageProperties)
      const currentOpacity = getComputedStyle(clone).opacity
      const currentCaptionOpacity = getComputedStyle(caption).opacity
      previous?.animations.forEach((animation) => animation.cancel())
      slide.style.opacity = "0"
      const animations = own ? [
        clone.animate([open ? originFrame(own) : currentFrame, open ? targetFrame : originFrame(own)], timing),
        image.animate([open ? originImage(own) : currentImage, open ? targetImage : originImage(own)], timing),
        caption.animate([{ opacity: open ? 0 : currentCaptionOpacity }, { opacity: open ? 1 : 0 }], timing),
      ] : open ? [
        // The same trip, run backwards. There is no print-shaped frame for
        // this one to grow out of, so the whole card swells from the print it
        // borrowed rather than morphing, and it waits out the first sliver of
        // the flight: shown from the first frame it would sit on top of the
        // very cards it is meant to come out from under. Its caption rides
        // with the card rather than fading on its own.
        clone.animate([{ transform: previous ? currentTransform : tuckedTransform }, { transform: restingTransform }], timing),
        clone.animate(
          previous
            ? [{ opacity: currentOpacity }, { opacity: 1 }]
            : [{ opacity: 0 }, { opacity: 0, offset: 0.15 }, { opacity: 1 }],
          { ...timing, easing: fadeEasing },
        ),
      ] : [
        // There is no print-shaped frame for this one to land in, so the whole
        // card shrinks rather than morphing, and it leaves on the accelerating
        // curve: full strength for most of the trip, then out just before the
        // print it is tucking under comes down.
        clone.animate([{ transform: currentTransform }, { transform: tuckedTransform }], timing),
        clone.animate([{ opacity: currentOpacity }, { opacity: 0, offset: 0.85 }], { ...timing, easing: fadeEasing }),
      ]
      const flight = { slide, clone, animations }
      flights.current.push(flight)
      animations[0].onfinish = () => {
        if (!open && own) own.element.removeAttribute("data-photo-away")
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

    const startingScrollTop = strip.scrollTop
    const interruptOnScroll = () => {
      // Restoring the saved position queues a scroll event before these flights
      // start. Only a subsequent position change should interrupt the motion.
      if (Math.abs(strip.scrollTop - startingScrollTop) > 0.5) clear()
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
