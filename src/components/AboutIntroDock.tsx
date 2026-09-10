import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react"

import { getAboutIntro } from "../data/aboutIntro"
import { MobileTableOfContents } from "./MobileTableOfContents"

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
  const [media] = useState(getAboutIntro)
  const dockRef = useRef<HTMLDivElement>(null)
  const [approached, setApproached] = useState(false)
  const [active, setActive] = useState(false)
  const [obscured, setObscured] = useState(false)
  const [open, setOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const handleTocOpen = useCallback((next: boolean) => {
    setTocOpen(next)
    if (next) setOpen(false)
  }, [])

  useEffect(() => {
    const dock = dockRef.current
    if (!media || !dock) return
    const observer = new ResizeObserver(([entry]) => {
      dock.style.setProperty("--intro-dock-width", `${entry.contentRect.width}px`)
    })
    observer.observe(dock)
    return () => observer.disconnect()
  }, [media])

  useEffect(() => {
    if (!media) return
    const about = document.getElementById("about-panel")
    if (!about) return
    let frame = 0
    let wasActive = false
    const sync = () => {
      frame = 0
      const bounds = about.getBoundingClientRect()
      const nowActive = bounds.top <= window.innerHeight * 0.31 && bounds.bottom > 0
      // Geometry fallback also covers restored scroll positions and browsers
      // without IntersectionObserver; no media URL exists above this boundary.
      if (bounds.top <= window.innerHeight + 200 && bounds.bottom >= -200) setApproached(true)
      setActive(nowActive)
      if (wasActive && !nowActive) {
        setOpen(false)
      }
      wasActive = nowActive
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
    sync()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("pageshow", schedule)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("pageshow", schedule)
    }
  }, [media])

  useEffect(() => {
    if (!media || !approached) return
    // Dialogs live in several independently owned portals. Observe their
    // semantic state instead of coupling every gallery/booking/photo reader
    // to this optional player. Ignore persistent, closed Base UI popups.
    const sync = () => {
      const covered = [...document.querySelectorAll<HTMLElement>("[role='dialog'], dialog[open]")]
        .some(dialog => !dialog.hasAttribute("data-closed") &&
          dialog.getAttribute("aria-hidden") !== "true" && dialog.getClientRects().length > 0)
      setObscured(covered)
      if (covered) setOpen(false)
    }
    const observer = new MutationObserver(sync)
    observer.observe(document.body, {
      subtree: true, childList: true, attributes: true,
      attributeFilter: ["open", "data-open", "data-closed", "aria-hidden"],
    })
    sync()
    return () => observer.disconnect()
  }, [media, approached])

  const visible = active && !obscured
  return (
    <div ref={dockRef} className="about-intro-dock" data-about-active={active}
      data-intro-visible={Boolean(media && approached && visible)} data-toc-open={tocOpen}>
      <MobileTableOfContents {...props} onOpenChange={handleTocOpen} />
      {media && approached && (
        <IntroBoundary>
          <Suspense fallback={null}>
            <AboutIntro media={media} repliesAvailable={!tocOpen} visible={visible} open={open} onOpenChange={setOpen} />
          </Suspense>
        </IntroBoundary>
      )}
    </div>
  )
}
