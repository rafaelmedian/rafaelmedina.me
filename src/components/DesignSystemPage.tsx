import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { Check, Copy, Search, X } from "lucide-react"

import { linkedinHoverMedia, xProfilePreview, type SiteLinks } from "../data/portfolio"
import { ContactActionRow } from "./ContactActionRow"
import { WorkedWithCompaniesInline } from "./WorkedWithCompaniesInline"

import "./design-system.css"

/*
 * The reference for what this site already is.
 *
 * Everything below was read out of src/index.css, tailwind.config.js, and the
 * components — it documents the system that shipped rather than one somebody
 * would like to have. Three consequences worth knowing before editing:
 *
 * 1. When you change a value in index.css, change it here too, or this page
 *    starts lying. The live specimens (ContactActionRow, the chips, the inline
 *    links) import the real components and cannot drift; the swatches, scale,
 *    and motion tables are transcriptions and can.
 * 2. Where the code and the intent disagree, the code wins and the gap is
 *    written down as a rule rather than quietly cleaned up. See the muted-ramp
 *    warning under Colour and the second-face note under Typography.
 * 3. This is a reference you read while writing CSS, so it is built as an
 *    instrument rather than an essay: a persistent rail that tells you where
 *    you are, a filter over every documented value, and one copyable spec line
 *    per entry. Anything that carries a value gets `data-ds-terms` so the
 *    filter can find it — add the attribute when you add an entry.
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

/* The colour text is actually measured against. `--body-bg` is set on <body>,
   but App's wrapper is `min-h-dvh bg-[var(--canvas)]`, so white covers the
   viewport and #fdfdfc only shows in overscroll. */
const PAGE_BG = "#ffffff"

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

const SURFACES = [
  {
    hex: "#ffffff",
    token: "--canvas",
    name: "Page & raised",
    note: "App's wrapper paints this across the viewport, so white is both the page and the colour of the full-bleed About sheet and anything floating above it — hover cards, popovers, the dialog, logo chips. Every ratio on this page is measured against it.",
  },
  {
    hex: "#fdfdfc",
    token: "--body-bg",
    name: "Beneath",
    note: "Set on <body>, then covered by the wrapper's --canvas. Visible only in overscroll. The contrast comments in index.css cite it; the difference is under 0.1:1, but measure against white.",
  },
  {
    hex: "#ececee",
    token: "--mosaic-card-surface",
    name: "Tile",
    note: "Work tiles. The one surface that is meaningfully darker than the page.",
  },
  {
    hex: "#f2f2f2",
    token: "—",
    name: "Chip rest",
    note: "Work-history chips, the person chip's hover, the popover's inline link.",
  },
  {
    hex: "#e9e9e9",
    token: "—",
    name: "Chip active",
    note: "The hover, focus, and pressed state for anything sitting on chip rest.",
  },
]

const INK = [
  { hex: "#111111", token: "--body-color", use: "Body default and headings" },
  { hex: "#141414", token: "--ink", use: "App wrapper text colour" },
  { hex: "#171717", token: "—", use: "Text inside white cards and the preview dialog" },
  { hex: "#2d2d2d", token: "--focus-ring", use: "Primary UI labels, hover states, and every focus ring" },
  { hex: "#363636", token: "—", use: "Inline links on hover" },
  { hex: "#4a4a4a", token: "—", use: "Inline links at rest" },
  { hex: "#545454", token: "—", use: "About-panel prose and the Work history heading" },
  { hex: "#6b6b6b", token: "--muted", use: "Secondary copy: subtitles, captions, dialog descriptions" },
  { hex: "#747474", token: "—", use: "Corner nav links and the local-time label" },
  { hex: "#757575", token: "--muted-soft", use: "Tertiary labels: definition terms and hobby notes" },
]

const NON_TEXT = [
  { hex: "#b5b5b5", kind: "non-text", name: "Separator", note: "The middot between a company and its role." },
  {
    hex: "#c8c8c8",
    kind: "non-text",
    name: "Underline",
    note: "Resting link underlines; darkens to #9b9b9b on hover.",
  },
  {
    hex: "#34a26a",
    kind: "non-text",
    name: "Available",
    note: "The availability dot. Never used behind text.",
  },
  {
    hex: "#e5352b",
    kind: "text",
    name: "Hint",
    note: "The Handlee avatar hint — display-sized, so 3:1 is the floor.",
  },
] satisfies ReadonlyArray<{ hex: string; kind: ContrastKind; name: string; note: string }>

const BRAND = [
  { hex: "#0a66c2", name: "LinkedIn", note: "Pill label. Vendor blue — do not re-tint to match the greys." },
  { hex: "#0f1419", name: "X ink", note: "Follow button fill and the card's name and bio." },
  { hex: "#1d9bf0", name: "X mention", note: "The @mention link inside the X hover card only." },
  { hex: "#536471", name: "X muted", note: "Handle and stat labels inside the X hover card only." },
]

/* -------------------------------------------------------------- typography */

const TYPE_SCALE = [
  {
    token: "--text-xs",
    sample: "Punta Cana · Local time",
    spec: "0.75rem · 12px",
    where: "Map attribution, count pills, avatar initials, compact project captions",
    style: { fontSize: "var(--text-xs)", lineHeight: 1.25 },
  },
  {
    token: "--text-sm",
    sample: "I'm a designer who ships products.",
    spec: "0.875rem · 14px",
    where: "Pill labels, body copy, detail rows, hover-card text, mobile corner nav, wider project captions",
    style: { fontSize: "var(--text-sm)", lineHeight: "1.25rem", letterSpacing: "-0.00563rem" },
  },
  {
    token: "--text-md",
    sample: "Senior Product Designer",
    spec: "1rem · 16px",
    where: "Hero name; About prose, labels, section headings, card titles, and metadata",
    style: { fontSize: "var(--text-md)", lineHeight: 1.5, letterSpacing: "-0.005rem", fontWeight: 600 },
  },
  {
    token: "--text-lg",
    sample: "Ten years prototyping in code.",
    spec: "1.125rem · 18px",
    where: "About ledes — the largest text on the site",
    style: { fontSize: "var(--text-lg)", lineHeight: 1.5, letterSpacing: "-0.015rem", fontWeight: 600 },
  },
]

const WEIGHTS = [
  { value: 400, use: "Body copy, nav links, summaries, definition values, résumé titles and companies" },
  { value: 500, use: "Pill labels, preview titles, popover roles" },
  { value: 600, use: "Headings, card titles, the mobile reveal, the X follow button" },
  { value: 700, use: "The X card name and stats only — vendor weight" },
]

/* ------------------------------------------------------------------- space */

const RADII = [
  {
    value: "--radius-sm · 8px",
    use: "Chips, nav hover targets, popover links, focus rings",
    css: "8px",
  },
  {
    value: "--radius-md · 16px",
    use: "Hover cards, popovers, the local-time card, the social-time pill",
    css: "16px",
  },
  {
    value: "--radius-lg · 24px",
    use: "Work tiles, dialog media and bottom corners",
    css: "24px",
  },
  { value: "--radius-full · 999px", use: "Pills, dots, avatars, nav buttons, the skip link", css: "999px" },
]

const SPACE = [
  { value: "0.25rem", use: "Icon-to-label, chip rows" },
  { value: "0.375rem", use: "Inside pills and stat groups" },
  { value: "0.5rem", use: "Hobby lists, X card internals" },
  { value: "0.625rem", use: "The contact action row" },
  { value: "0.75rem", use: "Work-history description offset and compact floating offsets" },
  { value: "1.25rem", use: "Maximum mobile contact-pill side padding" },
  { value: "1.5rem", use: "Takeover close offset from the right viewport edge" },
  { value: "2.5rem", use: "Takeover close offset from the top viewport edge" },
  { value: "5rem", use: "Minimum About inset, mobile Work-history gap, and rendered spacing before the CV download" },
  { value: "8.75rem", use: "Maximum About inset and desktop whitespace before Work history" },
  { value: "8px", use: "Mobile page gutter and row-video side inset below 700px" },
  { value: "1rem", use: "Mosaic row and column gap — the layout unit" },
  { value: "clamp(16px, 3vw, 32px)", use: "Page gutter from 700px to 899px" },
  { value: "clamp(12rem, 30vh, 18rem)", use: "Desktop white runway before the About takeover" },
]

/* --------------------------------------------------------------- elevation */

const ELEVATION = [
  {
    name: "Hairline",
    shadow: "inset 0 0 0 1px rgb(0 0 0 / 0.05)",
    use: "Logo chips at 0.05, dialog media frames at 0.06. Reads as an edge, not a lift.",
  },
  {
    name: "Resting control",
    shadow: "0 1px 5px rgb(46 42 42 / 0.08)",
    use: "Contact pills and the mobile reveal button. Goes to 0 4px 12px on hover, back to 0 1px 4px when pressed.",
  },
  {
    name: "Overlay — --shadow-overlay",
    shadow: "var(--shadow-overlay)",
    use: "The floating-surface tier: LinkedIn and X cards, the work-history popover, the local-time card, the takeover close, and the top edge of the About takeover. Surfaces without a border prepend a zero-blur 0 0 0 1px hairline ring before the var().",
  },
  {
    name: "Dialog",
    shadow: "0 1px 1px rgb(0 0 0 / 0.04), 0 18px 44px -18px rgb(0 0 0 / 0.28), 0 48px 92px -42px rgb(0 0 0 / 0.38)",
    use: "The preview gallery card. Three layers, negative spread, over a blurred backdrop.",
  },
]

/* ------------------------------------------------------------------ motion */

const EASINGS = [
  {
    name: "Standard — --ease-standard",
    css: "cubic-bezier(0.2, 0, 0, 1)",
    duration: "160–300ms",
    use: "The house curve. Chips, icons, expand buttons, sticker tracking, and card-title reveals — anything changing state in place.",
  },
  {
    name: "Smooth — --ease-smooth",
    css: "cubic-bezier(0.16, 1, 0.3, 1)",
    duration: "160–700ms",
    use: "Fast out of the gate, long settle. Overlays arriving, the intro cascades, the avatar coin flip, the emoji toss. Used to be three near-identical expo-outs; they are one token now.",
  },
  {
    name: "Exit — --ease-exit",
    css: "cubic-bezier(0.4, 0, 1, 1)",
    duration: "120–160ms",
    use: "Hover cards, the takeover close, and the preview gallery leaving. Always shorter than the entrance it reverses.",
  },
  {
    name: "Responsive resize",
    css: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    duration: "180ms",
    use: "The hero's min-height and padding as the viewport crosses layout states. Inline, not a token — two uses.",
  },
  {
    name: "Gallery open",
    css: "cubic-bezier(0.32, 0.8, 0.32, 1)",
    duration: "200ms",
    use: "The preview gallery's origin-aware, whole-surface expansion and its fallback lift.",
  },
  {
    name: "Popover exit",
    css: "cubic-bezier(0.55, 0, 1, 0.45)",
    duration: "160ms",
    use: "The work-history popover only — a slightly firmer close than the other overlays. Scoped as --mosaic-popover-exit-ease.",
  },
  {
    name: "Overshoot",
    css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    duration: "220ms",
    use: "The copy-email reaction only. The single place in the system that overshoots — keep it that way.",
  },
  {
    name: "Scroll linked",
    css: "linear",
    duration: "1 viewport of scroll",
    use: "One View Timeline drives the whole About takeover: the pinned gallery scales and fades, the seam's ambient cast deepens from 0.35 to full, and the scroll cue squeezes from a 22° chevron to a flat line before it fades.",
  },
]

const DURATIONS = [
  { value: "--duration-fast · 120ms", use: "Taps, small fades, popover-content swaps, and the shortest exit feedback." },
  { value: "--duration-quick · 160ms", use: "Colour, opacity, and shadow on hover or focus. The default for a state change. Absorbed the old 140/150/180ms one-offs." },
  { value: "--duration-base · 200ms", use: "Larger surface moves: the gallery open and close." },
  { value: "240ms", use: "The work-history popover settle, scoped as --mosaic-popover-enter-duration." },
  { value: "300ms", use: "The gallery expand/minimise icon swap." },
  { value: "--duration-slow · 360ms", use: "Media un-blurring as it decodes." },
  { value: "380–480ms", use: "Entrance travel: hero then mosaic on first load, and each About copy block as it first scrolls in." },
  { value: "700ms", use: "The bottom scroll edge, its emoji toss, and the avatar coin flip." },
]

/* ------------------------------------------------------------------ layout */

const BREAKPOINTS = [
  { at: "≤ 327.98px", change: "Contact pills use 0.625rem side padding; the wrapped X card centers on its trigger; location and availability stack without a separator." },
  { at: "≤ 479.98px", change: "Contact pills gain up to 1.25rem side padding and wrap when their container cannot accommodate them." },
  { at: "≤ 639.98px", change: "The hero reserves 4rem of top clearance." },
  { at: "≤ 699.98px", change: "Local time hides; the 14px About and Resume labels centre optically; the shell uses 8px gutters; every project shows in one 340–380px column; featured media crops to fill its card; the full-bleed About sheet returns to normal document flow; card captions stay visible over a static gradient without the desktop blur ramp." },
  { at: "480–699.98px + fine hover", change: "Contact pills stay 32px tall." },
  { at: "≥ 760px", change: "This page's own two-column grids. Not a portfolio breakpoint." },
  { at: "≥ 900px", change: "Mosaic rows go to 420px and the shell drops its inline padding." },
  {
    at: "≥ 1320px",
    change: "The hero name settles at 16px; project previews open in the 1090px wide view with a 5vh top inset.",
  },
]

const STACKING = [
  {
    z: "0–20",
    name: "--z-dock / --z-chrome",
    note: "The page, main content wrapper (Tailwind's z-dock maps onto the token), and the bottom scroll edge.",
  },
  { z: "1", name: "About sheet", note: "The full-viewport white surface paints above the pinned project gallery during takeover. Its seam layers — hairline, shadow, and ambient cast — share the level from the runway side." },
  { z: "auto", name: "Takeover cue", note: "The one control that deliberately declines a level. It is a positioned sibling following the stage in document order, so it already paints above it — and a z-index here would make it a stacking context and isolate the chevron's blend." },
  {
    z: "30 / 50",
    name: "--z-corner / --z-social",
    note: "The section corner and takeover close sit at --z-corner; the social corner sits at --z-social so its hover cards clear other overlays.",
  },
  {
    z: "40",
    name: "--z-overlay",
    note: "Hover cards, the local-time card, and the work-history block. The popover inside that block stacks locally (z 4 within its isolated container), so only the container carries the tier.",
  },
  { z: "60 / 70", name: "--z-dialog-backdrop / --z-dialog", note: "The preview gallery backdrop and pending veil, then its shell." },
  { z: "100", name: "--z-reaction", note: "The copy-email reaction has to clear the dialog trigger it sits under." },
  { z: "120", name: "--z-skip-link", note: "Above everything, always." },
  {
    z: "500 (scoped)",
    name: "Map attribution",
    note: "Clears Leaflet's internal panes inside the transformed local-time card — its own stacking context, so it never meets the ladder.",
  },
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

/* The filter runs over the DOM rather than over the data, because the entries
   are static markup that React never re-renders — a hidden attribute toggled
   here cannot be clobbered by a later render, and it keeps the prose lists,
   table rows, and card grids on one mechanism instead of three. */
function useValueFilter(query: string, rootRef: React.RefObject<HTMLElement | null>) {
  const [matches, setMatches] = useState<number | null>(null)
  const [emptySections, setEmptySections] = useState<ReadonlySet<string>>(new Set())

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const needle = query.trim().toLowerCase()
    let found = 0

    for (const item of root.querySelectorAll<HTMLElement>("[data-ds-terms]")) {
      /* An entry is findable by anything the reader can see on it plus the
         synonyms its data-ds-terms adds — searching "radius" should reach the
         caption that only mentions --radius-full in passing, not just the four
         cards somebody remembered to tag. Cached on first pass because the
         markup is static and textContent on the prose lists is not cheap. */
      if (item.dataset.dsHaystack === undefined) {
        item.dataset.dsHaystack = `${item.dataset.dsTerms ?? ""} ${item.textContent ?? ""}`
          .replace(/\s+/g, " ")
          .toLowerCase()
      }
      const hit = !needle || item.dataset.dsHaystack.includes(needle)
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
  }, [query, rootRef])

  return { matches, emptySections }
}

export function DesignSystemPage({ links, name }: DesignSystemPageProps) {
  const rootRef = useRef<HTMLElement | null>(null)
  const filterRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState("")
  const filterId = useId()
  const { matches, emptySections } = useValueFilter(query, rootRef)
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
              Read out of <code>index.css</code> and the components. Change a value there, change it here.
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
              Not a proposal — an inventory. Every value here was read back out of the shipped stylesheet and
              components, so it describes what this site already does. Treat it as the constraint: reach for something
              on this page before inventing a new one, and when you do change a value, change it in both places.
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
              <p>Five habits the existing code already keeps. They are descriptive first and prescriptive second.</p>
            </div>
            <ul className="ds-list">
              <li data-ds-terms={terms("grey colour signal accent neutral ink saturated availability linkedin x brand")}>
                <strong>Grey does the work; colour is a signal.</strong> The entire interface is built from ten steps of
                neutral ink on four near-white surfaces. The only saturated colours on screen belong to a status (the
                availability dot) or to somebody else's brand (LinkedIn, X). A new accent needs a reason beyond
                decoration.
              </li>
              <li data-ds-terms={terms("hover reveal relocate reflow work-history popover float overlay space")}>
                <strong>Hover reveals; it never relocates.</strong> Cards, titles, and icons fade and settle in place.
                Anything larger floats — the work-history popovers overlay the page instead of expanding it. If an
                interaction would reflow the layout, float it or reserve the room instead.
              </li>
              <li data-ds-terms={terms("entrance exit curve opacity transform duration overlay")}>
                <strong>Every entrance owns its exit.</strong> Overlays enter on the entrance curve and leave on the exit
                curve, shorter. Opacity and transform share a duration so a card never finishes fading while it is still
                moving.
              </li>
              <li data-ds-terms={terms("contrast floor aa ratio #757575 #2d2d2d focus ring wcag")}>
                <strong>Contrast is a floor, not a preference.</strong> The ink ramp stops at <code>#757575</code>{" "}
                because the next step down fails AA on the page background, and the focus ring is <code>#2d2d2d</code>{" "}
                rather than a grey because it needs 3:1 against white.
              </li>
              <li data-ds-terms={terms("prefers-reduced-motion reset motion accessibility opt out")}>
                <strong>Nothing is required to move.</strong> A global{" "}
                <code>prefers-reduced-motion</code> reset zeroes durations, and seven further blocks opt individual
                components out by hand where the reset alone would leave them stuck mid-animation.
              </li>
            </ul>
          </section>

          {/* ----------------------------------------------------- colour -- */}
          <section id="colour" className="ds-section">
            <div className="ds-section-heading">
              <h2>Colour</h2>
              <p>
                Four surfaces, one ink ramp, and a short list of colours that are allowed to be colourful. Ratios are
                computed live against {PAGE_BG} — the colour the app wrapper actually paints.
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
                    key={step.hex}
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
                data-ds-terms={terms("muted muted-soft ramp tile #ececee mosaic-card-surface aa 4.61 5.33 3.91 4.52")}
              >
                <strong>The ramp is calibrated for the page, not for the tile.</strong>
                <p>
                  On white both muted steps clear AA — <code>--muted</code> at 5.33:1 and <code>--muted-soft</code> at
                  4.61:1. On <code>--mosaic-card-surface</code> (#ececee) they fall to 4.52:1 and 3.91:1, so{" "}
                  <code>--muted-soft</code> stops passing for normal-size text. The About sheet is white, so its hobby
                  notes, definition terms, and résumé headings can use <code>--muted-soft</code>; on work tiles, stop at{" "}
                  <code>--muted</code>.
                </p>
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Signal &amp; non-text</p>
              <div className="ds-grid">
                {NON_TEXT.map((entry) => (
                  <SpecCard
                    key={entry.hex}
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
              <p className="ds-subhead">Elastic page edge</p>
              <div
                className="ds-rule"
                data-ds-terms={terms("elastic page edge overscroll 56px wash analogous emoji toss 700ms gravity")}
              >
                <strong>A quiet, changing wash.</strong>
                <p>
                  The 56px page-end curve blends five clean analogous shades, chosen again for each pull. Its deeper,
                  more saturated centre sits beneath a translucent white highlight while broader pale layers recede
                  toward the sides. The soft-edged ellipses blend without any filter pass, keeping the strip cheap to
                  repaint while the gesture and 700ms release remain the effect's dominant motion. Each fresh gesture
                  also tosses a wink and three non-repeating companions from below the viewport on staggered 700ms
                  rises — each a single layer that eases upward, tumbles, and accelerates down under gravity. They
                  remain decorative and pointer-free, clean up after landing, and disappear with the entire effect
                  under reduced motion.
                </p>
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
              <div className="ds-rule" data-ds-terms={terms("vendor colour x linkedin chrome exemption brand")}>
                <strong>Vendor colours stay vendor colours.</strong>
                <p>
                  The X card reproduces X's own palette and the LinkedIn pill its blue, because a recognisable chrome is
                  the point of both. Those vendor exemptions do not extend past the two components; the elastic page
                  edge above is the sole site-owned hue exception, and no other surface may introduce colour.
                </p>
              </div>
            </div>

          </section>

          {/* ------------------------------------------------- typography -- */}
          <section id="typography" className="ds-section">
            <div className="ds-section-heading">
              <h2>Typography</h2>
              <p>
                Interface text uses one face, four sizes, and four weights. The handwritten avatar hint and draggable
                emoji stickers are deliberate display exceptions.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Families</p>
              <div className="ds-grid ds-grid-wide">
                <SpecCard
                  terms={terms("ui system stack font-ui font-body apple sf pro inter webfont")}
                  name="UI — --font-ui"
                  copy='-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Inter", sans-serif'
                  note={
                    <>
                      All interface copy and controls. No webfont, no layout shift, SF Pro on Apple hardware. Use{" "}
                      <code>var(--font-ui)</code>; <code>var(--font-body)</code> is the Inter-first fallback stack the
                      page root sets.
                    </>
                  }
                />
                <SpecCard
                  terms={terms("display handlee webfont cursive avatar hint text-stroke")}
                  name="Display — Handlee"
                  copy='"Handlee", "Bradley Hand", "Segoe Print", cursive'
                  note={
                    <>
                      The only real webfont, preloaded and scoped to a single element: the handwritten hint beside the
                      avatar. It ships one weight, so it fakes bold with a 0.45px text-stroke.
                    </>
                  }
                />
                <SpecCard
                  terms={terms("mono font-code sf mono consolas menlo specification")}
                  name="Mono — --font-code"
                  copy='"SF Mono", "SFMono-Regular", "Consolas", Menlo, monospace'
                  note="Specification text only — token names and values, as used throughout this page."
                />
              </div>
              <div
                className="ds-rule"
                data-ds-terms={terms("--font-primary --font-fallback --font-ui face")}
              >
                <strong>There is no second general-purpose face.</strong>
                <p>
                  Two stacks exist: <code>--font-ui</code> (system-first, what interface text renders with) and{" "}
                  <code>--font-fallback</code> (Inter-first, what <code>--font-body</code> resolves to on the page
                  root). Any additional general-purpose face needs a real <code>@font-face</code>, not a new variable.
                </p>
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Scale</p>
              <div>
                {TYPE_SCALE.map((entry) => (
                  <div
                    key={entry.spec}
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
              <div className="ds-rule" data-ds-terms={terms("four steps scale 0.82rem 0.8125rem 0.9rem 0.875rem noise")}>
                <strong>Four steps, and the element bends before the scale does.</strong>
                <p>
                  This ramp used to carry twelve distinct sizes, half of them a fraction of a pixel from a neighbour —{" "}
                  <code>0.82rem</code> beside <code>0.8125rem</code>, <code>0.9rem</code> beside <code>0.875rem</code>.
                  That is noise, not a scale. Use a token; if a new element will not fit one of the four, change the
                  element.
                </p>
              </div>
              <div
                className="ds-rule"
                data-ds-terms={terms("tracking letter-spacing line-height -0.005rem -0.00563rem prose 1.7")}
              >
                <strong>Tracking follows size; line-height follows job.</strong>
                <p>
                  16px and up take <code>-0.005rem</code>; 14px takes <code>-0.00563rem</code>; 12px takes none.
                  Line-height is not part of the token — it is set per role: <code>1</code> for a pill label whose box
                  must optically centre, <code>1.25–1.35</code> for dense rows, <code>1.5–1.6</code> for lists, and{" "}
                  <code>1.7</code> for prose.
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
              <p className="ds-caption">
                There used to be eight steps, including 560, 640, and 650 — each a single-component optical correction
                sitting within 50 units of 600, which is below what the eye resolves on a variable face. They were
                folded into 600, and 460 into 500. Four is the whole set; do not reintroduce a fifth to nudge one label.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Prose</p>
              <div
                className="ds-specimen ds-specimen-canvas"
                data-ds-terms={terms("prose inline link #4a4a4a #c8c8c8 underline skip-ink tilt logo")}
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
                Inline links are <code>#4a4a4a</code> with a <code>#c8c8c8</code> underline at{" "}
                <code>0.0625rem</code>, <code>0.11em</code> below the baseline, with{" "}
                <code>text-decoration-skip-ink: none</code> so descenders do not punch holes in it. Hover darkens both
                the text and the rule. Hovering a company name lifts its logos on a tilt that tracks the pointer.
              </p>
            </div>
          </section>

          {/* --------------------------------------------- space & radius -- */}
          <section id="space" className="ds-section">
            <div className="ds-section-heading">
              <h2>Space &amp; radius</h2>
              <p>
                Spacing is a short ladder in rem. Radius is four tokens, and anything nested is derived from one of them
                rather than added to them.
              </p>
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
                    terms={terms(entry.value, entry.css, entry.use, "radius corner border-radius")}
                    proof={
                      <div
                        className="ds-radius-proof"
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
              <div
                className="ds-rule"
                data-ds-terms={terms("concentric nested radius calc 11px 11.5px 10px --radius-md --radius-lg")}
              >
                <strong>Nested corners are concentric, and they are derived — not a fifth step.</strong>
                <p>
                  When one rounded box sits inside another, the outer radius is the inner radius plus the gap between
                  them. Those cases are written as <code>calc()</code> off one of the four tokens rather than measured
                  and hard-coded: the LinkedIn card's media is <code>calc(var(--radius-md) - 5px)</code>, the preview dialog is{" "}
                  <code>calc(var(--radius-lg) + card-padding)</code>. That is how 11px, 11.5px, and 10px corners exist
                  without being scale steps — and why they stay correct when a padding changes.
                </p>
              </div>
            </div>
          </section>

          {/* -------------------------------------------------- elevation -- */}
          <section id="elevation" className="ds-section">
            <div className="ds-section-heading">
              <h2>Elevation</h2>
              <p>
                Four levels, all warm-black at low opacity. Height is expressed by blur and spread rather than by
                darkness.
              </p>
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
                data-ds-terms={terms("--card-caption-blur 2.5rem scrim backdrop ramp mask 12% 30% 62% 100% 0.68 360ms")}
              >
                <strong>
                  <code>--card-caption-blur: 2.5rem</code> is the work tile's caption backdrop, and it is a ramp.
                </strong>
                <p>
                  Four masked layers on <code>.mosaic-row-card-scrim</code> step the radius through 12%, 30%, 62%, and
                  100% of that value, so the artwork softens toward the bottom edge instead of stopping at a seam. A
                  single masked blur layer is not the same effect — a mask fades the opacity of a uniformly blurred
                  layer, which leaves the top of the band a half-strength blend of sharp and blurred. A{" "}
                  <code>rgb(0 0 0 / 0.68)</code> ramp sits above all four: blur cannot promise contrast on its own,
                  because a blurred white screenshot is still white. Its bottom stop keeps the caption at 4.5:1 even
                  over white artwork. The two fade on separate clocks — the tint at the 160ms hover default alongside
                  the caption, the ramp at the 360ms un-blurring step — because fading them together held the caption
                  illegible until four backdrop rasters were ready, and the whole effect read as a stall. It paints only
                  on hover and focus, one tile at a time. Below 700px and on coarse pointers, the four blur layers stay
                  off while the tint and caption remain visible as a static, scroll-friendly label.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------- components -- */}
          <section id="components" className="ds-section">
            <div className="ds-section-heading">
              <h2>Components</h2>
              <p>
                Rendered from the real components and classes, on the surfaces they actually ship on. Hover and focus
                them — the states are live.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Contact pills</p>
              <div
                className="ds-specimen ds-specimen-canvas ds-specimen-center"
                data-ds-terms={terms("contact pill copy email linkedin x follow button specular bevel")}
              >
                <ContactActionRow
                  email={links.email}
                  contactHref={`mailto:${links.email}`}
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
                    <tr data-ds-terms={terms("default pill #f4f4f4 #fff #dedee0 112px primary action")}>
                      <td>Default</td>
                      <td>
                        <code>#f4f4f4 → #fff</code> gradient, <code>#dedee0</code> border, 112px fixed
                      </td>
                      <td>The primary action. One per row.</td>
                    </tr>
                    <tr data-ds-terms={terms("linkedin pill #0a66c2 92px secondary vendor")}>
                      <td>LinkedIn</td>
                      <td>
                        Same shell, <code>#0a66c2</code> label, 92px min
                      </td>
                      <td>Secondary. Carries a vendor mark, so it borrows the vendor colour.</td>
                    </tr>
                    <tr data-ds-terms={terms("dark pill #171717 #000 white label 80px tertiary")}>
                      <td>Dark</td>
                      <td>
                        <code>#171717 → #000</code> gradient, white label, 80px min
                      </td>
                      <td>Tertiary. Heaviest fill but the smallest footprint, so it does not lead.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="ds-caption">
                All three use a 2rem fine-pointer height and <code>--radius-full</code>; below 700px, touch inputs keep a
                44px target. They share the same physical build: an outer shadow, a{" "}
                <code>::before</code> specular highlight across the top, and a <code>::after</code> ring of inset
                shadows for the bottom bevel. Labels sit at <code>top: -1px</code> because SF rides low in its em box at
                13px. Shadow, not scale, carries the press.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Chips &amp; controls</p>
              <div
                className="ds-specimen ds-specimen-canvas"
                data-ds-terms={terms("chip nav link local time count pill takeover close availability dot #f2f2f2 #e9e9e9")}
              >
                <button type="button" className="mosaic-work-history-chip">
                  Chip · rest
                </button>
                <button type="button" className="mosaic-work-history-chip is-active">
                  Chip · active
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
                  <X aria-hidden="true" />
                </button>
                <p className="mosaic-profile-availability" style={{ margin: 0 }}>
                  <span className="mosaic-availability-dot" style={{ opacity: 1 }} aria-hidden="true" />
                  Available for work
                </p>
              </div>
              <p className="ds-caption">
                Chips carry <code>#f2f2f2</code> at rest and <code>#e9e9e9</code> for hover, focus, and selected —
                deliberately the same value, because a chip that is open and a chip under the cursor mean the same
                thing. Nav links extend a <code>2.5rem</code> invisible <code>::before</code> so the tap target reaches
                40px while the visible label stays 2rem. The takeover close is a 51.2px white raised control with the
                overlay shadow and <code>--radius-full</code>; it enters only after the About sheet passes 70% of
                its viewport crossing.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Surfaces in place</p>
              <div className="ds-grid ds-grid-wide">
                <div
                  className="ds-specimen ds-specimen-white ds-specimen-block"
                  style={{ boxShadow: "0 0 0 1px rgb(0 0 0 / 0.06), var(--shadow-overlay)" }}
                  data-ds-terms={terms("raised #ffffff hover card popover dialog border #e6e6e8 zero-blur")}
                >
                  <strong className="ds-specimen-title">Raised — #ffffff</strong>
                  <p className="ds-specimen-note">
                    Hover cards, popovers, dialogs. Always white, always shadowed. The edge is normally a zero-blur{" "}
                    <code>0 0 0 1px</code> layer inside the shadow rather than a real border — the X card, which uses{" "}
                    <code>1px solid #e6e6e8</code> as well, is the exception.
                  </p>
                </div>
                <div
                  className="ds-specimen ds-specimen-block"
                  data-ds-terms={terms("tile #ececee work card 24px radius rgb(0 0 0 / 0.08)")}
                >
                  <strong className="ds-specimen-title">Tile — #ececee</strong>
                  <p className="ds-specimen-note">
                    Work cards only. They use a 24px radius, <code>1px solid rgb(0 0 0 / 0.08)</code>, and no shadow —
                    they sit in the page rather than above it. About uses the full-bleed white canvas surface.
                  </p>
                </div>
                <div
                  className="ds-specimen ds-specimen-block"
                  style={{ background: "#f2f2f2" }}
                  data-ds-terms={terms("chip #f2f2f2 smallest surface filled label borderless")}
                >
                  <strong className="ds-specimen-title">Chip — #f2f2f2</strong>
                  <p className="ds-specimen-note">
                    The smallest surface. Borderless and shadowless — it reads as a filled label, not a container.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------- motion -- */}
          <section id="motion" className="ds-section">
            <div className="ds-section-heading">
              <h2>Motion</h2>
              <p>
                Three tokened curves plus the deliberate component outliers, and four duration tokens with their
                one-off bands. Hover a card to replay its easing.
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
              <div className="ds-rule" data-ds-terms={terms("exit entrance 220ms 160ms opacity transform dropped frame")}>
                <strong>Exits are shorter than entrances, and both are honest about it.</strong>
                <p>
                  A hover card enters over 220ms on the smooth curve and leaves over 160ms on the exit curve. Opacity and
                  transform share a duration within each direction — if they differ, the card finishes fading while it is
                  still moving and reads as a dropped frame. Where an element unmounts on transition end, the exit has to
                  outlast the fade, not merely match it.
                </p>
              </div>

              <div
                className="ds-rule"
                data-ds-terms={terms("reduced motion animation-delay animation-duration both staggered override")}
              >
                <strong>The reduced-motion reset is not sufficient on its own.</strong>
                <p>
                  The global rule zeroes <code>animation-duration</code> but not <code>animation-delay</code>, so a
                  delayed <code>both</code>-filled entrance still holds its invisible from-state for the whole delay. Any
                  staggered entrance needs its own <code>animation: none</code> override at matching specificity. Any
                  transform-based hover needs one too.
                </p>
              </div>

              <div
                className="ds-rule ds-rule-warn"
                data-ds-terms={terms("first load cascade lcp --work-intro-base 520ms 1240ms row-step col-step")}
              >
                <strong>The first-load cascade is load-bearing, and it costs LCP.</strong>
                <p>
                  The hero staggers six children at 40ms intervals, then the mosaic starts at{" "}
                  <code>--work-intro-base: 520ms</code> so the cards answer the hero instead of arriving with it. Fading
                  the top row costs a fixed +1240ms of measured LCP — Chrome defers an opacity-animated element's recorded
                  paint regardless of how brief the fade is. It has been measured three ways; shortening the fade does not
                  buy it back. Keep <code>--work-intro-row-step</code> at or above twice{" "}
                  <code>--work-intro-col-step</code>, or on mobile a card arrives before the one above it.
                </p>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------- layout -- */}
          <section id="layout" className="ds-section">
            <div className="ds-section-heading">
              <h2>Layout</h2>
              <p>One shell, one mosaic, and a stacking order that the Tailwind scale only half describes.</p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Shell</p>
              <ul className="ds-list">
                <li data-ds-terms={terms("max width 1560px gutter 8px clamp(1rem, 5vw, 1.5rem) 700px 900px full-bleed")}>
                  <strong>Max width 1560px</strong>, with an 8px gutter below 700px and a{" "}
                  <code>clamp(1rem, 5vw, 1.5rem)</code> gutter from 700px to 899px — dropped entirely at 900px so the
                  mosaic can run full-bleed.
                </li>
                <li data-ds-terms={terms("mosaic row flex 1rem gap --row-height --row-span 320px 420px clamp(340px, 92vw, 380px)")}>
                  <strong>Mosaic rows</strong> are flex, <code>1rem</code> gap, with height driven by{" "}
                  <code>--row-height</code>: <code>clamp(340px, 92vw, 380px)</code> stacked on mobile, 320px base, and
                  420px from 900px up. Items flex by an inline <code>--row-span</code>.
                </li>
                <li data-ds-terms={terms("row height 420px assertion playwright portfolio-polish scale opacity translate")}>
                  <strong>Row height is asserted at exactly 420px</strong> in{" "}
                  <code>tests/e2e/portfolio-polish.spec.ts</code>. Entrance animations use opacity and translate only —
                  a scale would change the measured box and fail that test.
                </li>
                <li data-ds-terms={terms("about takeover sticky stage runway clamp(12rem, 30vh, 18rem) 100dvh z-index 1 display contents")}>
                  <strong>The About takeover is one viewport of scrolling.</strong> From 700px up, all four project rows
                  remain in one sticky stage at their original sizes and 1rem gaps, followed by a responsive white
                  runway of <code>clamp(12rem, 30vh, 18rem)</code>.
                  The runway is the gallery's natural height plus <code>100dvh</code>; the gallery pins when its bottom reaches the viewport, then the
                  full-bleed white About sheet crosses it at z-index 1 with the same layered shadow as the hover cards.
                  A top-only layer pairs that shadow with a <code>rgb(0 0 0 / 0.08)</code> hairline while the white sheet
                  remains continuous through the page end. The gallery retreats as one surface, and About
                  continues in normal flow after the cover. Below 700px both wrappers collapse with{" "}
                  <code>display: contents</code>; the white sheet stays full-bleed but no pinning or overlap is applied.
                </li>
                <li data-ds-terms={terms("seam hairline shadow ambient cast 120px 0.35 chevron 17px 22deg scroll cue 100dvw")}>
                  <strong>The seam is three layers, and two of them move.</strong> The overlay shadow only spills
                  about 20px past the hairline, so a 120px gradient cast sits above it and carries the penumbra —
                  ramping from 0.35 opacity to full across the crossing, so the sheet reads as passing in front of the
                  gallery rather than butting against it. Above that, a scroll cue: two 17px bars hinged at the joint
                  they share, opening to a 22° chevron and squeezing flat as the sheet climbs. Rotations rather than a
                  scaled chevron, so the stroke keeps its weight all the way down to the line. Every layer is anchored
                  to the runway, never to the sheet, and animates only opacity and transform — and because the runway
                  stops at the 1560px reading measure, the cast and the hairline break back out to <code>100dvw</code>{" "}
                  so the seam ends where the full-bleed sheet does. Without scroll-driven animations, or under reduced
                  motion, the cue rests as a static chevron and the cast sits at full depth.
                </li>
                <li data-ds-terms={terms("mix-blend-mode difference chevron 0.32 opacity blend box 40px --canvas stacking context")}>
                  <strong>The cue is the one mark on this site with no fixed ink.</strong> The seam climbs the whole
                  project grid, so the chevron crosses card art of every value. It is white on{" "}
                  <code>mix-blend-mode: difference</code>, which subtracts the backdrop from itself — dark over the pale
                  cards, light over the dark ones — and its <code>0.32</code> opacity is the contrast dial rather than a
                  fade, interpolating back toward the backdrop to hold roughly even weight across all of them. Full
                  strength would put a black chevron on the white runway. Two things this depends on: the blend box is
                  kept to the chevron&rsquo;s own 40px rather than the full seam, because that box is the group Chrome
                  composites to blend it; and the runway paints <code>--canvas</code> itself. App&rsquo;s wrapper
                  already paints that white, but <code>main</code> is a stacking context at z-index 10 and the
                  wrapper sits outside it, so without a backdrop of its own the chevron inverts transparency to plain
                  white and disappears over the runway.
                </li>
                <li data-ds-terms={terms("cue shortcut 44px scrollintoview continue to about focus ring")}>
                  <strong>The cue is also the shortcut.</strong> It is a 44px button that runs the same{" "}
                  <code>scrollIntoView</code> as the avatar, landing the sheet at the top of the viewport and moving
                  focus into it — a tap finishes a crossing the reader has already committed to. It is named
                  &ldquo;Continue to About&rdquo; rather than reusing the avatar&rsquo;s &ldquo;Read about Rafael
                  Medina&rdquo;, so the two paths to the same place stay distinguishable in a list of controls. The
                  button owns the target and the focus ring; the chevron inside owns the blend, because a ring drawn on
                  the blended element would invert along with the stroke.
                </li>
                <li data-ds-terms={terms("takeover close 51.2px 70% exit focus return reduced motion 700px")}>
                  <strong>The takeover gains an exit after 70%.</strong> A 51.2px close control enters at the top-right
                  once the About sheet has crossed 70% of the viewport, stays fixed throughout the reading surface,
                  and disappears when the sheet retreats below that boundary. It returns focus to the page title and
                  scroll position to the top, holding preview playback until the return settles so video compositing
                  cannot steal its final frames; under reduced motion the return is immediate. Below 700px it is not
                  exposed as an interactive control because the takeover itself is disabled.
                </li>
                <li data-ds-terms={terms("about reading surface 36rem work history education stickers clamp(5rem, 10vw, 8.75rem) #about-panel-resume")}>
                  <strong>About is one continuous reading surface.</strong> The introduction, Work history, and Education
                  share one left-aligned 36rem reading axis in normal document flow. The introduction starts with a
                  fluid <code>clamp(5rem, 10vw, 8.75rem)</code> (80–140px) inset from the sheet&rsquo;s top: 5rem on
                  mobile, growing to 8.75rem on wide desktops. Work history sits 5rem below About on mobile and
                  8.75rem below it on desktop, without a hairline. Eight stickers are split evenly between About and
                  Work history and span the outer 8% of the desktop side gutters, so the decoration follows the full
                  reading surface without crowding the copy. They stay fixed while the pointer and page move, but can
                  still be repositioned directly with pointer dragging or the keyboard. Each role shows one representative result, aligns its
                  dates opposite the company on wider screens, then ends with a PDF download 5rem (80px) after Education.
                  Company names are keyboard-focusable external links without hover or focus tooltips. There is no tab state or
                  hidden panel; <code>#about-panel-resume</code> anchors directly to the visible Work history section.
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
                Max-width breakpoints stop at <code>.98px</code> so they cannot overlap the min-width rule above them.
                Hover-dependent components additionally gate on <code>(hover: none)</code> and{" "}
                <code>(pointer: coarse)</code> rather than on width — the LinkedIn and X cards are removed outright on
                touch instead of being made tappable.
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
                      <tr key={entry.z} data-ds-terms={terms(entry.z, entry.name, entry.note, "z-index stacking layer")}>
                        <td>{entry.z}</td>
                        <td>{entry.name}</td>
                        <td>{entry.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="ds-rule"
                data-ds-terms={terms("tailwind z-scale base dock chrome overlay modal toast stacking context")}
              >
                <strong>The Tailwind z-scale covers the bottom half only.</strong>
                <p>
                  <code>tailwind.config.js</code> names base/dock/chrome/overlay/modal/toast at 0–50, but the CSS above
                  30 uses raw numbers that do not line up with those names. Before adding a layer, read the table above
                  rather than the config — and prefer raising a stacking context to inventing a higher number.
                </p>
              </div>
            </div>
          </section>

          {/* ---------------------------------------------- accessibility -- */}
          <section id="accessibility" className="ds-section">
            <div className="ds-section-heading">
              <h2>Accessibility</h2>
              <p>The floors this codebase already holds. These are not aspirations; breaking one is a regression.</p>
            </div>
            <ul className="ds-list">
              <li data-ds-terms={terms("focus ring 2px solid var(--focus-ring) #2d2d2d offset :where() 1.4.11 3:1")}>
                <strong>Focus is always visible and always the same.</strong>{" "}
                <code>2px solid var(--focus-ring)</code> at <code>2–3px</code> offset, applied by a{" "}
                <code>:where()</code> base rule to every interactive element. <code>#2d2d2d</code> was chosen over a
                grey because 1.4.11 wants 3:1 against the adjacent surface, which the greys cannot reach on near-white.
              </li>
              <li data-ds-terms={terms("target 24px 44px tap nav link map attribution chevron 34px ::before")}>
                <strong>Targets meet 24px; primary touch controls reach 44px.</strong> Where the visible control is
                smaller — the 2rem nav links, the map attribution, the takeover cue's 34px chevron — an invisible{" "}
                <code>::before</code> or extra padding makes up the difference rather than the label growing.
              </li>
              <li data-ds-terms={terms("hover none display none touch project card image only assistive")}>
                <strong>Hover-only content has a non-hover fate.</strong> Every hover card is{" "}
                <code>display: none</code> under <code>(hover: none)</code>; project cards stay image-only on touch while
                their button labels continue to expose each project title to assistive technology.
              </li>
              <li data-ds-terms={terms("aria-live polite copy email announcement asynchronous")}>
                <strong>Asynchronous results are announced.</strong> Copying the email writes to an{" "}
                <code>aria-live="polite"</code> region, because the visual confirmation is a label swap and an image.
              </li>
              <li data-ds-terms={terms("skip link z-index 120 scroll-margin-top 5rem first focusable")}>
                <strong>The skip link is real.</strong> It is the first focusable element, sits at z-index 120, and every
                page target carries <code>scroll-margin-top: 5rem</code> so an anchored heading is not hidden under the
                corner nav.
              </li>
              <li data-ds-terms={terms("decorative alt empty aria-label icon pill screen reader")}>
                <strong>Decorative imagery is empty-alt.</strong> Icons inside labelled pills use <code>alt=""</code> and
                the accessible name comes from the surrounding <code>aria-label</code>, so a screen reader hears
                "Message on LinkedIn" once rather than twice.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
