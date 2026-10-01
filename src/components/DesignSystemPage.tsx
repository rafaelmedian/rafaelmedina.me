import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { Check, Copy, Search } from "lucide-react"
import { X } from "./NavigationIcons"

import { linkedinHoverMedia, xProfilePreview, type SiteLinks } from "../data/portfolio"
import { SiteLastUpdated } from "./SiteLastUpdated"
import { ContactActionRow } from "./ContactActionRow"
import { WorkedWithCompaniesInline } from "./WorkedWithCompaniesInline"
import { PersonalPhotos } from "./PersonalPhotos"
import { WritingsFolder } from "./WritingsFolder"
import { QuoteCard } from "./QuoteCard"
import { ResumeTile } from "./ResumeTile"
import { portfolioQuotes } from "../data/quotes"
import { sampleQuotes } from "../data/quoteExamples"
import { formatAvailability } from "../lib/availability"

import { useDesignTokens } from "./useDesignTokens"

import "./design-system.css"

/*
 * The reference for what this site already is.
 *
 * Shared token values are read from computed root styles, so they follow the
 * CSS. Specimens import the real components. Descriptions are editorial:
 * keep them to the rule a reader needs while writing CSS, and update them
 * when behaviour changes. Component-level detail belongs in the component's
 * own stylesheet comments, not here. Anything carrying a value gets
 * `data-ds-terms` so the filter can find it.
 */

type DesignSystemPageProps = {
  links: SiteLinks
  name: string
}

const SECTIONS = [
  { id: "principles", label: "Principles" },
  { id: "colour", label: "Colour" },
  { id: "typography", label: "Typography" },
  { id: "space", label: "Space & radius" },
  { id: "elevation", label: "Elevation" },
  { id: "components", label: "Components" },
  { id: "motion", label: "Motion" },
  { id: "layout", label: "Layout" },
  { id: "accessibility", label: "Accessibility" },
]

/* The filter matches against this string rather than rendered text, so a card
   can be found by a token it mentions but does not display. */
function terms(...parts: Array<string | number | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase()
}

/* ------------------------------------------------------------------ colour */
/* WCAG 2.x relative luminance. Computed rather than transcribed so a swatch
   edit can never leave a stale ratio next to it. */
function luminance(hex: string) {
  const channels = [1, 3, 5]
    .map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((channel) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4))
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(foreground: string, background: string) {
  const a = luminance(foreground)
  const b = luminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

type ContrastKind = "text" | "non-text"

function ratioGrade(ratio: number, kind: ContrastKind) {
  if (kind === "non-text") return ratio >= 3 ? "pass" : "fail"
  if (ratio >= 4.5) return "pass"
  if (ratio >= 3) return "large"
  return "fail"
}

function ContrastBadge({
  color,
  kind = "text",
  label,
  on,
}: {
  color: string
  kind?: ContrastKind
  label?: string
  on: string
}) {
  if (!color || !on) return <span className="ds-ratio">Loading…</span>
  const ratio = contrast(color, on)
  const grade = ratioGrade(ratio, kind)
  const verdict =
    kind === "non-text" && grade === "pass"
      ? "AA non-text"
      : grade === "pass"
        ? "AA"
        : grade === "large"
          ? "AA large only"
          : "decorative only"
  return (
    <span className="ds-ratio" data-pass={grade}>
      {label ? `${label} ` : ""}
      {ratio.toFixed(2)}:1 · {verdict}
    </span>
  )
}

/* ---------------------------------------------------------------- copying */

/* Every documented value is a value somebody is about to paste into a
   stylesheet, so the spec line is the copy control rather than carrying one. */
function CopyValue({ value, title }: { value: string; title?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(() => {
    void navigator.clipboard?.writeText(value).then(() => {
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1400)
    })
  }, [value])

  return (
    <button
      type="button"
      className="ds-copy"
      data-copied={copied || undefined}
      onClick={copy}
      title={title ?? `Copy ${value}`}
      aria-label={`Copy ${value}`}
    >
      <code>{value}</code>
      <span className="ds-copy-icon" aria-hidden="true">
        {copied ? <Check /> : <Copy />}
      </span>
    </button>
  )
}

/* ------------------------------------------------------------------- cards */

/* One card shell for swatches, tokens, radii, shadows, and curves. Before this
   each of those drew its own box and the page had five card designs on it,
   which made the sections impossible to tell apart while scrolling. The proof
   changes; the body under it does not. */
function SpecCard({
  badge,
  className,
  copy,
  name,
  note,
  proof,
  spec,
  style,
  terms: search,
}: {
  badge?: ReactNode
  className?: string
  copy?: string
  name: ReactNode
  note?: ReactNode
  proof?: ReactNode
  spec?: ReactNode
  style?: CSSProperties
  terms: string
}) {
  return (
    <article className={className ? `ds-card ${className}` : "ds-card"} data-ds-terms={search} style={style}>
      {proof}
      <div className="ds-card-body">
        <strong className="ds-card-name">{name}</strong>
        {copy ? <CopyValue value={copy} /> : null}
        {spec ? <code className="ds-card-spec">{spec}</code> : null}
        {note ? <p className="ds-card-note">{note}</p> : null}
        {badge}
      </div>
    </article>
  )
}

const SURFACES_ENTRIES = [
  {
    token: "--canvas",
    name: "Page & raised",
    note: "The page, the About sheet, and everything floating above them. Every ratio on this page is measured against it.",
  },
  {
    token: "--body-bg",
    name: "Beneath",
    note: "Paints <html> and <body>; visible only in overscroll. Measure contrast against --canvas.",
  },
  {
    token: "--mosaic-card-surface",
    name: "Tile",
    note: "Work tiles. The one surface meaningfully darker than the page.",
  },
  {
    hex: "#f2f2f2",
    token: "—",
    name: "Chip rest",
    note: "The person chip's hover and the popover's inline link.",
  },
  {
    hex: "#e9e9e9",
    token: "—",
    name: "Chip active",
    note: "Hover, focus, and pressed for anything that rests on a chip. Open and hovered mean the same thing.",
  },
]

const INK_ENTRIES = [
  { token: "--ink", use: "Primary text and headings. --body-color aliases it." },
  { token: "--focus-ring", use: "Every focus ring, primary UI labels, and hover states" },
  { hex: "#363636", token: "—", use: "Inline links on hover" },
  { hex: "#4a4a4a", token: "—", use: "Inline links at rest" },
  { hex: "#545454", token: "—", use: "Project-preview description" },
  { token: "--muted", use: "Secondary copy: subtitles, captions, chip labels, the avatar hint, margin notes" },
  { token: "--muted-soft", use: "Tertiary labels: corner nav, definition terms, hobby notes" },
]

const NON_TEXT_ENTRIES = [
  { hex: "#b5b5b5", kind: "non-text", name: "Separator", note: "The middot between a company and its role." },
  { hex: "#c8c8c8", kind: "non-text", name: "Underline", note: "Resting link underlines; #9b9b9b on hover." },
  {
    token: "--accent",
    kind: "non-text",
    name: "Copied",
    note: "The line under the About sheet's address while a copy holds. A graphic only — the confirmation itself is spoken. Graded on white, the colour of the prose it underlines. The corner chip answers a copy by morphing its own grey mark instead, so this is the token's one wearer.",
  },
  {
    token: "--focus-ring-soft",
    kind: "non-text",
    name: "Tile focus",
    note: "The focus ring on work tiles only. Around 500px of artwork the darker ring reads as a frame.",
  },
] satisfies ReadonlyArray<{ hex?: string; token?: string; kind: ContrastKind; name: string; note: string }>

const BRAND = [
  { hex: "#0a66c2", name: "LinkedIn", note: "Pill label." },
  { hex: "#0f1419", name: "X ink", note: "Follow button, the X card's name and bio." },
  { hex: "#1d9bf0", name: "X mention", note: "@mentions inside the X card." },
  { hex: "#536471", name: "X muted", note: "Handle and stat labels inside the X card." },
  { hex: "#40c463", name: "GitHub graph", note: "The last-updated card's contribution grid, on GitHub's own five-step ramp." },
]

/* -------------------------------------------------------------- typography */

const TYPE_SCALE_ENTRIES = [
  {
    token: "--text-xs",
    sample: "Punta Cana · Local time",
    where: "Count pills, captions, dates, map attribution, margin notes",
    style: { fontSize: "var(--text-xs)", lineHeight: 1.25 },
  },
  {
    token: "--text-sm",
    sample: "I'm a designer who ships products.",
    where: "The reading step: the hero, nav, body copy, hover cards, About, notes, and case studies. Weight separates headings from prose.",
    style: { fontSize: "var(--text-sm)", lineHeight: "1.25rem", letterSpacing: "-0.00563rem" },
  },
  {
    token: "--text-md",
    sample: "Senior Product Designer",
    where: "Card and section titles, longer quotes, toolbar titles, the avatar hint",
    style: { fontSize: "var(--text-md)", lineHeight: 1.5, letterSpacing: "-0.005rem", fontWeight: 600 },
  },
  {
    token: "--text-lg",
    sample: "Ten years prototyping in code.",
    where: "Short quotes, a note's title, standalone-page headings",
    style: { fontSize: "var(--text-lg)", lineHeight: 1.5, letterSpacing: "-0.015rem", fontWeight: 600 },
  },
]

const WEIGHTS = [
  { value: 400, use: "Body copy, nav links, definition values, résumé titles and companies" },
  { value: 500, use: "Pill labels, preview titles, popover roles" },
  { value: 600, use: "Headings and card titles" },
  { value: 700, use: "The X card name and stats only — vendor weight" },
]

/* ------------------------------------------------------------------- space */

const RADII_ENTRIES = [
  { value: "--radius-sm", use: "Chips, nav hover targets, focus rings", css: "--radius-sm" },
  { value: "--radius-md", use: "Hover cards, popovers, compact work tiles, composers", css: "--radius-md" },
  { value: "--radius-lg", use: "Work tiles, quote cards, dialog corners", css: "--radius-lg" },
  { value: "--radius-full", use: "Pills, dots, avatars, nav buttons", css: "--radius-full" },
]

const SPACE = [
  { value: "0.25rem", use: "Icon to label, chip rows" },
  { value: "0.5rem", use: "Compact mosaic gap, list internals" },
  { value: "0.75rem", use: "Floating offsets, the TOC above the safe area" },
  { value: "1rem", use: "Desktop mosaic gap — the layout unit" },
  { value: "1.5rem", use: "Standalone-page side padding" },
  { value: "2.5rem", use: "Section breaks in About on mobile" },
  { value: "5rem", use: "Section breaks in About on desktop, standalone-page vertical padding" },
  { value: "8px", use: "Mobile page gutter below 700px" },
  { value: "clamp(16px, 3vw, 32px)", use: "Grid inset from 900px up" },
]

/* --------------------------------------------------------------- elevation */

const ELEVATION = [
  {
    name: "Hairline",
    shadow: "inset 0 0 0 1px rgb(0 0 0 / 0.05)",
    use: "An edge, not a lift: logo chips, media frames, portraits. Images take it as a -1px outline, since an inset shadow paints under replaced content.",
  },
  {
    name: "Control — --shadow-control",
    shadow: "var(--shadow-control)",
    use: "Light pills and compact controls, with -hover and -pressed steps.",
  },
  {
    name: "Overlay — --shadow-overlay",
    shadow: "var(--shadow-overlay)",
    use: "Everything that floats: hover cards, popovers, the TOC, the takeover close. Border-less surfaces prepend --shadow-ring; pointer chrome deepens to --shadow-overlay-hover in place.",
  },
  {
    name: "Dialog",
    shadow: "0 1px 1px rgb(0 0 0 / 0.04), 0 18px 44px -18px rgb(0 0 0 / 0.28), 0 48px 92px -42px rgb(0 0 0 / 0.38)",
    use: "The preview gallery card only. Controls floating beside it use the overlay tier.",
  },
]

/* ------------------------------------------------------------------ motion */

const EASINGS_ENTRIES = [
  {
    name: "Standard — --ease-standard",
    css: "--ease-standard",
    duration: "160–1200ms",
    use: "The house curve and the default. Anything changing state in place: colour, shadow, underline, icons.",
  },
  {
    name: "Smooth — --ease-smooth",
    css: "--ease-smooth",
    duration: "160–700ms",
    use: "Fast out, long settle. Entrances, overlays arriving, content resolving.",
  },
  {
    name: "Exit — --ease-exit",
    css: "--ease-exit",
    duration: "120–160ms",
    use: "Anything leaving: hover cards, popovers (as --mosaic-popover-exit-ease), the gallery. Always shorter than its entrance.",
  },
  {
    name: "Origin open",
    css: "cubic-bezier(0.32, 0.8, 0.32, 1)",
    duration: "200ms",
    use: "The preview gallery and notes opening from their tile (--pg-open-ease).",
  },
  {
    name: "Photo carousel — --photo-motion-ease",
    css: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    duration: "200–360ms",
    use: "Core Animation's default curve, scoped to the personal-photo flights.",
  },
  {
    name: "Card stack — --photo-deal-ease",
    css: "cubic-bezier(0.31, 1.84, 0.64, 1)",
    duration: "410ms",
    use: "The photo fan dealing out once. The one overshoot on the site, and only on an entrance.",
  },
  {
    name: "Aurora",
    css: "ease-in-out",
    duration: "1260ms",
    use: "The page-end glow releasing.",
  },
  {
    name: "Scroll linked",
    css: "linear",
    duration: "1 viewport of scroll",
    use: "The About takeover, driven by one view timeline.",
  },
]

const DURATIONS_ENTRIES = [
  { value: "--duration-fast", use: "Taps, small fades, label swaps out." },
  { value: "--duration-quick", use: "Hover and focus changes, and overlay exits. The default." },
  { value: "--duration-base", use: "Surface moves and overlay entrances: the gallery, hover cards, popovers, paging." },
  { value: "--duration-slow", use: "Big reveals: the avatar and page entrance, media resolving, the photo sheet opening." },
  { value: "60ms", use: "--card-caption-delay, and --entrance-stagger, the entrance step (four at most)." },
  { value: "240–1260ms", use: "Scoped choreography — the live-time roll, the About copy rise, the photo deal, the page-end glow. Stays with its component." },
]

/* ------------------------------------------------------------------ layout */

const BREAKPOINTS = [
  { at: "≤ 327.98px", change: "Contact pills tighten to 0.625rem side padding; location and address stack." },
  { at: "≤ 479.98px", change: "Contact pills wrap when the row runs out." },
  { at: "≤ 639.98px", change: "The hero takes 2rem of top padding plus the safe area." },
  {
    at: "≤ 699.98px",
    change: "Corner nav and local time hide; 8px gutters around a two-column mosaic; the About sheet returns to normal flow; tile captions hide.",
  },
  { at: "≥ 900px", change: "The mosaic becomes four named desktop groups and the shell drops its inline padding." },
  { at: "≥ 1320px", change: "Project previews open in the wide view." },
  { at: "≥ 760px", change: "This page's own two-column grids. Not a portfolio breakpoint." },
]

const STACKING_ENTRIES = [
  { z: "--z-dock / --z-chrome", name: "Dock & chrome", note: "The main content wrapper, and the bottom scroll edge inside it." },
  { z: "1", name: "About sheet", note: "Paints above the pinned project gallery during the takeover." },
  { z: "--z-corner", name: "Corner", note: "The About takeover close." },
  { z: "--z-overlay", name: "Overlay", note: "Hover cards, the local-time card, the work-history block." },
  { z: "--z-social / --z-social", name: "Section / social corners", note: "Both nav corners and the TOC, so they clear other overlays." },
  { z: "--z-dialog-backdrop / --z-dialog", name: "Dialog", note: "Gallery and photo backdrops, then their shells." },
  { z: "--z-skip-link", name: "Skip link", note: "Above everything, always." },
]

/* ------------------------------------------------------------------- shell */

/* Which section the reader is actually in. rootMargin pulls the detection line
   up to a third from the top so a heading counts as current once it has
   settled under the sticky bar, not when its last pixel leaves. */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState(SECTIONS[0].id)

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === "undefined") return
    const seen = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target.id, entry.intersectionRatio)
        let best: string | undefined
        let bestRatio = 0
        for (const section of SECTIONS) {
          const ratio = seen.get(section.id) ?? 0
          if (ratio > bestRatio) {
            best = section.id
            bestRatio = ratio
          }
        }
        if (best) setActive(best)
      },
      { rootMargin: "-33% 0px -50% 0px", threshold: [0, 0.01, 0.25, 0.5, 1] },
    )
    for (const section of SECTIONS) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [enabled])

  return active
}

/* One filter for prose, tables, and specimens. Rebuild searchable text when
   token values change so HMR cannot leave the search index stale. */
function useValueFilter(query: string, rootRef: React.RefObject<HTMLElement | null>, tokens: Record<string, string>) {
  const [matches, setMatches] = useState<number | null>(null)
  const [emptySections, setEmptySections] = useState<ReadonlySet<string>>(new Set())

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const needle = query.trim().toLowerCase()
    let found = 0

    for (const item of root.querySelectorAll<HTMLElement>("[data-ds-terms]")) {
      const haystack = `${item.dataset.dsTerms ?? ""} ${item.textContent ?? ""}`
        .replace(/\s+/g, " ")
        .toLowerCase()
      const hit = !needle || haystack.includes(needle)
      item.toggleAttribute("hidden", !hit)
      if (hit) found += 1
    }

    for (const block of root.querySelectorAll<HTMLElement>(".ds-block")) {
      const searchable = block.querySelector("[data-ds-terms]")
      const surviving = block.querySelector("[data-ds-terms]:not([hidden])")
      block.toggleAttribute("hidden", Boolean(needle) && Boolean(searchable) && !surviving)
    }

    const empty = new Set<string>()
    for (const section of root.querySelectorAll<HTMLElement>(".ds-section")) {
      const surviving = section.querySelector("[data-ds-terms]:not([hidden])")
      const blank = Boolean(needle) && !surviving
      section.toggleAttribute("hidden", blank)
      if (blank) empty.add(section.id)
    }

    setEmptySections(empty)
    setMatches(needle ? found : null)
  }, [query, rootRef, tokens])

  return { matches, emptySections }
}

export function DesignSystemPage({ links, name }: DesignSystemPageProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const filterRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState("")
  const filterId = useId()
  const tokens = useDesignTokens()
  const { matches, emptySections } = useValueFilter(query, rootRef, tokens)
  const readToken = (name: string) => tokens[name] ?? ""
  const resolveColor = <T extends { token?: string; hex?: string }>(entry: T) => {
    const value = entry.token?.startsWith("--") ? readToken(entry.token) : entry.hex ?? ""
    // Expand CSS shorthand for the contrast calculator and copy buttons.
    const hex = /^#[\da-f]{3}$/i.test(value)
      ? `#${[...value.slice(1)].map((digit) => digit + digit).join("")}`
      : value
    return { ...entry, hex }
  }
  const PAGE_BG = resolveColor({ token: "--canvas" }).hex
  const SURFACES = SURFACES_ENTRIES.map(resolveColor)
  const INK = INK_ENTRIES.map(resolveColor)
  const NON_TEXT = NON_TEXT_ENTRIES.map(resolveColor)
  const muted = resolveColor({ token: "--muted" }).hex
  const mutedSoft = resolveColor({ token: "--muted-soft" }).hex
  const tile = resolveColor({ token: "--mosaic-card-surface" }).hex
  const ratioText = (foreground: string, background: string) =>
    foreground && background ? `${contrast(foreground, background).toFixed(2)}:1` : "…"
  const TYPE_SCALE = TYPE_SCALE_ENTRIES.map((entry) => {
    const value = readToken(entry.token)
    const pixels = value.endsWith("rem")
      ? Number.parseFloat(value) * Number.parseFloat(tokens.rootFontSize)
      : Number.parseFloat(value)
    return { ...entry, spec: value ? `${value} · ${pixels}px` : "Loading…" }
  })
  const RADII = RADII_ENTRIES.map((entry) => ({
    ...entry, value: `${entry.value} · ${readToken(entry.css)}`, css: readToken(entry.css),
  }))
  const EASINGS = EASINGS_ENTRIES.map((entry) => ({
    ...entry, css: entry.css.startsWith("--") ? readToken(entry.css) : entry.css,
  }))
  const DURATIONS = DURATIONS_ENTRIES.map((entry) => ({
    ...entry, value: entry.value.startsWith("--") ? `${entry.value} · ${readToken(entry.value)}` : entry.value,
  }))
  const STACKING = STACKING_ENTRIES.map((entry) => ({
    ...entry, z: entry.z.replace(/--[\w-]+/g, readToken),
  }))
  const active = useActiveSection(query.trim().length === 0)

  /* A reference gets consulted mid-keystroke, so the filter takes "/" the way
     every other search field on the web does — but only when the reader is not
     already typing somewhere. */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null
        if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return
        event.preventDefault()
        filterRef.current?.focus()
        filterRef.current?.select()
      }
      if (event.key === "Escape" && document.activeElement === filterRef.current) {
        setQuery("")
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const filtering = query.trim().length > 0

  return (
    <main id="main-content" tabIndex={-1} className="ds-page" ref={rootRef} data-filtering={filtering || undefined}>
      <a href="#ds-content" className="ds-skip">
        Skip to reference
      </a>

      <div className="ds-app">
        <div className="ds-rail">
          <div className="ds-rail-inner">
            <div className="ds-rail-head">
              <a href="/" className="ds-home-link">
                <span aria-hidden="true">←</span> Portfolio
              </a>
              <p className="ds-eyebrow">{name}</p>
              <p className="ds-rail-title">
                Design system <span className="ds-badge">Dev only</span>
              </p>
            </div>

            <div className="ds-filter">
              <label className="ds-visually-hidden" htmlFor={filterId}>
                Filter values, tokens, and rules
              </label>
              <Search className="ds-filter-icon" aria-hidden="true" />
              <input
                id={filterId}
                ref={filterRef}
                type="search"
                className="ds-filter-input"
                value={query}
                placeholder="Filter values"
                autoComplete="off"
                spellCheck={false}
                onChange={(event) => setQuery(event.target.value)}
              />
              {filtering ? (
                <button type="button" className="ds-filter-clear" onClick={() => setQuery("")} aria-label="Clear filter">
                  <X aria-hidden="true" />
                </button>
              ) : (
                <kbd className="ds-filter-kbd" aria-hidden="true">
                  /
                </kbd>
              )}
            </div>

            <p className="ds-filter-status" role="status">
              {filtering ? `${matches ?? 0} ${matches === 1 ? "entry" : "entries"}` : " "}
            </p>

            <nav className="ds-nav" aria-label="Design system sections">
              {SECTIONS.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="ds-nav-link"
                  data-active={!filtering && active === section.id ? "true" : undefined}
                  data-empty={emptySections.has(section.id) ? "true" : undefined}
                  aria-current={!filtering && active === section.id ? "true" : undefined}
                >
                  <span className="ds-nav-marker" aria-hidden="true" />
                  {section.label}
                </a>
              ))}
            </nav>

            <p className="ds-rail-foot">
              Token values follow the live CSS. Keep descriptions and component exceptions in step with the source.
            </p>
          </div>
        </div>

        {/* The rail repeats nine links and a filter ahead of the reference on
            every load, so it gets a bypass. Focusable because moving focus to a
            plain div does nothing. */}
        <div className="ds-work" id="ds-content" tabIndex={-1}>
          <header className="ds-hero">
            <h1>Design system</h1>
            <p className="ds-lede">
              An inventory of what already ships, not a proposal. Reach for a value on this page before inventing a
              new one.
            </p>
          </header>

          {filtering && matches === 0 ? (
            <p className="ds-empty">
              Nothing matches <strong>{query.trim()}</strong>. The filter reads token names, hex values, curves, and
              every rule&rsquo;s wording.
            </p>
          ) : null}

          {/* ------------------------------------------------- principles -- */}
          <section id="principles" className="ds-section">
            <div className="ds-section-heading">
              <h2>Principles</h2>
              <p>Five habits the code already keeps.</p>
            </div>
            <ul className="ds-list">
              <li data-ds-terms={terms("grey colour signal accent neutral ink saturated confirmation linkedin x brand")}>
                <strong>Grey does the work; colour is a signal.</strong> Use the <a href="#colour">neutral
                palette</a>. Saturated colour is kept for confirmations, borrowed brands, and the page-edge glow.
              </li>
              <li data-ds-terms={terms("hover reveal relocate reflow work-history popover float overlay space")}>
                <strong>Hover reveals; it never relocates.</strong> Things fade and settle in place. Anything larger
                floats over the page. If an interaction would reflow the layout, float it or reserve the room.
              </li>
              <li data-ds-terms={terms("entrance exit curve opacity transform duration overlay")}>
                <strong>Every entrance owns its exit.</strong> Floating previews share <a href="#overlay-motion">one
                recipe</a>. The exit is always shorter than the entrance.
              </li>
              <li data-ds-terms={terms("contrast floor aa ratio #757575 #2d2d2d focus ring wcag")}>
                <strong>Contrast is a floor, not a preference.</strong> The ink ramp stops at <code>#757575</code>{" "}
                because the next step fails AA, and the focus ring is <code>#2d2d2d</code> because it needs 3:1.
              </li>
              <li data-ds-terms={terms("prefers-reduced-motion reset motion accessibility opt out")}>
                <strong>Nothing is required to move.</strong> A global <code>prefers-reduced-motion</code> reset
                clamps durations, and components opt out by hand where the reset alone would leave them mid-animation.
              </li>
            </ul>
          </section>

          {/* ----------------------------------------------------- colour -- */}
          <section id="colour" className="ds-section">
            <div className="ds-section-heading">
              <h2>Colour</h2>
              <p>
                Five surfaces, one ink ramp, and a short list of colours allowed to be colourful. Ratios are computed
                live against {PAGE_BG}.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Surfaces</p>
              <div className="ds-grid">
                {SURFACES.map((surface) => (
                  <SpecCard
                    key={surface.name}
                    className="ds-swatch-card"
                    terms={terms(surface.name, surface.hex, surface.token, surface.note, "surface background")}
                    proof={<div className="ds-swatch" style={{ background: surface.hex }} />}
                    name={surface.name}
                    copy={surface.hex}
                    spec={surface.token === "—" ? undefined : surface.token}
                    note={surface.note}
                  />
                ))}
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Ink ramp</p>
              <div className="ds-ramp">
                {INK.map((step) => (
                  <div
                    key={step.use}
                    className="ds-ramp-row"
                    data-ds-terms={terms(step.hex, step.token, step.use, "ink text colour")}
                  >
                    <div className="ds-ramp-sample" style={{ color: step.hex }}>
                      {step.use}
                      <span>
                        {step.hex}
                        {step.token === "—" ? "" : ` · ${step.token}`}
                      </span>
                    </div>
                    <div className="ds-ramp-meta">
                      <ContrastBadge color={step.hex} on={PAGE_BG} />
                      <CopyValue value={step.hex} />
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="ds-rule ds-rule-warn"
                data-ds-terms={terms("muted muted-soft ramp tile #ececee mosaic-card-surface aa")}
              >
                <strong>The ramp is calibrated for the page, not the tile.</strong>
                <p>
                  On white, <code>--muted</code> is {ratioText(muted, PAGE_BG)} and <code>--muted-soft</code>{" "}
                  {ratioText(mutedSoft, PAGE_BG)}. On <code>--mosaic-card-surface</code> ({tile}) they drop to{" "}
                  {ratioText(muted, tile)} and {ratioText(mutedSoft, tile)}. On tiles, stop at <code>--muted</code>.
                </p>
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Signal &amp; non-text</p>
              <div className="ds-grid">
                {NON_TEXT.map((entry) => (
                  <SpecCard
                    // Token entries have no hex until the tokens resolve, so key on the name.
                    key={entry.name}
                    className="ds-swatch-card"
                    terms={terms(entry.name, entry.hex, entry.note, "signal non-text")}
                    proof={<div className="ds-swatch" style={{ background: entry.hex }} />}
                    name={entry.name}
                    copy={entry.hex}
                    note={entry.note}
                    badge={<ContrastBadge color={entry.hex} kind={entry.kind} on={PAGE_BG} />}
                  />
                ))}
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Borrowed brand</p>
              <div className="ds-grid">
                {BRAND.map((entry) => (
                  <SpecCard
                    key={entry.hex}
                    className="ds-swatch-card"
                    terms={terms(entry.name, entry.hex, entry.note, "brand vendor")}
                    proof={<div className="ds-swatch" style={{ background: entry.hex }} />}
                    name={entry.name}
                    copy={entry.hex}
                    note={entry.note}
                  />
                ))}
              </div>
              <div
                className="ds-rule"
                data-ds-terms={terms("vendor colour x linkedin exemption brand elastic page edge overscroll aurora")}
              >
                <strong>Vendor colours stay vendor colours, and stay in their component.</strong>
                <p>
                  A recognisable chrome is the point of the X card, the LinkedIn pill, and the contribution graph, so
                  they keep their vendor's palette. The only site-owned hue is the elastic page-edge glow — a random
                  pastel that shows during overscroll and is disabled under reduced motion (tune it at{" "}
                  <a href="/?tune=edge">/?tune=edge</a>). No other surface introduces colour.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------- typography -- */}
          <section id="typography" className="ds-section">
            <div className="ds-section-heading">
              <h2>Typography</h2>
              <p>
                One face, four sizes, four weights. The handwriting faces are the only display exception.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Families</p>
              <div className="ds-grid ds-grid-wide">
                <SpecCard
                  terms={terms("ui system stack font-ui font-body apple sf pro inter variable webfont")}
                  name="UI — --font-ui"
                  copy={readToken("--font-ui")}
                  note={
                    <>
                      All copy and controls: SF on Apple hardware, self-hosted Inter Variable everywhere else.{" "}
                      <code>--font-body</code> aliases it. There is no second general-purpose face.
                    </>
                  }
                />
                <SpecCard
                  terms={terms("display handlee la belle aurore caveat webfont cursive avatar hint marginalia signature")}
                  name="Display — Handlee"
                  copy='"Handlee", "Bradley Hand", "Segoe Print", cursive'
                  note="The avatar hint and the notes' margin annotations. La Belle Aurore and Caveat are reserved for project signatures."
                />
                <SpecCard
                  terms={terms("mono font-code sf mono consolas menlo specification")}
                  name="Mono"
                  copy='"SF Mono", "SFMono-Regular", "Consolas", Menlo, monospace'
                  note="Token names and values on this page, and code samples in notes."
                />
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Scale</p>
              <div>
                {TYPE_SCALE.map((entry) => (
                  <div
                    key={entry.token}
                    className="ds-type-row"
                    data-ds-terms={terms(entry.token, entry.spec, entry.where, "type scale size")}
                  >
                    <div className="ds-type-sample" style={entry.style}>
                      {entry.sample}
                    </div>
                    <div className="ds-type-spec">
                      <CopyValue value={entry.token} />
                      <span>{entry.spec}</span>
                      <b>{entry.where}</b>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ds-rule" data-ds-terms={terms("four steps scale")}>
                <strong>Four steps; the element bends before the scale does.</strong>
                <p>If a new element does not fit one of the four, change the element.</p>
              </div>
              <div
                className="ds-rule"
                data-ds-terms={terms("tracking letter-spacing line-height -0.005rem -0.00563rem prose")}
              >
                <strong>Tracking follows size; line-height follows the job.</strong>
                <p>
                  16px and up take <code>-0.005rem</code>, 14px takes <code>-0.00563rem</code>, 12px takes none.
                  Line-height is set per role: <code>1</code> for pill labels, <code>1.25–1.35</code> for dense rows,{" "}
                  <code>1.5–1.7</code> for lists and prose.
                </p>
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Weights</p>
              <div className="ds-table-scroll">
                <table className="ds-table">
                  <thead>
                    <tr>
                      <th scope="col">Weight</th>
                      <th scope="col">Where it is used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WEIGHTS.map((weight) => (
                      <tr key={weight.value} data-ds-terms={terms(weight.value, weight.use, "weight font-weight")}>
                        <td style={{ fontWeight: weight.value }}>{weight.value}</td>
                        <td>{weight.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="ds-caption">Four is the whole set. Do not add a fifth to nudge one label.</p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Prose</p>
              <div
                className="ds-specimen ds-specimen-canvas"
                data-ds-terms={terms("prose inline link #4a4a4a #c8c8c8 underline skip-ink")}
              >
                <div className="ds-specimen-prose">
                  <p className="mosaic-profile-summary mosaic-profile-summary-followup">
                    Born in the US I helped build{" "}
                    <a href="https://matcha.xyz" target="_blank" rel="noreferrer" className="mosaic-profile-link">
                      Matcha.xyz
                    </a>{" "}
                    end-to-end, from product design to interaction design.
                  </p>
                  <p className="mosaic-profile-summary mosaic-profile-summary-followup">
                    I&apos;ve been fortunate to work with teams at <WorkedWithCompaniesInline />.
                  </p>
                  <p className="mosaic-profile-summary mosaic-profile-summary-followup">
                    You can reach me at{" "}
                    <a href={links.x} target="_blank" rel="noreferrer" className="mosaic-profile-link">
                      @rafaelmedian
                    </a>{" "}
                    or{" "}
                    <a href={`mailto:${links.email}`} className="mosaic-profile-link">
                      {links.email}
                    </a>
                    .
                  </p>
                </div>
              </div>
              <p className="ds-caption">
                Inline links are <code>#4a4a4a</code> over a <code>#c8c8c8</code> underline with{" "}
                <code>text-decoration-skip-ink: none</code>. Hover darkens both.
              </p>
            </div>
          </section>

          {/* --------------------------------------------- space & radius -- */}
          <section id="space" className="ds-section">
            <div className="ds-section-heading">
              <h2>Space &amp; radius</h2>
              <p>A short spacing ladder in rem, and four radii on one squircle curve.</p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Spacing</p>
              <div className="ds-grid ds-grid-tight">
                {SPACE.map((entry) => (
                  <SpecCard
                    key={entry.value}
                    className="ds-space-card"
                    terms={terms(entry.value, entry.use, "space spacing gap padding")}
                    proof={
                      <div className="ds-space-proof" aria-hidden="true">
                        <span style={{ width: entry.value.startsWith("clamp") ? "100%" : entry.value }} />
                      </div>
                    }
                    name={entry.value}
                    copy={entry.value}
                    note={entry.use}
                  />
                ))}
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Radius</p>
              <div className="ds-grid">
                {RADII.map((entry) => (
                  <SpecCard
                    key={entry.value}
                    terms={terms(entry.value, entry.css, entry.use, "radius corner border-radius squircle superellipse")}
                    proof={
                      <div
                        className="ds-radius-proof"
                        data-corner-shape={entry.value.startsWith("--radius-full") ? "round" : undefined}
                        style={{ borderRadius: `${entry.css} ${entry.css} 0 0` }}
                        aria-hidden="true"
                      />
                    }
                    name={entry.value.split(" · ")[0]}
                    copy={entry.css}
                    note={entry.use}
                  />
                ))}
              </div>
              <p className="ds-caption">
                Corners use <code>--corner-curve: squircle</code>, the <code>superellipse(2)</code> curve.
                Browsers without <code>corner-shape</code> fall back to the same circular radii. Pills, dots, and
                avatars stay geometrically round.
              </p>
              <div className="ds-rule" data-ds-terms={terms("concentric nested radius calc --radius-md --radius-lg")}>
                <strong>Nested corners are derived, not a fifth step.</strong>
                <p>
                  The outer radius equals the inner radius plus the gap between them, written as <code>calc()</code>{" "}
                  off a token — for example <code>calc(var(--radius-md) - 5px)</code> for the LinkedIn card&rsquo;s
                  media. That keeps them correct when padding changes.
                </p>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------- elevation -- */}
          <section id="elevation" className="ds-section">
            <div className="ds-section-heading">
              <h2>Elevation</h2>
              <p>Four levels at low opacity. Blur and spread express height; darkness does not.</p>
            </div>
            <div className="ds-block">
              <div className="ds-grid ds-grid-wide">
                {ELEVATION.map((level) => (
                  <SpecCard
                    key={level.name}
                    className="ds-elevation-card"
                    terms={terms(level.name, level.shadow, level.use, "shadow elevation box-shadow")}
                    proof={<div className="ds-elevation-proof" style={{ boxShadow: level.shadow }} aria-hidden="true" />}
                    name={level.name}
                    copy={level.shadow}
                    note={level.use}
                  />
                ))}
              </div>
              <div
                className="ds-rule"
                id="project-caption-visibility"
                data-ds-terms={terms("--card-caption-blur --card-caption-tint --card-caption-delay scrim backdrop ramp mask caption hidden touch")}
              >
                <strong>Work-tile captions sit on a blur ramp, not a single blur.</strong>
                <p>
                  Four masked layers step <code>--card-caption-blur</code> up toward the bottom edge under a tint in
                  the tile&rsquo;s own colour (<code>--card-caption-tint</code>), so the label clears 4.5:1 without a
                  seam. It shows on hover and focus only. Below 700px and on touch screens the entire scrim is hidden
                  and so is the caption; the title still reaches assistive technology through the link&rsquo;s name.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------- components -- */}
          <section id="components" className="ds-section">
            <div className="ds-section-heading">
              <h2>Components</h2>
              <p>The real components, on the surfaces they ship on. Hover and focus states are live.</p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Contact pills</p>
              <div
                className="ds-specimen ds-specimen-canvas ds-specimen-center"
                data-ds-terms={terms("contact pill book a call booking linkedin x follow")}
              >
                <ContactActionRow
                  availabilityLabel={formatAvailability()}
                  bookingUrl={links.booking}
                  linkedinHref={links.linkedin}
                  xHref={links.x}
                  xProfile={xProfilePreview}
                  linkedinMedia={linkedinHoverMedia}
                />
              </div>
              <div className="ds-table-scroll" style={{ marginTop: "0.75rem" }}>
                <table className="ds-table">
                  <thead>
                    <tr>
                      <th scope="col">Variant</th>
                      <th scope="col">Treatment</th>
                      <th scope="col">Rule</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr data-ds-terms={terms("book a call booking dark pill --ink #000 primary action")}>
                      <td>Book a call</td>
                      <td>
                        <code>var(--ink) → #000</code>, white label
                      </td>
                      <td>The primary action. One per row.</td>
                    </tr>
                    <tr data-ds-terms={terms("linkedin pill #0a66c2 secondary vendor")}>
                      <td>LinkedIn</td>
                      <td>
                        Light shell, <code>#0a66c2</code> label
                      </td>
                      <td>Secondary. Carries a vendor mark, so it keeps the vendor colour.</td>
                    </tr>
                    <tr data-ds-terms={terms("follow light pill #f4f4f4 #fff tertiary")}>
                      <td>Follow</td>
                      <td>
                        <code>#f4f4f4 → #fff</code>, dark label
                      </td>
                      <td>Tertiary.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="ds-caption">
                All three are 2.125rem tall on <code>--radius-full</code>, with a 44px touch target below 700px.
                Shadow carries the press, not scale.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Chips &amp; controls</p>
              <div
                className="ds-specimen ds-specimen-canvas"
                data-ds-terms={terms("chip nav link local time count pill takeover close booking copy email address last updated #f2f2f2 #e9e9e9")}
              >
                <button type="button" className="mosaic-work-history-chip">
                  Chip · rest
                </button>
                <button type="button" className="mosaic-work-history-chip is-active">
                  Chip · active
                </button>
                <button type="button" className="mosaic-work-history-chip">
                  0x.org and Matcha.xyz
                </button>
                <a href="#components" className="mosaic-social-link">
                  Nav link
                </a>
                <span className="mosaic-social-time">Local time · 5:03pm AST</span>
                <span className="preview-gallery-count">3 of 12</span>
                <button
                  type="button"
                  className="mosaic-takeover-close"
                  data-visible="true"
                  aria-label="Close about specimen"
                  style={{ position: "relative", inset: "auto", zIndex: "auto", transform: "none" }}
                >
                  <X strokeWidth={1.75} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="mosaic-contact-pill mosaic-contact-pill-dark mosaic-booking-pill"
                  aria-haspopup="dialog"
                >
                  <span className="mosaic-contact-pill-content">
                    <span className="mosaic-contact-pill-dark-label">Book a call</span>
                  </span>
                </button>
                <button type="button" className="mosaic-profile-email">
                  <span className="mosaic-profile-email-icon" aria-hidden="true">
                    <Copy strokeWidth={2} />
                  </span>
                  <span className="mosaic-profile-email-label">{links.email}</span>
                </button>
                <SiteLastUpdated />
              </div>
              <p className="ds-caption">
                Chips rest on <code>--canvas</code> behind a hairline, labelled in <code>--muted</code>, and fill to{" "}
                <code>#e9e9e9</code> for hover, focus, and selected alike. Nav links extend an invisible{" "}
                <code>::before</code> so the tap target reaches 40px while the visible label stays 2rem. Hover hints
                on the address, booking pill, and last-updated clause share one card: <code>--canvas</code>,{" "}
                <code>--radius-md</code>, and the overlay shadow.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Surfaces in place</p>
              <div className="ds-grid ds-grid-wide">
                <div
                  className="ds-specimen ds-specimen-white ds-specimen-block"
                  style={{ boxShadow: "var(--shadow-ring), var(--shadow-overlay)" }}
                  data-ds-terms={terms("raised #ffffff hover card popover dialog")}
                >
                  <strong className="ds-specimen-title">Raised — #ffffff</strong>
                  <p className="ds-specimen-note">
                    Hover cards, popovers, dialogs. Always white, always shadowed, edged by{" "}
                    <code>--shadow-ring</code> rather than a border.
                  </p>
                </div>
                <div
                  className="ds-specimen ds-specimen-block"
                  data-ds-terms={terms("tile #ececee work card radius rgb(0 0 0 / 0.08)")}
                >
                  <strong className="ds-specimen-title">Tile — #ececee</strong>
                  <p className="ds-specimen-note">
                    Work cards: <code>--radius-lg</code> on desktop, <code>--radius-md</code> below 900px, an 8%
                    hairline, no shadow. They sit in the page rather than above it.
                  </p>
                </div>
                <div
                  className="ds-specimen ds-specimen-block"
                  style={{ background: "#f2f2f2" }}
                  data-ds-terms={terms("chip #f2f2f2 smallest surface filled label")}
                >
                  <strong className="ds-specimen-title">Chip — #f2f2f2</strong>
                  <p className="ds-specimen-note">The smallest surface. No border, no shadow — a filled label.</p>
                </div>
              </div>
            </div>

            <div className="ds-block" data-ds-terms={terms("quote slider carousel attribution portrait keyboard hint swipe drag --radius-lg --text-lg --text-md")}>
              <p className="ds-subhead">Quote slider</p>
              <p className="ds-caption">
                A white card on <code>--radius-lg</code>. Quotes up to 80 characters use <code>--text-lg</code>,
                longer ones <code>--text-md</code>. The card is one Tab stop: arrows page, Enter goes in, Escape comes
                out, and a <code>KeyboardHint</code> shows the keys. Drag or tap to advance; slides travel over{" "}
                <code>--duration-slow</code> on <code>--ease-smooth</code>.
              </p>
              <QuoteCard quotes={[...portfolioQuotes, ...sampleQuotes]} />
            </div>

            <div className="ds-block" data-ds-terms={terms("resume résumé folded paper tile curl gallery slide cv pdf")}>
              <p className="ds-subhead">Résumé tile</p>
              <p className="ds-caption">
                A standard work tile holding a folded sheet. On hover or focus the paper lifts and the corner peels
                over <code>--duration-base</code> on <code>--ease-smooth</code>. It opens the résumé as a slide of
                the preview gallery, not a modal of its own. Its miniature type is the one exception to the type
                scale.
              </p>
              <div className="ds-resume-tile-specimen mosaic-row-item">
                <ResumeTile />
              </div>
            </div>

            <div className="ds-block" data-ds-terms={terms("writings folder notes tools archive reader marginalia --mosaic-card-surface --radius-lg")}>
              <p className="ds-subhead">Writings folder</p>
              <p className="ds-caption">
                A tile on <code>--mosaic-card-surface</code> whose papers fan over 360ms on{" "}
                <code>--ease-smooth</code>. It opens the notes list as a gallery slide; a note is a nested view in
                the same dialog. The reader sets <code>--text-sm</code> prose under a <code>--text-lg</code> title on
                a 34rem measure, with Handlee marginalia in <code>--muted</code>.
              </p>
              <div style={{ maxWidth: "24rem", height: "420px", display: "flex" }}>
                <WritingsFolder onOpen={() => {}} onReaderReady={() => {}} />
              </div>
            </div>

            <div className="ds-block" data-ds-terms={terms("personal photos fan print white border wall close pill")}>
              <p className="ds-subhead">Personal photos</p>
              <p className="ds-caption">
                A fan of square prints, each framed by a thin <code>--canvas</code> border with{" "}
                <code>--shadow-ring</code> and <code>--shadow-control-hover</code>. Opening flies every print to its
                place on a full-screen photo wall over <code>--photo-open-duration</code> and back over{" "}
                <code>--photo-close-duration</code>. The only visible control is a <code>--radius-full</code> Close
                pill.
              </p>
              <PersonalPhotos />
            </div>
          </section>

          {/* ----------------------------------------------------- motion -- */}
          <section id="motion" className="ds-section">
            <div className="ds-section-heading">
              <h2>Motion</h2>
              <p>
                Three tokened curves, four duration tokens, and the scoped exceptions. Hover a card to replay its
                easing.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Easing</p>
              <div className="ds-grid ds-grid-wide">
                {EASINGS.map((easing) => (
                  <SpecCard
                    key={easing.name}
                    className="ds-motion-card"
                    terms={terms(easing.name, easing.css, easing.duration, easing.use, "easing curve motion")}
                    style={
                      {
                        "--ds-motion-ease": easing.css,
                        "--ds-motion-duration": easing.duration.includes("–")
                          ? `${easing.duration.split("–")[1]}`
                          : easing.duration,
                      } as CSSProperties
                    }
                    proof={
                      <div className="ds-motion-track">
                        <span className="ds-motion-dot" />
                      </div>
                    }
                    name={`${easing.name} · ${easing.duration}`}
                    copy={easing.css}
                    note={easing.use}
                  />
                ))}
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Duration</p>
              <div className="ds-table-scroll">
                <table className="ds-table">
                  <thead>
                    <tr>
                      <th scope="col">Band</th>
                      <th scope="col">What belongs there</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DURATIONS.map((entry) => (
                      <tr key={entry.value} data-ds-terms={terms(entry.value, entry.use, "duration band ms")}>
                        <td>{entry.value}</td>
                        <td>{entry.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ds-block">
              <div className="ds-rule" id="overlay-motion" data-ds-terms={terms("exit entrance opacity transform hover card popover")}>
                <strong>Hover cards share one entrance and exit.</strong>
                <p>
                  In over <code>--duration-base</code> on <code>--ease-smooth</code>, out over{" "}
                  <code>--duration-quick</code> on <code>--ease-exit</code>. Opacity and transform finish together;
                  unmount only after the exit completes.
                </p>
              </div>

              <div className="ds-rule" data-ds-terms={terms("direction axis preview gallery paging translateX swipe")}>
                <strong>Motion follows the axis of its control.</strong>
                <p>
                  The gallery pages sideways because its arrows and swipe are sideways: cards travel{" "}
                  <code>0.5rem</code> along X, leaving over <code>--duration-quick</code> and settling over{" "}
                  <code>--duration-base</code>. Along the other axis, nothing moves.
                </p>
              </div>

              <div className="ds-rule" data-ds-terms={terms("loading blur --blur-reveal 4px entrance skeleton")}>
                <strong>Loads and entrances share one blur.</strong>
                <p>
                  Media and entering text resolve from <code>--blur-reveal</code> to zero over{" "}
                  <code>--duration-slow</code> on <code>--ease-smooth</code>. Large dialogs use opacity and transform
                  only. Empty work tiles show a breathing skeleton until their artwork decodes.
                </p>
              </div>

              <div className="ds-rule" id="page-entrances" data-ds-terms={terms("first load avatar stagger 60ms 12px groups")}>
                <strong>The avatar arrives first, then the page.</strong>
                <p>
                  On a fresh visit the portrait resolves in place, then the homepage rises 12px from the same blur in
                  60ms steps, four at most, so the whole stagger stays under 300ms; every work group shares the last
                  step. Any input ends the intro at once; reduced motion skips it.
                </p>
              </div>

              <div className="ds-rule" data-ds-terms={terms("reduced motion animation-delay animation-duration staggered override")}>
                <strong>The reduced-motion reset is not enough on its own.</strong>
                <p>
                  It zeroes <code>animation-duration</code> but not <code>animation-delay</code>, so a staggered{" "}
                  <code>both</code>-filled entrance stays invisible for its delay. Staggered entrances and
                  transform-based hovers need their own <code>animation: none</code> override.
                </p>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------- layout -- */}
          <section id="layout" className="ds-section">
            <div className="ds-section-heading">
              <h2>Layout</h2>
              <p>One shell, one mosaic, and one stacking ladder.</p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Shell</p>
              <ul className="ds-list">
                <li data-ds-terms={terms("max width 1560px gutter 8px 700px 900px")}>
                  <strong>Max width 1560px.</strong> An 8px gutter below 700px; above it the grid owns its inset,{" "}
                  <code>clamp(16px, 3vw, 32px)</code> from 900px.
                </li>
                <li data-ds-terms={terms("mosaic grid named groups opening portraits offset closing cqw compact two columns display contents")}>
                  <strong>The mosaic is four named groups.</strong> Opening, Portraits, Offset, and Closing, each sized
                  against the mosaic&rsquo;s inline-size container from 900px up. Below that the group wrappers become{" "}
                  <code>display: contents</code> and the tiles form one two-column grid in the same DOM order.{" "}
                  <code>src/data/portfolio.ts</code> owns the order; <code>work-grid.css</code> owns both layouts.
                </li>
                <li data-ds-terms={terms("table of contents toc floating current section 48px")}>
                  <strong>A floating table of contents</strong> appears after 96px of scrolling, centred above the
                  bottom safe area. It is a 48px <code>--radius-full</code> chip naming the current section, and it
                  opens into a <code>--radius-lg</code> card with the overlay shadow.
                </li>
                <li data-ds-terms={terms("about takeover sticky stage runway 100dvh z-index 1")}>
                  <strong>The About takeover is one viewport of scrolling.</strong> From 700px up, the grid pins in a
                  sticky stage and the full-bleed About sheet crosses it at z-index 1 while the gallery recedes. Below
                  700px both collapse into normal flow.
                </li>
                <li data-ds-terms={terms("standalone project pages 404 46rem")}>
                  <strong>Standalone pages reuse the same tokens.</strong> Project pages and the 404 use a 46rem
                  column, <code>--text-lg</code> headings, and the same compiled stylesheet.
                </li>
              </ul>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Breakpoints</p>
              <div className="ds-table-scroll">
                <table className="ds-table">
                  <thead>
                    <tr>
                      <th scope="col">Width</th>
                      <th scope="col">What changes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BREAKPOINTS.map((entry) => (
                      <tr key={entry.at} data-ds-terms={terms(entry.at, entry.change, "breakpoint media query width")}>
                        <td>{entry.at}</td>
                        <td>{entry.change}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="ds-caption">
                Max-width queries stop at <code>.98px</code> so they cannot overlap the min-width rule above them.
                Hover-dependent components gate on <code>(hover: none)</code> and <code>(pointer: coarse)</code>,
                not width.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Stacking</p>
              <div className="ds-table-scroll">
                <table className="ds-table">
                  <thead>
                    <tr>
                      <th scope="col">z-index</th>
                      <th scope="col">Layer</th>
                      <th scope="col">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STACKING.map((entry) => (
                      <tr key={entry.name} data-ds-terms={terms(entry.z, entry.name, entry.note, "z-index stacking layer")}>
                        <td>{entry.z}</td>
                        <td>{entry.name}</td>
                        <td>{entry.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="ds-caption">
                Tailwind maps the same tokens. Use an existing tier; stacking inside an isolated component stays raw
                and local.
              </p>
            </div>
          </section>

          {/* ---------------------------------------------- accessibility -- */}
          <section id="accessibility" className="ds-section">
            <div className="ds-section-heading">
              <h2>Accessibility</h2>
              <p>The floors this codebase holds. Breaking one is a regression.</p>
            </div>
            <ul className="ds-list">
              <li data-ds-terms={terms("focus ring 2px solid var(--focus-ring) #2d2d2d offset :where() 1.4.11 3:1")}>
                <strong>Focus is always visible, and it is always one ring:</strong>{" "}
                <code>2px solid var(--focus-ring)</code> at a 2px offset, from one <code>:where()</code> base rule.
                Work tiles use <code>--focus-ring-soft</code>. Nothing adds a second ring or a halo.
              </li>
              <li data-ds-terms={terms("tabindex -1 landing container hash skip link outline none")}>
                <strong>Landing containers take focus without a ring.</strong> Sections that receive focus from a
                hash or skip link are <code>tabindex=&quot;-1&quot;</code> with <code>outline: none</code>.
              </li>
              <li data-ds-terms={terms("target 24px 44px tap ::before")}>
                <strong>Targets meet 24px; primary touch controls reach 44px.</strong> Grow the hit area with an
                invisible <code>::before</code> or padding, not the label.
              </li>
              <li data-ds-terms={terms("hover card preview tab order tabindex -1 focus")}>
                <strong>A card that opens on focus is a preview, not a stop.</strong> Its links are{" "}
                <code>tabindex=&quot;-1&quot;</code>, so the next Tab moves on and the card closes.
              </li>
              <li data-ds-terms={terms("composite widget one tab stop enter escape arrow keys keyboardhint aria-describedby")}>
                <strong>A widget with parts is one Tab stop.</strong> Arrows work it, Enter goes in, Escape comes out.
                A <code>KeyboardHint</code> shows the keys, and the same words are its{" "}
                <code>aria-describedby</code>.
              </li>
              <li data-ds-terms={terms("hover none touch caption assistive")}>
                <strong>Hover-only content has a non-hover fate.</strong> Hover cards are removed on touch, and tile
                captions follow the <a href="#project-caption-visibility">caption rule</a>.
              </li>
              <li data-ds-terms={terms("aria-live polite copy announcement asynchronous")}>
                <strong>Asynchronous results are announced</strong> through an <code>aria-live=&quot;polite&quot;</code>{" "}
                region.
              </li>
              <li data-ds-terms={terms("skip link z-index scroll-margin-top 5rem")}>
                <strong>The skip link is real.</strong> It is the first focusable element, and every page target
                carries <code>scroll-margin-top: 5rem</code>.
              </li>
              <li data-ds-terms={terms("decorative alt empty aria-label icon")}>
                <strong>Decorative imagery is empty-alt.</strong> Icons inside labelled controls use{" "}
                <code>alt=&quot;&quot;</code>, so the name is read once.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
