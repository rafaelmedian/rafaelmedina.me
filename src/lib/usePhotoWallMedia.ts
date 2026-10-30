import { useEffect, useState } from "react"

/** Load a shared photo once any of its repeated prints approaches the stage.
 * Overscan gives panning a head start without decoding the whole collection.
 * Keep loaded IDs for this sheet's lifetime so returning never blanks a print. */
export function usePhotoWallMedia(stage: HTMLElement | null, open: boolean) {
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set())
  useEffect(() => {
    if (!stage || !open) return
    const slides = [...stage.querySelectorAll<HTMLElement>(".personal-photos-slide")]
    const reveal = (items: HTMLElement[]) => setLoaded(previous => {
      const additions = items.map(item => item.dataset.photoSource!).filter(id => !previous.has(id))
      return additions.length ? new Set([...previous, ...additions]) : previous
    })
    if (!("IntersectionObserver" in window)) { reveal(slides); return }
    const observer = new IntersectionObserver(entries => {
      const nearby = entries.filter(entry => entry.isIntersecting).map(entry => entry.target as HTMLElement)
      if (!nearby.length) return
      reveal(nearby)
      nearby.forEach(slide => observer.unobserve(slide))
    }, { root: stage, rootMargin: "200px" })
    slides.forEach(slide => observer.observe(slide))
    return () => observer.disconnect()
  }, [stage, open])
  return loaded
}
