import { useEffect, useState, type CSSProperties, type MouseEvent } from "react"

const SECTIONS = [
  { id: "work", label: "Work", href: "#work" },
  { id: "about", label: "About", href: "#about-panel" },
  { id: "services", label: "Services", href: "#about-panel-services" },
] as const

type SectionId = (typeof SECTIONS)[number]["id"]

export function MobileTableOfContents({ onWork, onAbout, onServices }: {
  onWork: () => void
  onAbout: () => void
  onServices: () => void
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>("work")
  const actions = { work: onWork, about: onAbout, services: onServices }

  useEffect(() => {
    const updateVisibility = () => setIsVisible(window.scrollY > 96)
    updateVisibility()
    window.addEventListener("scroll", updateVisibility, { passive: true })
    window.addEventListener("pageshow", updateVisibility)
    return () => {
      window.removeEventListener("scroll", updateVisibility)
      window.removeEventListener("pageshow", updateVisibility)
    }
  }, [])

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

  const navigate = (event: MouseEvent<HTMLAnchorElement>, action: () => void) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    action()
  }

  return (
    <div className="mosaic-mobile-toc" data-visible={isVisible} inert={!isVisible} aria-hidden={!isVisible}>
      <nav aria-label="Table of contents" className="mosaic-mobile-toc-surface">
        <ol className="mosaic-mobile-toc-list" style={{
          "--toc-active-index": SECTIONS.findIndex(section => section.id === activeSection),
        } as CSSProperties}>
          {SECTIONS.map(section => {
            return (
              <li key={section.id} className="mosaic-mobile-toc-slot">
                <a href={section.href} className="mosaic-mobile-toc-row"
                  aria-current={activeSection === section.id ? "location" : undefined}
                  onClick={event => navigate(event, actions[section.id])}>
                  <span className="mosaic-mobile-toc-row-content">
                    {section.label}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
