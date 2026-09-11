import { ArrowUpRight, Check, ChevronDown, Link2 } from "lucide-react"
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type MouseEvent,
  type RefObject,
} from "react"

import { writingSummaries } from "../data/writingIndex"
import type { Writing, WritingAnnotation, WritingCode, WritingImage, WritingSection } from "../data/writings"
import { cssTimeToMilliseconds } from "../lib/cssTime"
import { noteHash, pickFrom } from "../lib/writings"
import { siteOrigin, writingPath } from "../lib/projectMetadata"
import { LikeButton } from "./LikeButton"
import { InlineSwap } from "./InlineSwap"

function inlineProse(text: string) {
  return text.split(/`([^`]+)`/).map((part, index) => (index % 2 ? <code className="writing-code" key={index}>{part}</code> : part))
}

// The reader's pencil marks are pictures, not paths. A bezier written by hand
// draws one clean stroke of even weight, which is the one thing a pencil never
// does; these are rendered with Rough.js in scripts/build-writing-marks.mjs,
// which retraces every line with randomised bowing, and shipped as PNGs from
// public/writings/marks. They are black on transparent and used as masks, so
// they still take their colour from the text they sit beside.
const MARK_VARIANTS = ["a", "b", "c"]

// How far a note drops into its paragraph, which rail it sits on, and how far
// it leans. Notes that shared one offset drew a second column down each edge;
// spread over these they read as written into the gutter at different moments.
// The lift stays under three lines so a note cannot fall past the paragraph it
// belongs to and land against the next one's.
const NOTE_LIFTS = ["0em", "0.5em", "1.1em", "1.7em", "2.3em", "2.9em"]
const NOTE_GAPS = ["0.45rem", "0.6rem", "0.75rem", "0.9rem", "1.05rem"]
const NOTE_TILTS = ["-2.4deg", "-1.6deg", "-0.9deg", "0.9deg", "1.6deg", "2.4deg"]
// A bracket is drawn at the height of the note it holds, so the mask is never
// stretched by more than the line the estimate missed by. About twenty
// characters fit a 122px gutter line at --text-xs, which is the gutter from
// 1320px up; below that the gutter narrows and a long note runs a line past
// this, which is the miss the mask is sized to absorb.
const NOTE_CHARS_PER_LINE = 20

// A gutter note: a drawn bracket holding the passage, and the handwriting
// beside it. It is absolutely positioned next to its paragraph once the modal
// is wide enough to have gutters, so it lives inside the paragraph and reads
// after it rather than interrupting the sentence.
function MarginNote({ annotation }: { annotation: WritingAnnotation }) {
  const hash = noteHash(annotation.text)
  const lines = Math.min(4, Math.max(1, Math.ceil(annotation.text.length / NOTE_CHARS_PER_LINE)))
  const mark = `bracket-${lines}-${pickFrom(MARK_VARIANTS, hash, 0)}`
  return (
    <span className="writing-margin-note" data-place={annotation.place ?? "right"} style={{
      "--writing-mark": `url("/writings/marks/${mark}.png")`,
      "--writing-note-lift": pickFrom(NOTE_LIFTS, hash, 1),
      "--writing-note-gap": pickFrom(NOTE_GAPS, hash, 2),
      "--writing-note-tilt": pickFrom(NOTE_TILTS, hash, 3),
    } as CSSProperties}>
      <span className="writing-margin-note-bracket" aria-hidden="true" />
      <span className="writing-margin-note-label">{annotation.text}</span>
    </span>
  )
}

// The one code sample in the reader, and it is Markdown, which the article it
// sits in is about. That is narrow enough to tokenise here rather than pull in
// a highlighter: the grammar below is the part of Markdown a note actually
// uses, and everything it does not recognise falls through as plain text.
//
// Five token kinds, and the stylesheet gives each one a hue: a code block is
// the one place on this site that carries colour, because a reader arrives at
// one already knowing what coloured code means and reads the structure faster
// for it than they would from weight alone.
type CodeToken = { text: string; kind?: "mark" | "strong" | "literal" | "link" }

// Backticked spans, bold, and links. Each alternative keeps its delimiters in
// its own group so they can be dimmed away from the content they wrap.
const INLINE_MARKDOWN = /(`)([^`]+)(`)|(\*\*)([^*]+)(\*\*)|(\[)([^\]]+)(\]\()([^)]+)(\))/g

function inlineMarkdown(text: string): CodeToken[] {
  const tokens: CodeToken[] = []
  let last = 0
  for (const match of text.matchAll(INLINE_MARKDOWN)) {
    if (match.index > last) tokens.push({ text: text.slice(last, match.index) })
    const [, tick, code, tickEnd, stars, bold, starsEnd, open, label, middle, href, close] = match
    if (tick) tokens.push({ text: tick, kind: "mark" }, { text: code, kind: "literal" }, { text: tickEnd, kind: "mark" })
    else if (stars) tokens.push({ text: stars, kind: "mark" }, { text: bold, kind: "strong" }, { text: starsEnd, kind: "mark" })
    else tokens.push({ text: open, kind: "mark" }, { text: label, kind: "literal" },
      { text: middle, kind: "mark" }, { text: href, kind: "link" }, { text: close, kind: "mark" })
    last = match.index + match[0].length
  }
  if (last < text.length) tokens.push({ text: text.slice(last) })
  return tokens
}

// A heading is emphasis for its whole line; a bullet or a quote only marks its
// opening, and what follows is ordinary inline Markdown.
function markdownTokens(line: string): CodeToken[] {
  const heading = /^(#{1,6} )(.*)$/.exec(line)
  if (heading) return [{ text: heading[1], kind: "mark" }, { text: heading[2], kind: "strong" }]
  const led = /^(\s*(?:[-*+] |\d+\. |> ))(.*)$/.exec(line)
  if (led) return [{ text: led[1], kind: "mark" }, ...inlineMarkdown(led[2])]
  return inlineMarkdown(line)
}

// The newline rides inside each line's span rather than the span being a block:
// `white-space: pre` is what breaks the lines, so a blank entry still gets a
// line box, and selecting the sample copies it back out with its breaks.
function NoteCode({ code }: { code: WritingCode }) {
  return (
    <figure className="writing-code-figure">
      <pre className="writing-code-block"><code>
        {code.lines.map((line, index) => (
          <span className="writing-code-line" key={index}>
            {markdownTokens(line).map((token, position) => (
              <span data-code={token.kind} key={position}>{token.text}</span>
            ))}
            {"\n"}
          </span>
        ))}
      </code></pre>
      {code.caption ? <figcaption>{code.caption}</figcaption> : null}
    </figure>
  )
}

// Prose plus its marginalia. Paragraph order is unchanged: a note rides inside
// the paragraph it belongs to and hangs in the gutter beside it, so nothing
// ever comes between one paragraph and the next.
function NoteProse({ paragraphs, annotations }: { paragraphs: string[]; annotations?: WritingAnnotation[] }) {
  return paragraphs.map((paragraph, index) => (
    <p key={index}>
      {inlineProse(paragraph)}
      {annotations?.filter((annotation) => annotation.at === index).map((annotation) => (
        <MarginNote annotation={annotation} key={annotation.text} />
      ))}
    </p>
  ))
}

// Dates are stored as plain YYYY-MM-DD, so they are read at UTC midnight rather
// than in the reader's zone, where a western offset would roll them back a day.
const noteDate = (publishedAt: string) => new Date(`${publishedAt}T00:00:00Z`)
const fullDateFormat = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })
const dayMonthFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", timeZone: "UTC" })

function NoteImage({ image }: { image: WritingImage }) {
  return (
    <figure className="writing-reader-figure">
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  )
}

// A section's anchor, from its heading: lower case, punctuation dropped, words
// joined by hyphens, so /notes/<id>/#i-want-both-speeds reads as the heading.
const sectionSlug = (heading: string) => heading.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-")

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
function useCurrentSection(navRef: RefObject<HTMLElement | null>, sections: WritingSection[]) {
  const [current, setCurrent] = useState<string | null>(null)
  useEffect(() => {
    const article = navRef.current?.closest("article")
    if (!article) return
    const headings = sections
      .map((section) => article.querySelector<HTMLElement>(`#${CSS.escape(sectionSlug(section.heading))}`))
      .filter((heading) => heading !== null)
    const scroller = scrollParent(article)
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
const readDuration = (element: Element, property: string, fallback: number) => {
  const value = getComputedStyle(element).getPropertyValue(property).trim()
  if (!value) return fallback
  const amount = parseFloat(value)
  if (Number.isNaN(amount)) return fallback
  return amount * (value.endsWith("ms") ? 1 : 1000)
}

function NoteContents({ sections }: { sections: WritingSection[] }) {
  const panelId = useId()
  const sentinelRef = useRef<HTMLSpanElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isStuck, setIsStuck] = useState(false)
  const current = useCurrentSection(navRef, sections)
  const previous = useRef(current)
  const [leaving, setLeaving] = useState<{ slug: string | null; direction: "up" | "down" }>()
  const currentSection = sections.find((section) => sectionSlug(section.heading) === current)
  const currentLabel = currentSection?.heading ?? "Contents"

  useLayoutEffect(() => {
    const from = previous.current
    previous.current = current
    const root = navRef.current
    if (from === current || !root) return
    const order = (slug: string | null) => slug === null
      ? -1
      : sections.findIndex((section) => sectionSlug(section.heading) === slug)
    setLeaving({ slug: from, direction: order(current) > order(from) ? "up" : "down" })
    const timer = window.setTimeout(
      () => setLeaving(undefined),
      readDuration(root, "--toc-swap-duration", 160),
    )
    return () => window.clearTimeout(timer)
  }, [current, sections])

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
  }, [])

  const leavingLabel = leaving?.slug === null
    ? "Contents"
    : sections.find((section) => sectionSlug(section.heading) === leaving?.slug)?.heading

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
      <nav ref={navRef} className="writing-contents" aria-label="Contents" data-open={isOpen}
        data-stuck={isStuck} data-swap={leaving?.direction} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
        }}>
        <button ref={triggerRef} type="button" className="writing-contents-trigger" aria-expanded={isOpen}
          aria-controls={panelId} aria-label={`Contents: ${currentSection?.heading ?? "Introduction"}`}
          onClick={() => setIsOpen((open) => !open)}>
          <span key={current ?? "introduction"} className="writing-contents-current">{currentLabel}</span>
          {leavingLabel && !isOpen ? <span key={`leaving-${current}`} className="writing-contents-ghost" aria-hidden="true">{leavingLabel}</span> : null}
          <ChevronDown className="writing-contents-chevron" size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <div id={panelId} className="writing-contents-panel" inert={!isOpen} aria-hidden={!isOpen}>
          <ol>{sections.map((section) => {
            const slug = sectionSlug(section.heading)
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

/** How long a copied link stays confirmed, matching the address chip's window. */
const COPY_CONFIRMATION_MS = 1600

/**
 * The note's own address, offered rather than left in the URL bar. A note has a
 * page of its own -- `/notes/<id>/`, prerendered like a project's -- and the
 * reader is showing it, but a visitor reading inside a sheet has no reason to
 * look up there, and the one thing they might want to do with a note they
 * liked is send it to someone. The absolute URL is built rather than read off
 * `location` so a copy made from a preview server or a local build still pastes
 * as the public link.
 */
function CopyNoteLink({ writing }: { writing: Writing }) {
  const [copied, setCopied] = useState(false)
  const resetRef = useRef<number | undefined>(undefined)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const fromWidthRef = useRef(0)
  const resizeRef = useRef<Animation | null>(null)
  useEffect(() => () => window.clearTimeout(resetRef.current), [])
  const href = `${siteOrigin}${writingPath(writing)}`

  // Read the width the pill is showing -- mid-resize, if a press lands during
  // one -- before the label changes, so the next resize starts from there.
  function showCopied(next: boolean) {
    fromWidthRef.current = linkRef.current?.offsetWidth ?? 0
    setCopied(next)
  }

  // The pill hugs whichever label it wears, the way the like pill hugs its
  // count, and eases between the two widths rather than jumping.
  useLayoutEffect(() => {
    const link = linkRef.current
    const from = fromWidthRef.current
    if (!link || !from) return
    resizeRef.current?.cancel()
    const to = link.offsetWidth
    if (from === to || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const style = getComputedStyle(link)
    resizeRef.current = link.animate([{ width: `${from}px` }, { width: `${to}px` }], {
      duration: cssTimeToMilliseconds(style.getPropertyValue("--duration-quick")),
      easing: style.getPropertyValue("--ease-standard").trim() || "ease",
    })
  }, [copied])

  return (
    <>
      {/* An ordinary link underneath -- for the context menu, for a browser with
          no clipboard, for a middle-click -- and a plain press copies instead,
          the way the address in the About sheet does. */}
      <a ref={linkRef} className="writing-copy-link" href={href} data-copied={copied ? "true" : undefined}
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
          event.preventDefault()
          void navigator.clipboard?.writeText(href).then(() => {
            showCopied(true)
            // Restart the window on every copy so a second press gets its own
            // full confirmation instead of the tail of the first.
            window.clearTimeout(resetRef.current)
            resetRef.current = window.setTimeout(() => showCopied(false), COPY_CONFIRMATION_MS)
          }, () => undefined)
        }}>
        {copied
          ? <Check className="writing-copy-link-icon" size={14} aria-hidden="true" />
          : <Link2 className="writing-copy-link-icon" size={14} aria-hidden="true" />}
        <span aria-hidden="true">
          <InlineSwap value={copied ? "Link copied" : "Copy link"} direction={copied ? "up" : "down"} />
        </span>
        {/* The name says what the control does and stays saying it: the label
            beside the icon is the confirmation, and a name that changed with it
            would leave a screen reader hunting for the button it just used. */}
        <span className="sr-only">Copy a link to this note</span>
      </a>
      {/* Outside the link, so the confirmation is announced without joining the
          control's accessible name. */}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {copied ? "Link to this note copied to clipboard" : ""}
      </span>
    </>
  )
}

type WritingArticleProps = {
  writing: Writing
  /** The reader focuses the title when a note comes forward. */
  titleRef?: RefObject<HTMLHeadingElement | null>
  /** `h2` inside the reader, `h1` on the note's own page. */
  heading?: ElementType
  /** Whether the like pill should mount and read its count. */
  showLikes?: boolean
  /** Open another note. The static page has no reader to move, so it links. */
  onSelectWriting?: (id: string) => void
}

/**
 * One note, wherever it is being read: the reader's second page, and the
 * `/notes/<id>/` a crawler or a visitor without JavaScript gets instead. The
 * article is the part the two surfaces share, so it lives here and neither owns
 * the other's markup.
 */
export function WritingArticle({ writing, titleRef, heading: Heading = "h2", showLikes, onSelectWriting }: WritingArticleProps) {
  // Three neighbours, in the order the archive lists them, minus this one.
  const moreWritings = writingSummaries.filter((entry) => entry.id !== writing.id).slice(0, 3)

  return (
    <article className="writing-reader">
      <header className="writing-reader-header">
        <div className="writing-reader-date">
          {writing.publishedAt ? (
            <time dateTime={writing.publishedAt}>{fullDateFormat.format(noteDate(writing.publishedAt))}</time>
          ) : <span>{writing.archiveYear ? `Archive · ${writing.archiveYear}` : "Undated"}</span>}
        </div>
        <Heading ref={titleRef} tabIndex={-1} className="writings-page-title">{writing.title}</Heading>
        {/* Both are things to do with the note rather than part of it, and a
            note is worth sending on for the same reason it is worth liking. */}
        <div className="writing-reader-actions">
          {showLikes && import.meta.env.VITE_LIKES_API_URL ? <LikeButton key={writing.id} collection="notes" itemId={writing.id} /> : null}
          <CopyNoteLink writing={writing} />
        </div>
      </header>
      {/* One section is not an outline, so a note needs two to list them. */}
      {writing.sections && writing.sections.length > 1 ? <NoteContents sections={writing.sections} /> : null}
      <div className="writing-reader-body">
        {writing.cover ? <NoteImage image={writing.cover} /> : null}
        <div className="writing-reader-prose">
          <NoteProse paragraphs={writing.paragraphs} annotations={writing.annotations} />
          {writing.code ? <NoteCode code={writing.code} /> : null}
          {writing.image ? <NoteImage image={writing.image} /> : null}
          {writing.sections?.map((section) => (
            <section className="writing-reader-section" key={section.heading}>
              <h3 id={sectionSlug(section.heading)} tabIndex={-1}>{section.heading}</h3>
              <NoteProse paragraphs={section.paragraphs} annotations={section.annotations} />
              {section.code ? <NoteCode code={section.code} /> : null}
              {section.image ? <NoteImage image={section.image} /> : null}
            </section>
          ))}
          {writing.href ? <a href={writing.href} target="_blank" rel="noreferrer">Read original article <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
        </div>
      </div>
      {writing.acknowledgements ? (
        <section className="writing-acknowledgements" aria-label="Acknowledgements">
          <h3>Acknowledgements</h3>
          <p>{inlineProse(writing.acknowledgements)}</p>
        </section>
      ) : null}
      {moreWritings.length > 0 ? (
        <section className="writing-more" aria-label="More articles">
          <h3>More articles</h3>
          <ul>{moreWritings.map((entry) => (
            <li key={entry.id}>
              {/* The reader turns to its neighbour; the static page has no
                  reader to turn, so it goes to the note's own address. */}
              {onSelectWriting ? (
                <button type="button" className="writing-entry-trigger" onClick={() => onSelectWriting(entry.id)}>
                  <span className="writing-entry-title">{entry.title}</span>
                  {entry.publishedAt ? <time className="writing-entry-date" dateTime={entry.publishedAt} aria-hidden="true">
                    {dayMonthFormat.format(noteDate(entry.publishedAt))}
                  </time> : null}
                </button>
              ) : (
                <a className="writing-entry-trigger" href={writingPath(entry)}>
                  <span className="writing-entry-title">{entry.title}</span>
                  {entry.publishedAt ? <time className="writing-entry-date" dateTime={entry.publishedAt} aria-hidden="true">
                    {dayMonthFormat.format(noteDate(entry.publishedAt))}
                  </time> : null}
                </a>
              )}
            </li>
          ))}</ul>
        </section>
      ) : null}
    </article>
  )
}
