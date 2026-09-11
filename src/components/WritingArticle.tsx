import { ArrowUpRight, Check, Copy, Link2 } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type RefObject } from "react"

import { writingSummaries } from "../data/writingIndex"
import type { Writing, WritingAnnotation, WritingCode, WritingImage, WritingTool } from "../data/writings"
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

function NoteImage({ image }: { image: WritingImage }) {
  return (
    <figure className="writing-reader-figure">
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
      {image.caption ? <figcaption>{image.caption}</figcaption> : null}
    </figure>
  )
}

function ToolInstallCard({ tool }: { tool: WritingTool }) {
  const [copied, setCopied] = useState(false)
  const resetRef = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(resetRef.current), [])
  const command = `npx skills add ${tool.package}`

  return (
    <section className="writing-tool" aria-label={`Install ${tool.package.split("@").at(-1)}`}>
      <div className="writing-tool-heading">
        <div>
          <h3>Install the skill</h3>
          <p>Use it in any agent that supports the open skills format.</p>
        </div>
        <a href={tool.sourceUrl} target="_blank" rel="noreferrer">
          View source <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <div className="writing-tool-command">
        <code>{command}</code>
        <button type="button" onClick={() => {
          void navigator.clipboard?.writeText(command).then(() => {
            setCopied(true)
            window.clearTimeout(resetRef.current)
            resetRef.current = window.setTimeout(() => setCopied(false), COPY_CONFIRMATION_MS)
          }, () => undefined)
        }}>
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          <span aria-hidden="true"><InlineSwap value={copied ? "Copied" : "Copy"} direction={copied ? "up" : "down"} /></span>
          <span className="sr-only">Copy install command</span>
        </button>
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {copied ? "Install command copied" : ""}
      </span>
    </section>
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
  // Three neighbours from the same shelf, in archive order, minus this one.
  const moreWritings = writingSummaries.filter((entry) => entry.category === writing.category && entry.id !== writing.id).slice(0, 3)
  const moreLabel = `More ${writing.category.toLowerCase()}`

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
      {writing.cover ? <NoteImage image={writing.cover} /> : null}
      <div className="writing-reader-prose">
        <NoteProse paragraphs={writing.paragraphs} annotations={writing.annotations} />
        {writing.tool ? <ToolInstallCard tool={writing.tool} /> : null}
        {writing.code ? <NoteCode code={writing.code} /> : null}
        {writing.image ? <NoteImage image={writing.image} /> : null}
        {writing.sections?.map((section) => (
          <section className="writing-reader-section" key={section.heading}>
            <h3>{section.heading}</h3>
            <NoteProse paragraphs={section.paragraphs} annotations={section.annotations} />
            {section.code ? <NoteCode code={section.code} /> : null}
            {section.image ? <NoteImage image={section.image} /> : null}
          </section>
        ))}
        {writing.href ? <a href={writing.href} target="_blank" rel="noreferrer">Read original article <ArrowUpRight size={16} aria-hidden="true" /></a> : null}
      </div>
      {writing.acknowledgements ? (
        <section className="writing-acknowledgements" aria-label="Acknowledgements">
          <h3>Acknowledgements</h3>
          <p>{inlineProse(writing.acknowledgements)}</p>
        </section>
      ) : null}
      {moreWritings.length > 0 ? (
        <section className="writing-more" aria-label={moreLabel}>
          <h3>{moreLabel}</h3>
          <ul>{moreWritings.map((entry) => (
            <li key={entry.id}>
              {/* The reader turns to its neighbour; the static page has no
                  reader to turn, so it goes to the note's own address. */}
              {onSelectWriting ? (
                <button type="button" className="writing-entry-trigger" onClick={() => onSelectWriting(entry.id)}>
                  <span className="writing-entry-title">{entry.title}</span>
                </button>
              ) : (
                <a className="writing-entry-trigger" href={writingPath(entry)}>
                  <span className="writing-entry-title">{entry.title}</span>
                </a>
              )}
            </li>
          ))}</ul>
        </section>
      ) : null}
    </article>
  )
}
