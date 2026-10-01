import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react"

import { getAboutIntro } from "../data/aboutIntro"
import { siteProfile } from "../data/portfolio"
import { MobileTableOfContents } from "./MobileTableOfContents"

import type { IntroOption } from "../data/aboutIntro"

const AboutIntro = lazy(() => import("./AboutIntro"))

// An optional introduction chunk must never take the rest of the page down
// when an old tab meets a new deployment or the visitor loses connectivity.
class IntroBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

export function AboutIntroDock(props: {
  onWork: () => void
  onAbout: () => void
  onServices: () => void
}) {
  const [media] = useState(() => getAboutIntro())
  const [option] = useState<IntroOption>(() => {
    const requested = import.meta.env.DEV && typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("introStyle") : null
    return requested === "a" || requested === "c" ? requested : "b"
  })
  const dockRef = useRef<HTMLDivElement>(null)
  const [approached, setApproached] = useState(false)
  const [active, setActive] = useState(false)
  const [obscured, setObscured] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)

  useEffect(() => {
    const dock = dockRef.current
    if (!dock) return
    const observer = new ResizeObserver(([entry]) => {
      dock.style.setProperty("--intro-dock-width", `${entry.contentRect.width}px`)
    })
    observer.observe(dock)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const about = document.getElementById("about-panel")
    if (!about) return
    const resume = document.querySelector(".mosaic-tile-resume")
    let resumeReached = false
    let frame = 0
    const sync = () => {
      frame = 0
      const bounds = about.getBoundingClientRect()
      const cv = resume?.getBoundingClientRect()
      // Keep initial visits media-free, even when a tall viewport includes CV.
      // Once half the tile is seen after scrolling, retain the intro through
      // the grid-to-About handoff. Scrolling back to the hero hides it again.
      const visibleHeight = cv ? Math.max(0, Math.min(cv.bottom, window.innerHeight) - Math.max(cv.top, 0)) : 0
      if (window.scrollY > 96 && cv && visibleHeight >= cv.height * 0.5) resumeReached = true
      const nowActive = bounds.bottom > 0 && (bounds.top <= window.innerHeight * 0.31 || (resumeReached && window.scrollY > 96))
      if (resumeReached) setApproached(true)
      // Geometry fallback also covers restored scroll positions and browsers
      // without IntersectionObserver; no media URL exists above this boundary.
      if (bounds.top <= window.innerHeight + 200 && bounds.bottom >= -200) setApproached(true)
      setActive(nowActive)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(sync) }
    const observer = "IntersectionObserver" in window
      ? new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setApproached(true)
          observer?.disconnect()
        }
      }, { rootMargin: "200px" }) : null
    observer?.observe(about)
    const resumeObserver = resume && "IntersectionObserver" in window
      ? new IntersectionObserver(schedule, { threshold: 0.5 }) : null
    if (resume) resumeObserver?.observe(resume)
    sync()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("pageshow", schedule)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      resumeObserver?.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("pageshow", schedule)
    }
  }, [])

  useEffect(() => {
    // Dialogs live in several independently owned portals. Observe their
    // semantic state instead of coupling every gallery/booking/photo reader
    // to this optional corner. Ignore persistent, closed Base UI popups.
    const sync = () => {
      const covered = [...document.querySelectorAll<HTMLElement>("[role='dialog'], dialog[open]")]
        .some(dialog => !dialog.closest(".about-intro") && !dialog.hasAttribute("data-closed") &&
          dialog.getAttribute("aria-hidden") !== "true" && dialog.getClientRects().length > 0)
      setObscured(covered)
    }
    const observer = new MutationObserver(sync)
    observer.observe(document.body, {
      subtree: true, childList: true, attributes: true,
      attributeFilter: ["open", "data-open", "data-closed", "aria-hidden"],
    })
    sync()
    return () => observer.disconnect()
  }, [])

  const visible = active && !obscured
  return (
    <div ref={dockRef} className="about-intro-dock" data-about-active={active}
      data-obscured={obscured} data-intro-visible={approached && visible} data-toc-open={tocOpen}>
      <MobileTableOfContents {...props} onOpenChange={setTocOpen} />
      {approached && (
        <IntroBoundary>
          <Suspense fallback={null}>
            <AboutIntro key={option} variant={option} media={media ?? undefined}
              portrait={siteProfile.photo} mobileMessages
              repliesAvailable={!tocOpen && !obscured} visible={visible} />
          </Suspense>
        </IntroBoundary>
      )}
    </div>
  )
}
