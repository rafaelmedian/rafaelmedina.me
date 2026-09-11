import { cssTimeToMilliseconds } from "./cssTime"

/** Where a photo sat on screen in the layout being torn down: its drawn box,
    its corner as a share of its layout width (the globe draws its slides
    scaled, so the drawn corner is that share of the drawn width), and the
    bitmap it was showing. */
export type SlideSnapshot = { rect: DOMRect; cornerShare: number; src: string }

/** Every photo with an id, where the current layout has it. Taken before a
    switch unmounts that layout. A slide on the far side of the globe is
    display: none and has no box, so it takes no part in the flight. */
export function snapshotSlides(stage: HTMLElement): Map<string, SlideSnapshot> {
  const snapshot = new Map<string, SlideSnapshot>()
  stage.querySelectorAll<HTMLElement>(".personal-photos-slide[data-photo-id]").forEach((slide) => {
    const rect = slide.getBoundingClientRect()
    if (!rect.width || !rect.height || !slide.offsetWidth) return
    const image = slide.querySelector("img")
    snapshot.set(slide.dataset.photoId!, {
      rect,
      cornerShare: parseFloat(getComputedStyle(slide).borderRadius) / slide.offsetWidth,
      src: image?.complete && image.naturalWidth ? image.currentSrc : "",
    })
  })
  return snapshot
}

/**
 * Reorganises the photos from one layout into the other: each photo on
 * screen flies from where the old layout left it to where the new one has
 * put it, as a copy of its new slide over the stage — the same clone the
 * open and close flights use — over --photo-layout-duration on
 * --ease-smooth, its corner morphing between the two layouts' radii, while
 * the slide underneath waits hidden. Copies, and anything that was off
 * screen at both ends, simply appear in the already-opaque sheet. Returns a
 * function that ends every flight at once, for a close or another switch
 * mid-way.
 */
export function flyBetweenLayouts(stage: HTMLElement, from: Map<string, SlideSnapshot>, onDone: () => void): () => void {
  const tokens = getComputedStyle(stage)
  const duration = cssTimeToMilliseconds(tokens.getPropertyValue("--photo-layout-duration"))
  const easing = tokens.getPropertyValue("--ease-smooth").trim() || "ease-out"
  const bounds = stage.getBoundingClientRect()
  const onScreen = (rect: DOMRect) => rect.right > bounds.left && rect.left < bounds.right && rect.bottom > bounds.top && rect.top < bounds.bottom
  const flights: { slide: HTMLElement; clone: HTMLElement; animation: Animation }[] = []
  const land = (flight: typeof flights[number]) => {
    flight.slide.style.opacity = ""
    flight.clone.remove()
    const index = flights.indexOf(flight)
    if (index >= 0) flights.splice(index, 1)
    if (!flights.length) onDone()
  }

  const slides = Array.from(stage.querySelectorAll<HTMLElement>(".personal-photos-slide[data-photo-id]"))
  // Nearer photos on top: the flights are appended in the new layout's own
  // stacking order, so the document order stacks them the same way.
  const depth = (slide: HTMLElement) => Number(getComputedStyle(slide).zIndex) || 0
  slides.sort((a, b) => depth(a) - depth(b)).forEach((slide) => {
    const start = from.get(slide.dataset.photoId!)
    if (!start) return
    const target = slide.getBoundingClientRect()
    const layoutWidth = slide.offsetWidth
    if (!target.width || !target.height || !layoutWidth) return
    if (!onScreen(start.rect) && !onScreen(target)) return
    const clone = slide.cloneNode(true) as HTMLElement
    clone.classList.add("personal-photos-flight")
    clone.setAttribute("aria-hidden", "true")
    // Neither a stop for the keyboard nor a slide for the globe or the
    // flights to find; and its own look, not the canvas's.
    for (const attribute of ["tabindex", "role", "aria-label", "data-photo-id", "data-held", "data-sphere-far", "data-sphere-hidden"]) clone.removeAttribute(attribute)
    clone.querySelector("figcaption")?.remove()
    clone.dataset.photoFlight = slide.dataset.photoId
    // The slide's own inline transform, shade and hold go; the flight is
    // placed and moved on its own.
    clone.removeAttribute("style")
    const slideImage = slide.querySelector("img")!
    const image = clone.querySelector("img")!
    // One bitmap for the whole flight: the new slide's if it has arrived,
    // else the one the old layout was already showing.
    const src = slideImage.complete && slideImage.naturalWidth ? slideImage.currentSrc : start.src
    if (src) {
      image.src = src
      image.removeAttribute("srcset")
      image.style.backgroundImage = "none"
    }
    image.decoding = "sync"
    Object.assign(clone.style, { left: `${target.left + target.width / 2}px`, top: `${target.top + target.height / 2}px`, width: `${layoutWidth}px` })
    const dx = start.rect.left + start.rect.width / 2 - (target.left + target.width / 2)
    const dy = start.rect.top + start.rect.height / 2 - (target.top + target.height / 2)
    document.body.appendChild(clone)
    slide.style.opacity = "0"
    const animation = clone.animate([
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${start.rect.width / layoutWidth})`, borderRadius: `${start.cornerShare * layoutWidth}px` },
      { transform: `translate(-50%, -50%) scale(${target.width / layoutWidth})`, borderRadius: getComputedStyle(slide).borderRadius },
    ], { duration, easing, fill: "both" })
    const flight = { slide, clone, animation }
    flights.push(flight)
    // `finished` rejects when the flight is cancelled; the cancel cleans up.
    animation.finished.then(() => land(flight), () => undefined)
  })
  if (!flights.length) onDone()
  return () => {
    flights.slice().forEach((flight) => {
      flight.animation.cancel()
      land(flight)
    })
  }
}
