import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { ChevronUp, X } from "lucide-react"

export function MobileTableOfContents({
  onWork,
  onAbout,
  onWorkHistory,
}: {
  onWork: () => void
  onAbout: () => void
  onWorkHistory: () => void
}) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const triggerContentRef = useRef<HTMLSpanElement>(null)
  const [compactWidth, setCompactWidth] = useState<number>()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState("work")

  useEffect(() => {
    const updateVisibility = () => {
      const visible = window.scrollY > 96
      setIsVisible(visible)
      if (!visible) setIsOpen(false)
    }
    updateVisibility()
    window.addEventListener("scroll", updateVisibility, { passive: true })
    window.addEventListener("pageshow", updateVisibility)
    return () => {
      window.removeEventListener("scroll", updateVisibility)
      window.removeEventListener("pageshow", updateVisibility)
    }
  }, [])

  useEffect(() => {
    const content = triggerContentRef.current
    const trigger = triggerRef.current
    if (!content || !trigger) return
    const measure = () => {
      const style = getComputedStyle(trigger)
      const items = Array.from(content.children) as HTMLElement[]
      const contentWidth = items.reduce((width, item) => width + item.offsetWidth, 0)
        + parseFloat(getComputedStyle(content).columnGap) * (items.length - 1)
      setCompactWidth(contentWidth + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(content)
    measure()
    return () => observer.disconnect()
  }, [activeSection])

  useEffect(() => {
    if (!isOpen) return
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }
    const dismissWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.preventDefault()
      setIsOpen(false)
      triggerRef.current?.focus({ preventScroll: true })
    }
    document.addEventListener("pointerdown", dismissOutside)
    document.addEventListener("keydown", dismissWithEscape)
    return () => {
      document.removeEventListener("pointerdown", dismissOutside)
      document.removeEventListener("keydown", dismissWithEscape)
    }
  }, [isOpen])

  useEffect(() => {
    const about = document.getElementById("about-panel")
    const history = document.getElementById("about-panel-resume")
    if (!about || !history) return

    // Follow the visible section, including manual scrolling and history
    // navigation. A section becomes current at the upper third of the screen.
    let observer: IntersectionObserver
    const observeSection = () => {
      observer?.disconnect()
      const height = window.innerHeight
      observer = new IntersectionObserver(() => {
        const detectionLine = height * 0.31
        const historyBounds = history.getBoundingClientRect()
        const aboutBounds = about.getBoundingClientRect()
        setActiveSection(
          historyBounds.top <= detectionLine && historyBounds.bottom > 0 ? "history"
            : aboutBounds.top <= detectionLine && aboutBounds.bottom > 0 ? "about" : "work",
        )
      }, { rootMargin: `-${height * 0.3}px 0px -${height * 0.69}px 0px` })
      observer.observe(about)
      observer.observe(history)
    }
    observeSection()
    window.addEventListener("resize", observeSection)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", observeSection)
    }
  }, [])

  const navigate = (event: MouseEvent<HTMLAnchorElement>, action: () => void) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    setIsOpen(false)
    action()
  }

  const sections = [
    { id: "work", number: "01", label: "Work", href: "#work", action: onWork },
    { id: "about", number: "02", label: "About", href: "#about-panel", action: onAbout },
    { id: "history", number: "03", label: "Work history", href: "#about-panel-resume", action: onWorkHistory },
  ]
  // A scroll-driven label swap must not briefly collapse both rows. Width still
  // eases to the new label; row expansion remains animated when toggling open.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    root.dataset.swapping = "true"
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => { delete root.dataset.swapping })
    })
    return () => {
      cancelAnimationFrame(frame)
      delete root.dataset.swapping
    }
  }, [activeSection])

  return (
    <div
      ref={rootRef}
      className="mosaic-mobile-toc"
      data-open={isOpen}
      data-visible={isVisible}
      inert={!isVisible}
      aria-hidden={!isVisible}
      style={compactWidth ? { "--toc-compact-width": `${compactWidth}px` } as CSSProperties : undefined}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
    >
      <nav aria-label="Table of contents" className="mosaic-mobile-toc-surface">
        <ol id={panelId} className="mosaic-mobile-toc-list">
          {sections.map((section) => {
            const isCurrent = activeSection === section.id
            const content = (
              <span
                ref={isCurrent ? triggerContentRef : undefined}
                className="mosaic-mobile-toc-row-content"
              >
                <span className="mosaic-mobile-toc-number" aria-hidden="true">{section.number}</span>{" "}
                <span>{section.label}</span>
                {isCurrent && (
                  <span className="mosaic-mobile-toc-icon" aria-hidden="true">
                    <ChevronUp className="mosaic-mobile-toc-chevron" size={16} strokeWidth={1.75} />
                    <X className="mosaic-mobile-toc-close" size={16} strokeWidth={1.75} />
                  </span>
                )}
              </span>
            )
            return (
              <li
                key={section.id}
                className="mosaic-mobile-toc-slot"
                data-current={isCurrent}
                inert={!isOpen && !isCurrent}
                aria-hidden={!isOpen && !isCurrent}
              >
                <div className="mosaic-mobile-toc-clip">
                  {isCurrent ? (
                    <button
                      ref={triggerRef}
                      type="button"
                      className="mosaic-mobile-toc-row mosaic-mobile-toc-trigger"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      aria-current="location"
                      aria-label={`Table of contents: ${section.label}`}
                      onClick={() => setIsOpen((open) => !open)}
                    >
                      {content}
                    </button>
                  ) : (
                    <a
                      href={section.href}
                      className="mosaic-mobile-toc-row"
                      onClick={(event) => navigate(event, section.action)}
                    >
                      {content}
                    </a>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
