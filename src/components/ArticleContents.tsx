import { ChevronDown } from "lucide-react"
import { useEffect, useId, useRef, useState, type MouseEvent, type RefObject } from "react"

export type ContentsSection = { id: string; heading: string }

// The nearest ancestor that scrolls: the gallery card's viewport in the
// reader, nothing on the standalone page, where the window does.
function scrollParent(element: HTMLElement) {
  for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(node).overflowY)) return node
  }
  return null
}

/**
 * The section being read, for the contents to mark. A section becomes current
 * at the moment its heading crosses the pinned contents row. Crossing back
 * above the first heading returns the label to Contents. The last section
 * still takes over at the very end, where a short close may not have enough
 * copy below it to reach the row on its own.
 */
function useCurrentSection(navRef: RefObject<HTMLElement | null>, sections: ContentsSection[]) {
  const [current, setCurrent] = useState<string | null>(null)
  useEffect(() => {
    const nav = navRef.current
    const article = nav?.closest("article")
    if (!nav || !article) return
    const headings = sections
      .map((section) => article.querySelector<HTMLElement>(`#${CSS.escape(section.id)}`))
      .filter((heading) => heading !== null)
    // The project article is itself the scroller; notes nest their article
    // inside it. Start at the nav so both layouts find the reading viewport.
    const scroller = scrollParent(nav)
    let frame = 0
    const update = () => {
      frame = 0
      const boundary = navRef.current?.getBoundingClientRect().bottom
        ?? (scroller ? scroller.getBoundingClientRect().top : 0)
      const atEnd = scroller
        ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1
        : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1
      let active: string | null = null
      for (const heading of headings) if (heading.getBoundingClientRect().top <= boundary) active = heading.id
      if (atEnd && active) active = headings[headings.length - 1].id
      setCurrent(active)
    }
    // Once a frame however fast the wheel is: the check is a few rects.
    const schedule = () => { frame ||= requestAnimationFrame(update) }
    const target = scroller ?? window
    update()
    target.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      target.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [navRef, sections])
  return current
}

/**
 * The sections, so a reader can see how the note is laid out and go straight
 * to the part they came for. They sit above the prose where there is no room
 * beside it, and float in the reader's left gutter where there is. Each row is
 * a real fragment link, which is all the static page needs. In the reader a
 * press scrolls the card itself instead: a fragment navigation would push a
 * history entry of its own, and the gallery closes a note by stepping back
 * through history, so Back would land on the fragment rather than leave it.
 */
export function ArticleContents({ sections, revealAfter, label = "Contents" }: { sections: ContentsSection[]; revealAfter?: string; label?: string }) {
  const panelId = useId()
  const sentinelRef = useRef<HTMLSpanElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isStuck, setIsStuck] = useState(false)
  const [isRevealed, setIsRevealed] = useState(!revealAfter)
  const current = useCurrentSection(navRef, sections)
  const currentSection = sections.find((section) => section.id === current)
  const currentLabel = currentSection?.heading ?? "Contents"

  useEffect(() => {
    if (!isOpen) return
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setIsOpen(false)
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
    const nav = navRef.current
    const sentinel = sentinelRef.current
    if (!nav || !sentinel) return
    const scroller = scrollParent(nav)
    const target = scroller ?? window
    let frame = 0
    const update = () => {
      frame = 0
      const top = scroller ? scroller.getBoundingClientRect().top : 0
      setIsStuck(sentinel.getBoundingClientRect().top < top)
      const firstSection = revealAfter ? nav.closest("article")?.querySelector<HTMLElement>(`#${CSS.escape(revealAfter)}`) : null
      const revealed = !revealAfter || !!firstSection && firstSection.getBoundingClientRect().bottom <= top + nav.offsetHeight
      setIsRevealed(revealed)
      if (!revealed) setIsOpen(false)
    }
    const schedule = () => { frame ||= requestAnimationFrame(update) }
    update()
    target.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      cancelAnimationFrame(frame)
      target.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [revealAfter])

  const navigate = (event: MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    const target = event.currentTarget.closest("article")?.querySelector<HTMLElement>(`#${CSS.escape(slug)}`)
    if (!target) return
    event.preventDefault()
    setIsOpen(false)
    // Focus follows the jump, as it does for a native fragment, so Tab carries
    // on from the section rather than from the disclosed list.
    target.focus({ preventScroll: true })
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    // Let the disclosure close before measuring the destination. This keeps
    // the anchored heading from inheriting the panel's open-state geometry.
    requestAnimationFrame(() => {
      const scroller = scrollParent(target)
      if (scroller) {
        const inset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0
        const top = scroller.scrollTop + target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - inset
        scroller.scrollTo({ top, behavior: reduce ? "instant" : "smooth" })
      } else {
        target.scrollIntoView({ block: "start", behavior: reduce ? "instant" : "smooth" })
      }
    })
  }

  return (
    <>
      <span ref={sentinelRef} className="writing-contents-sentinel" aria-hidden="true" />
      <nav ref={navRef} className="writing-contents" aria-label={label} data-open={isOpen}
        data-revealed={isRevealed} inert={!isRevealed} aria-hidden={!isRevealed}
        data-stuck={isStuck} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
        }}>
        <button ref={triggerRef} type="button" className="writing-contents-trigger" aria-expanded={isOpen}
          aria-controls={panelId} aria-label={`Contents: ${currentSection?.heading ?? "Introduction"}`}
          onClick={() => setIsOpen((open) => !open)}>
          <span className="writing-contents-current">{currentLabel}</span>
          <ChevronDown className="writing-contents-chevron" size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <div id={panelId} className="writing-contents-panel" inert={!isOpen} aria-hidden={!isOpen}>
          <ol>{sections.map((section) => {
            const slug = section.id
            return (
              <li key={slug}>
                <a href={`#${slug}`} aria-current={slug === current ? "location" : undefined}
                  onClick={(event) => navigate(event, slug)}>{section.heading}</a>
              </li>
            )
          })}</ol>
        </div>
      </nav>
    </>
  )
}
