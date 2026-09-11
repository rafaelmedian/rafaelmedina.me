import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react"
import { ChevronUp } from "lucide-react"

const SECTIONS = [
  { id: "work", number: "01", label: "Work", href: "#work" },
  { id: "about", number: "02", label: "About", href: "#about-panel" },
  { id: "services", number: "03", label: "Services", href: "#about-panel-services" },
] as const

type SectionId = (typeof SECTIONS)[number]["id"]

const readDuration = (element: Element, property: string, fallback: number) => {
  const value = getComputedStyle(element).getPropertyValue(property).trim()
  if (!value) return fallback
  const amount = parseFloat(value)
  if (Number.isNaN(amount)) return fallback
  return amount * (value.endsWith("ms") ? 1 : 1000)
}

export function MobileTableOfContents({
  onWork,
  onAbout,
  onServices,
}: {
  onWork: () => void
  onAbout: () => void
  onServices: () => void
}) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const triggerContentRef = useRef<HTMLSpanElement>(null)
  const [compactWidth, setCompactWidth] = useState<number>()
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>("work")
  // The label the pill is leaving behind, kept alive for one exit beat so the
  // scroll-driven change reads as a direction rather than a jump cut.
  const [leaving, setLeaving] = useState<{ id: SectionId; direction: "up" | "down" }>()

  const actions: Record<SectionId, () => void> = {
    work: onWork,
    about: onAbout,
    services: onServices,
  }

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
    const servicesSection = document.getElementById("about-panel-services")
    if (!about || !servicesSection) return

    // Follow the visible section, including manual scrolling and history
    // navigation. A section becomes current at the upper third of the screen.
    let observer: IntersectionObserver
    const observeSection = () => {
      observer?.disconnect()
      const height = window.innerHeight
      observer = new IntersectionObserver(() => {
        const detectionLine = height * 0.31
        const servicesBounds = servicesSection.getBoundingClientRect()
        const aboutBounds = about.getBoundingClientRect()
        // Tested last section first: services sits inside the About sheet and
        // closes it, so both are still on screen together at the bottom of the
        // page and the deepest match is the current one.
        setActiveSection(
          servicesBounds.top <= detectionLine && servicesBounds.bottom > 0 ? "services"
            : aboutBounds.top <= detectionLine && aboutBounds.bottom > 0 ? "about" : "work",
        )
      }, { rootMargin: `-${height * 0.3}px 0px -${height * 0.69}px 0px` })
      observer.observe(about)
      observer.observe(servicesSection)
    }
    observeSection()
    window.addEventListener("resize", observeSection)
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", observeSection)
    }
  }, [])

  // The label swaps in the direction the page is travelling: further down the
  // page sends the old label up and brings the new one in from below.
  const previousSection = useRef(activeSection)
  useLayoutEffect(() => {
    const from = previousSection.current
    previousSection.current = activeSection
    const root = rootRef.current
    if (from === activeSection || !root) return
    const order = (id: SectionId) => SECTIONS.findIndex((section) => section.id === id)
    setLeaving({ id: from, direction: order(activeSection) > order(from) ? "up" : "down" })
    const timer = window.setTimeout(
      () => setLeaving(undefined),
      readDuration(root, "--toc-swap-duration", 160),
    )
    return () => window.clearTimeout(timer)
  }, [activeSection])

  const navigate = (event: MouseEvent<HTMLAnchorElement>, action: () => void) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    setIsOpen(false)
    action()
  }

  const leavingSection = leaving && SECTIONS.find((section) => section.id === leaving.id)

  return (
    <div
      ref={rootRef}
      className="mosaic-mobile-toc"
      data-open={isOpen}
      data-visible={isVisible}
      data-swap={leaving?.direction}
      inert={!isVisible}
      aria-hidden={!isVisible}
      style={{
        ...(compactWidth ? { "--toc-compact-width": `${compactWidth}px` } : {}),
        // Sized from SECTIONS itself, so adding or removing a section can no
        // longer leave the open card reserving a row that nothing renders.
        "--toc-slot-count": SECTIONS.length,
      } as CSSProperties}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
      }}
    >
      <nav aria-label="Table of contents" className="mosaic-mobile-toc-surface">
        <ol id={panelId} className="mosaic-mobile-toc-list">
          {SECTIONS.map((section, index) => {
            const isCurrent = activeSection === section.id
            const content = (
              <span
                ref={isCurrent ? triggerContentRef : undefined}
                className="mosaic-mobile-toc-row-content"
              >
                <span className="mosaic-mobile-toc-label">
                  <span className="mosaic-mobile-toc-number" aria-hidden="true">{section.number}</span>{" "}
                  <span>{section.label}</span>
                </span>
                {isCurrent && (
                  <span className="mosaic-mobile-toc-icon" aria-hidden="true">
                    <ChevronUp className="mosaic-mobile-toc-chevron" size={16} strokeWidth={1.75} />
                  </span>
                )}
              </span>
            )
            return (
              <li
                key={section.id}
                className="mosaic-mobile-toc-slot"
                data-current={isCurrent}
                style={{ "--toc-slot": SECTIONS.length - 1 - index } as CSSProperties}
                inert={!isOpen && !isCurrent}
                aria-hidden={!isOpen && !isCurrent}
              >
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
                    onClick={(event) => navigate(event, actions[section.id])}
                  >
                    {content}
                  </a>
                )}
              </li>
            )
          })}
        </ol>
        {leavingSection && !isOpen && (
          <span className="mosaic-mobile-toc-ghost" aria-hidden="true">
            <span className="mosaic-mobile-toc-label">
              <span className="mosaic-mobile-toc-number">{leavingSection.number}</span>{" "}
              <span>{leavingSection.label}</span>
            </span>
          </span>
        )}
      </nav>
    </div>
  )
}
