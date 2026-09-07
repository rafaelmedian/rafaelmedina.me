import { useCallback, useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { Check, Copy, Search, X } from "lucide-react"

import { linkedinHoverMedia, xProfilePreview, type SiteLinks } from "../data/portfolio"
import { ContactActionRow } from "./ContactActionRow"
import { WorkedWithCompaniesInline } from "./WorkedWithCompaniesInline"
import { PersonalPhotos } from "./PersonalPhotos"
import { WritingsFolder } from "./WritingsFolder"
import { QuoteCard } from "./QuoteCard"
import { portfolioQuotes } from "../data/quotes"
import { sampleQuotes } from "../data/quoteExamples"
import { formatAvailability } from "../lib/availability"

import { useDesignTokens } from "./useDesignTokens"

import "./design-system.css"

/*
 * The reference for what this site already is.
 *
 * Everything below reflects src/styles/, tailwind.config.js, and the
 * components — it documents the system that shipped rather than one somebody
 * would like to have. Three consequences worth knowing before editing:
 *
 * 1. Shared token values are read from computed root styles, including after
 *    CSS hot updates. Live specimens import the real components. Descriptions
 *    and component-specific exceptions remain editorial: update those when
 *    their behavior changes.
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
    note: "App's wrapper paints this across the viewport, so white is both the page and the colour of the full-bleed About sheet and anything floating above it — hover cards, popovers, the dialog, logo chips. Every ratio on this page is measured against it.",
  },
  {
    token: "--body-bg",
    name: "Beneath",
    note: "Set on <body>, then covered by the wrapper's --canvas. Visible only in overscroll. The contrast comments in styles/base.css cite it; the difference is under 0.1:1, but measure against white.",
  },
  {
    token: "--mosaic-card-surface",
    name: "Tile",
    note: "Work tiles. The one surface that is meaningfully darker than the page.",
  },
  {
    hex: "#f2f2f2",
    token: "—",
    name: "Chip rest",
    note: "The person chip's hover and the popover's inline link. All work-history chips are white with a hairline.",
  },
  {
    hex: "#e9e9e9",
    token: "—",
    name: "Chip active",
    note: "The hover, focus, and pressed state for anything sitting on chip rest.",
  },
]

const INK_ENTRIES = [
  { token: "--body-color", use: "Body default and headings" },
  { token: "--ink", use: "App wrapper text colour" },
  { hex: "#171717", token: "—", use: "Text inside white cards and the preview dialog" },
  { token: "--focus-ring", use: "Primary UI labels, hover states, and every focus ring" },
  { hex: "#363636", token: "—", use: "Inline links on hover" },
  { hex: "#4a4a4a", token: "—", use: "Inline links at rest" },
  { hex: "#545454", token: "—", use: "About-panel prose and article prose" },
  { token: "--muted", use: "Secondary copy: subtitles, captions, dialog descriptions, work-history chip labels at rest" },
  { hex: "#747474", token: "—", use: "Corner nav links and the local-time label" },
  { token: "--muted-soft", use: "Tertiary labels: definition terms and hobby notes" },
]

const NON_TEXT_ENTRIES = [
  { hex: "#b5b5b5", kind: "non-text", name: "Separator", note: "The middot between a company and its role." },
  {
    hex: "#c8c8c8",
    kind: "non-text",
    name: "Underline",
    note: "Resting link underlines; darkens to #9b9b9b on hover.",
  },
  {
    token: "--accent",
    kind: "non-text",
    name: "Available",
    note: "--accent, on the availability dot and visible at rest. A graphic only; the availability label uses --muted gray text.",
  },
  {
    hex: "#e5352b",
    kind: "text",
    name: "Hint",
    note: "The Handlee avatar hint. Display-sized text and non-text icons use a 3:1 floor.",
  },
] satisfies ReadonlyArray<{ hex?: string; token?: string; kind: ContrastKind; name: string; note: string }>

const BRAND = [
  { hex: "#0a66c2", name: "LinkedIn", note: "Pill label. Vendor blue — do not re-tint to match the greys." },
  { hex: "#0f1419", name: "X ink", note: "Follow button fill and the card's name and bio." },
  { hex: "#1d9bf0", name: "X mention", note: "The @mention link inside the X hover card only." },
  { hex: "#536471", name: "X muted", note: "Handle and stat labels inside the X hover card only." },
]

/* -------------------------------------------------------------- typography */

const TYPE_SCALE_ENTRIES = [
  {
    token: "--text-xs",
    sample: "Punta Cana · Local time",
    where: "Map attribution, count pills, avatar initials, compact project captions, mobile table-of-contents numbers",
    style: { fontSize: "var(--text-xs)", lineHeight: 1.25 },
  },
  {
    token: "--text-sm",
    sample: "I'm a designer who ships products.",
    where: "The whole hero — name, subtitle, work history, location, contact pills — and the corner nav above it. Also body copy, detail rows, hover-card text, mobile table-of-contents labels, wider project captions",
    style: { fontSize: "var(--text-sm)", lineHeight: "1.25rem", letterSpacing: "-0.00563rem" },
  },
  {
    token: "--text-md",
    sample: "Senior Product Designer",
    where: "About prose, longer quotes, labels, section headings, card titles, and metadata",
    style: { fontSize: "var(--text-md)", lineHeight: 1.5, letterSpacing: "-0.005rem", fontWeight: 600 },
  },
  {
    token: "--text-lg",
    sample: "Ten years prototyping in code.",
    where: "About ledes, short quotes, standalone-page headings, writing entry titles, and article prose at every viewport. Editorial writing headings have a scoped 24–40px exception.",
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

const RADII_ENTRIES = [
  {
    value: "--radius-sm",
    use: "Chips, nav hover targets, popover links, focus rings",
    css: "--radius-sm",
  },
  {
    value: "--radius-md",
    use: "Hover cards, popovers, the local-time card, the social-time pill",
    css: "--radius-md",
  },
  {
    value: "--radius-lg",
    use: "Work tiles, quote cards, dialog media and bottom corners",
    css: "--radius-lg",
  },
  { value: "--radius-full", use: "Pills, dots, avatars, nav buttons, the skip link", css: "--radius-full" },
]

const SPACE = [
  { value: "0.25rem", use: "Icon-to-label, chip rows" },
  { value: "0.375rem", use: "Inside pills and stat groups" },
  { value: "0.5rem", use: "Hobby lists, X card internals" },
  { value: "0.625rem", use: "The contact action row" },
  { value: "0.75rem", use: "Work-history description offset and compact floating offsets" },
  { value: "1.25rem", use: "Maximum mobile contact-pill side padding" },
  { value: "1.5rem", use: "Takeover close offset from the right viewport edge" },
  { value: "2.5rem", use: "Takeover close offset from the top viewport edge and mobile whitespace before Work history" },
  { value: "5rem", use: "Minimum About inset, desktop whitespace before Work history, and rendered spacing before the CV download" },
  { value: "6rem", use: "Vertical clearance around the personal-photo carousel shadows" },
  { value: "8.75rem", use: "Maximum About inset" },
  { value: "8px", use: "Mobile page gutter and row-video side inset below 700px" },
  { value: "1rem", use: "Mosaic row and column gap — the layout unit" },
  { value: "clamp(16px, 3vw, 32px)", use: "Page gutter from 700px to 899px" },
  { value: "clamp(1.25rem, 4vw, 5rem)", use: "Personal-photo carousel side gutters" },
  { value: "clamp(12rem, 30vh, 18rem)", use: "Desktop white runway before the About takeover" },
]

/* --------------------------------------------------------------- elevation */

const ELEVATION = [
  {
    name: "Hairline",
    shadow: "inset 0 0 0 1px rgb(0 0 0 / 0.05)",
    use: "Logo chips at 0.05, dialog media frames at 0.06, quote portraits at 0.12. Reads as an edge, not a lift. Images get theirs as a -1px outline, since an inset shadow paints under replaced content.",
  },
  {
    name: "Resting control",
    shadow: "0 1px 5px rgb(46 42 42 / 0.08)",
    use: "Contact pills and the mobile reveal button. Controls go to 0 4px 12px on hover, back to 0 1px 4px when pressed.",
  },
  {
    name: "Overlay — --shadow-overlay",
    shadow: "var(--shadow-overlay)",
    use: "The floating-surface tier: LinkedIn and X cards, the work-history popover, the local-time card, the takeover close, personal-photo prints, the mobile table of contents, and the top edge of the About takeover. Surfaces without a border prepend a zero-blur 0 0 0 1px hairline ring before the var().",
  },
  {
    name: "Dialog",
    shadow: "0 1px 1px rgb(0 0 0 / 0.04), 0 18px 44px -18px rgb(0 0 0 / 0.28), 0 48px 92px -42px rgb(0 0 0 / 0.38)",
    use: "The preview gallery card. Three layers, negative spread. Personal photos use the existing 46% dark scrim without blur; their prints use --shadow-overlay and a 6% hairline.",
  },
]

/* ------------------------------------------------------------------ motion */

const EASINGS_ENTRIES = [
  {
    name: "Aurora",
    css: "ease-in-out",
    duration: "1260ms",
    use: "The page-end aurora fades symmetrically, keeping its colors visible through the middle of the release. Pull input and the staggered curtains use --ease-smooth.",
  },
  {
    name: "Standard — --ease-standard",
    css: "--ease-standard",
    duration: "160–300ms",
    use: "The house curve, and the default for a bare timing function. Chips, icons, card-title reveals, and every hover that changes colour, shadow, or underline — anything changing state in place.",
  },
  {
    name: "Smooth — --ease-smooth",
    css: "--ease-smooth",
    duration: "160–700ms",
    use: "Fast out of the gate, long settle. Overlays arriving, the intro cascades, the avatar coin flip, the live-time roll. Used to be three near-identical expo-outs; they are one token now.",
  },
  {
    name: "Exit — --ease-exit",
    css: "--ease-exit",
    duration: "120–160ms",
    use: "Hover cards, the local-time card, the takeover close, the preview gallery leaving, and the work-history popover (aliased as --mosaic-popover-exit-ease). Always shorter than the entrance it reverses.",
  },
  {
    name: "Responsive resize",
    css: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    duration: "160ms",
    use: "The hero's min-height and padding as the viewport crosses layout states. Inline, not a token — two uses.",
  },
  {
    name: "Gallery open",
    css: "cubic-bezier(0.32, 0.8, 0.32, 1)",
    duration: "200ms",
    use: "The preview gallery's origin-aware, whole-surface expansion and its fallback lift.",
  },
  {
    name: "Photo carousel — --photo-motion-ease",
    css: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    duration: "200–360ms",
    use: "Apple Core Animation’s documented default timing curve, scoped to the personal-photo hover fan, hint, flights, captions, and backdrop. Movement builds before easing into place; opening and closing share a quick 200ms beat and captions move with the prints without delay.",
  },
  {
    name: "Overshoot",
    css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    duration: "220ms",
    use: "The copy-email reaction (220ms, and the only 220ms left in the file). The only curve in the system that overshoots — the reaction needs a shape to travel past its mark and settle, so keep new work off it unless it does too.",
  },
  {
    name: "Scroll linked",
    css: "linear",
    duration: "1 viewport of scroll",
    use: "One View Timeline drives the whole About takeover: the pinned gallery scales, fades and racks out of focus to blur(8px), the seam's ambient cast deepens from 0.35 to full, and the scroll cue squeezes from a 22° chevron to a flat line before it fades.",
  },
]

const DURATIONS_ENTRIES = [
  { value: "--duration-fast", use: "Taps, small fades, popover-content swaps, and the shortest exit feedback." },
  { value: "--duration-quick", use: "Colour, opacity, and shadow on hover or focus, and every overlay exit. The default for a state change. Absorbed the old 140/150/180ms one-offs." },
  { value: "--duration-base", use: "Larger surface moves and overlay entrances: the gallery open, the hover card, the local-time card, the takeover close. Absorbed the old 220ms entrances." },
  { value: "240ms", use: "The work-history popover settle, scoped as --mosaic-popover-enter-duration, and the live-time label roll." },
  { value: "120–260ms", use: "The preview gallery's own scale, handed to CSS as --pg-* custom properties so the JS and CSS halves cannot drift: 200/150ms shell, 180/150ms backdrop, 140/120ms content, 190ms switch, 260ms close reset." },
  { value: "--duration-slow", use: "Feed and preview media resolving from --blur-reveal as they decode, and the personal-photo stack fanning on hover or focus." },
  { value: "200ms", use: "Personal-photo carousel: --photo-open-duration and --photo-close-duration both alias --duration-base. Flights, captions, and backdrop share the timing in each direction, with no delay. Reduced motion removes the transitions and flights." },
  { value: "380–480ms", use: "Entrance travel: hero then mosaic on first load, and each About copy block as it first scrolls in." },
  { value: "700ms", use: "The page-end content nudge settling and the avatar coin flip." },
  { value: "40ms / 700ms / 1260ms", use: "The page-end curtains stagger by 40ms (240ms total), rise over 700ms, and share the 1260ms glow release." },
]

/* ------------------------------------------------------------------ layout */

const BREAKPOINTS = [
  { at: "≤ 327.98px", change: "Contact pills use 0.625rem side padding; the wrapped X card centers on its trigger; location and availability stack without a separator." },
  { at: "≤ 479.98px", change: "Contact pills gain up to 1.25rem side padding and wrap when their container cannot accommodate them." },
  { at: "≤ 639.98px", change: "The hero uses 2rem of top padding plus the top safe area." },
  { at: "≤ 699.98px", change: "Local time and corner navigation hide; a centered floating control labeled with the current section opens a table of contents with 14px labels; the shell uses 8px gutters; every project shows in one 340–380px column; featured media crops to fill its card; the full-bleed About sheet returns to normal document flow; card captions stay visible over a static gradient without the desktop blur ramp." },
  { at: "480–699.98px + fine hover", change: "Contact pills stay 34px tall." },
  { at: "≥ 760px", change: "This page's own two-column grids. Not a portfolio breakpoint." },
  { at: "≥ 900px", change: "Mosaic rows go to 420px and the shell drops its inline padding." },
  {
    at: "≥ 1320px",
    change: "Project previews open in the 981px wide view with a 5vh top inset.",
  },
]

const STACKING_ENTRIES = [
  {
    z: "0 / --z-dock / --z-chrome",
    name: "--z-dock / --z-chrome",
    note: "The page and main content wrapper (Tailwind's z-dock maps onto the token). The bottom scroll edge sits inside main at --z-chrome, below the table of contents at --z-social.",
  },
  { z: "1", name: "About sheet", note: "The full-viewport white surface paints above the pinned project gallery during takeover. Its seam layers — hairline, shadow, and ambient cast — share the level from the runway side." },
  { z: "auto", name: "Takeover cue", note: "The one control that deliberately declines a level. It is a positioned sibling following the stage in document order, so it already paints above it — and a z-index here would make it a stacking context and isolate the chevron's blend." },
  {
    z: "--z-corner",
    name: "--z-corner",
    note: "The About takeover close.",
  },
  {
    z: "--z-social / --z-social",
    name: "Section / social corners — --z-social",
    note: "Both navigation corners and the mobile table-of-contents trigger sit at --z-social so they clear other overlays.",
  },
  {
    z: "--z-overlay",
    name: "--z-overlay",
    note: "Hover cards, the local-time card, and the work-history block. The popover inside that block stacks locally (z 4 within its isolated container), so only the container carries the tier.",
  },
  { z: "--z-dialog-backdrop / --z-dialog", name: "--z-dialog-backdrop / --z-dialog", note: "The preview gallery and personal-photo backdrops, then their dialog shells." },
  { z: "--z-reaction", name: "--z-reaction", note: "The copy-email reaction has to clear the dialog trigger it sits under." },
  { z: "--z-skip-link", name: "--z-skip-link", note: "Above everything, always." },
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
              Not a proposal — an inventory. Every value here was read back out of the shipped stylesheet and
              components, so it describes what this site already does. Treat it as the constraint: reach for something
              on this page before inventing a new one. Token values update automatically; keep component descriptions
              and exceptions in step when their behavior changes.
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
                data-ds-terms={terms("muted muted-soft ramp tile #ececee mosaic-card-surface aa 4.61 5.33 3.91 4.52")}
              >
                <strong>The ramp is calibrated for the page, not for the tile.</strong>
                <p>
                  On white both muted steps clear AA — <code>--muted</code> at {ratioText(muted, PAGE_BG)} and{" "}
                  <code>--muted-soft</code> at {ratioText(mutedSoft, PAGE_BG)}. On{" "}
                  <code>--mosaic-card-surface</code> ({tile}) they measure {ratioText(muted, tile)} and{" "}
                  {ratioText(mutedSoft, tile)}, so{" "}
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
                data-ds-terms={terms("elastic page edge overscroll aurora curtains random palette 56px 8px nudge 40ms stagger 700ms 1260ms DialKit")}
              >
                <strong>A soft aurora at the page edge.</strong>
                <p>
                  The glow stays within the original 56px page-edge band. Seven overlapping curtains fade upward
                  by 8px over 700ms using --ease-smooth, staggered by 40ms (240ms total). Their heights vary between
                  76% and 100% of the band, with feathered vertical streaks and soft curved tops. Only transform and
                  opacity animate, without filters or continuous loops. Each new glow chooses a random hue across
                  the full 360-degree spectrum, with seven neighboring offsets from -54 to +54 degrees in 18-degree
                  steps, saturation of 60–76%, and lightness of 74–84%. Repeated input during a glow keeps its palette
                  and continues the existing rise. The wash follows input over 120ms, fades over 1260ms with
                  ease-in-out, then resets the curtains. The content nudge stays capped at 8px and settles over 700ms.
                  Colors remain behind the table of contents. Nested scrollers retain their behavior, and reduced
                  motion disables the entire effect. Dev-only DialKit controls at <a href="/?tune=edge">/?tune=edge</a>
                  adjust height, rise, stagger, rise duration, fade duration, and intensity, with replay and new-color
                  actions. Those controls and their styles are excluded from production.
                </p>
                <p>
                  The DialKit lab offers four studies: Soft Curve uses a broad concave fade; Feathered Curtains
                  separates the vertical wisps; Overlapping Arcs blends shallow bands; Rolling Glow uses wider,
                  asymmetric hills. All retain the same random palette when switching and replay automatically.
                  The tuner defaults to Soft Curve, 65px height, 10px rise, 40ms stagger, 710ms rise duration,
                  1148ms fade duration, and 0.91 intensity.
                  A static 128px grayscale grain tile blends into each colored section with soft-light at 41%
                  opacity by default, adjustable from 0–60%. Feathered masks keep it away from the white page
                  and the table of contents. The softer curve takes inspiration from{' '}
                  <a href="https://21st.dev/@ibelick/components/light-theme-tailwind-css-background-snippet" target="_blank" rel="noreferrer">Light Theme Background</a>;
                  only the grain texture is inspired by{' '}
                  <a href="https://21st.dev/@dhileepkumargm/components/aurora-shader" target="_blank" rel="noreferrer">Aurora Shader</a>.
                  The studies and grain asset load only with the dev tuner; the standard effect stays available
                  while the four options are compared.
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
                hobby emoji are deliberate display exceptions.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Families</p>
              <div className="ds-grid ds-grid-wide">
                <SpecCard
                  terms={terms("ui system stack font-ui font-body apple sf pro inter webfont")}
                  name="UI — --font-ui"
                  copy={readToken("--font-ui")}
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
              <div className="ds-rule" data-ds-terms={terms("four steps scale 0.82rem 0.8125rem 0.9rem 0.875rem noise")}>
                <strong>Four steps, and the element bends before the scale does.</strong>
                <p>
                  This ramp used to carry twelve distinct sizes, half of them a fraction of a pixel from a neighbour —{" "}
                  <code>0.82rem</code> beside <code>0.8125rem</code>, <code>0.9rem</code> beside <code>0.875rem</code>.
                  That is noise, not a scale. Use a token; if a new element will not fit one of the four, change the
                  element. Long-form writing headings are the documented exception: 24–40px editorial titles,
                  scoped to the writings archive and reader rather than added to the UI scale.
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
                  <code>1.7</code> for prose. Writing titles use <code>-0.025em</code> tracking;
                  section headings and archive titles use <code>-0.015rem</code>. The writings dialog explicitly enables font kerning.
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
                data-ds-terms={terms("concentric nested radius calc 11px 11.5px 10px --radius-md --radius-lg mat media inset half card padding previous next rail flank 44px 16px artwork middle 42vh 72vh 345px 684px 50%")}
              >
                <strong>Nested corners are concentric, and they are derived — not a fifth step.</strong>
                <p>
                  When one rounded box sits inside another, the outer radius is the inner radius plus the gap between
                  them. Those cases are written as <code>calc()</code> off one of the four tokens rather than measured
                  and hard-coded: the LinkedIn card's media is <code>calc(var(--radius-md) - 5px)</code>, the preview dialog is{" "}
                  <code>calc(var(--radius-lg) + card-padding)</code> on desktop. That is how 11px, 11.5px, and 10px corners exist
                  without being scale steps — and why they stay correct when a padding changes.
                  The artwork sits in a mat of <code>card-padding / 2</code> on all four sides, so the frame's grey and
                  hairline surround the image instead of meeting it, and the image carries the third radius in the
                  nest: <code>calc(var(--radius-lg) - mat)</code>.
                  On desktop the 44px previous and next controls flank the card, one <code>16px</code> clear of each
                  edge and level with the middle of the artwork — the card runs on into the title and details below the
                  image, so its own centre would sit in the text. That offset is the card padding and the mat plus half
                  the artwork the popup width gives the common preview ratio, under the same cap the media carries
                  (<code>min(345px, 42vh)</code>, and <code>min(684px, 72vh)</code> in the wide view). It is fixed per
                  layout rather than measured per preview, so a taller or shorter image never slides the pair out from
                  under the pointer, and it stops at half the popup so a card taller than the viewport still keeps
                  paging reachable without scrolling back up. The
                  shell adds that clearance to its own gutter wherever the pair is shown, since it hides horizontal
                  overflow and a clipped control has no way back.
                  On mobile and touch screens the preview fills the viewport with square outer corners and safe-area
                  insets; its counter and 44px previous, next, and close controls stay pinned above the media on a white
                  header at z-index 1.
                  Below the artwork, the project title and a single description cover the product, contribution,
                  and result. Left-aligned collaborator avatar links follow the description without a visible label,
                  starting with mine on every project so a solo shot is credited rather than unattributed.
                  The description uses <code>--text-md</code>, a 1.6 line height, the existing prose colour
                  <code>#545454</code>, and a 46rem maximum measure. Credits use <code>--text-sm</code>
                  with 1.5rem of space above them. The text column matches the notes reader: a centered 48rem
                  maximum width with 1.5rem of padding on all four sides, and 1.25rem side padding below 700px.
                  The dialog has no project-site link, metadata table, or row dividers.
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
                data-ds-terms={terms("--card-caption-blur 2.5rem scrim backdrop ramp mask 12% 30% 40% 62% 100% 0.62 0.57 360ms eased compact desktop mobile pill rgb(20 20 20 / 0.82) --radius-full --text-xs 0.75rem 0.28rem 0.6rem")}
              >
                <strong>
                  <code>--card-caption-blur: 2.5rem</code> is the work tile's caption backdrop, and it is a ramp.
                </strong>
                <p>
                  Four masked layers on <code>.mosaic-row-card-scrim</code> step the radius through 12%, 30%, 62%, and
                  100% of that value, so the artwork softens toward the bottom edge instead of stopping at a seam. A
                  single masked blur layer is not the same effect — a mask fades the opacity of a uniformly blurred
                  layer, which leaves the top of the band a half-strength blend of sharp and blurred. A{" "}
                  <code>rgb(0 0 0 / 0.62)</code> ramp sits above all four: blur cannot promise contrast on its own,
                  because a blurred white screenshot is still white. On wide layouts it is nearly flat across the
                  bottom seventh of the band, where the caption sits. From 700px through 899px, the shorter band holds
                  57% black through 40% of its height so a wrapped two-line label also clears 4.5:1 over white artwork.
                  Contrast is only owed at the label, so the rest of each band sheds its weight quickly and reads far
                  lighter than a ramp that starts at the same value. Every ramp here — the
                  four masks and the tint — fades on an eased stop list rather than a straight line, and trails off
                  across the whole band instead of ending partway up: a linear ramp changes slope where it reaches
                  zero, and the eye reads that break as an edge. The two fade on separate clocks — the tint at the 160ms hover default alongside
                  the caption, the ramp at the 360ms un-blurring step — because fading them together held the caption
                  illegible until four backdrop rasters were ready, and the whole effect read as a stall. It paints only
                  on hover and focus, one tile at a time. Below 700px and on touch screens, the entire scrim is hidden.
                  The permanent caption is a compact pill with a <code>rgb(20 20 20 / 0.82)</code> background,
                  <code> --radius-full</code> corners, and <code>--text-xs</code> type. It sits 0.75rem from the
                  bottom with 0.28rem by 0.6rem padding, carrying its own contrast without a blur or tint band.
                </p>
              </div>
            </div>
          </section>

          {/* ------------------------------------------------- components -- */}
          <section id="components" className="ds-section">
            <div className="ds-block" data-ds-terms={terms("writings folder notes modal years breadcrumbs reader images 200ms 160ms 360ms --mosaic-card-surface --radius-lg --shadow-overlay")}>
              <p className="ds-subhead">Writings folder</p>
              <div style={{ maxWidth: "24rem", height: "420px", display: "flex" }}><WritingsFolder /></div>
              <p className="ds-caption">
                A tile on --mosaic-card-surface with 24px corners and one label, “Writings &amp; notes”.
                Between 700px and 899px the corners drop to 16px and the folder is zoomed to 0.7 so it and the
                label both fit a 180px row; the artwork is absolutely positioned at fixed offsets, so only a
                layout-affecting scale keeps it off the label.
                The blue folder uses two Figma layers, a half-large (12px) front crop, and three live papers
                with 8px corners and 14px type scaled to one third. Papers fan over 360ms with smooth easing.
                The list and reader share one modal up to 52rem wide that hangs from the line a project preview opens on — 8vh
                from the top of the viewport, 5vh from 1320px — and runs to 1rem above the bottom, with room for the navigation
                rail, white, overlay elevation, and 24px corners. Selecting a note preserves the modal dimensions.
                The list contains only titles grouped by publication or archive year, newest first; eight writings are visible, with seven in 2026 and one in 2025.
                Each reader ends with “More articles”, showing up to three other notes, newest first, with the archive’s title rows.
                The section sits 48px below the article; selecting a title opens that note at the top and focuses its heading.
                Breadcrumbs contain only Notes and the selected year, and return to the list with its scroll and focus restored.
                There is no search, document count, author byline, or subtitle. Notes and the year both use 24px type in the top bar,
                aligned with the archive titles in the same 48rem column and shared side gutters when the list is open.
                Toolbar top padding matches the column inset from the modal edge: up to 56px on desktop and 20px plus the safe area on mobile.
                Notes stays aligned at the left edge in both the archive and reader; its breadcrumb returns to the list.
                Opening a note reveals the year breadcrumb, which fades over 160ms and translates from -8px over 200ms with smooth easing.
                Previous/next controls reuse the project gallery’s 44px round buttons, border, shadow and press state.
                Previous/next controls sit outside the desktop reader and cycle through notes in archive order, resetting scroll.
                Switching notes pages the whole modal like project previews: next sends the current note 1.4rem left,
                previous sends it right, fading to zero at scale(0.985) over 190ms. The new note arrives from the
                opposite side over the same 190ms, using standard transform easing and ease-out opacity.
                The old article remains visible until its exit completes; selection then updates the URL and resets scroll.
                Arrow keys focus the new heading; pointer navigation retains control focus. Repeated navigation is ignored
                during the switch, and closing or returning to Notes cancels pending selection. Reduced motion switches instantly.
                An expand toggle stays available on the right for both the archive and reader. Expanded mode nearly fills the viewport, giving up the shared top edge for 1.5rem desktop margins on all four sides and 24px corners,
                keeps the reading column centered with 1.5rem top padding plus the safe area, and brings the rail inside the right edge.
                Modal width and height, column width, toolbar padding, and rail position transition together with --ease-smooth: 360ms to expand and 200ms to restore.
                Rapid toggles reverse from the current position; reduced motion makes resizing immediate. Toggling preserves the selected note and scroll;
                closing restores the default size. On mobile, the modal retains its 0.5rem margins and safe-area clearance, and expand and navigation controls share the bottom bar.
                The desktop header has no close icon; Escape and outside click dismiss it. On mobile, navigation and close sit in a bottom bar.
                List and reader occupy overlapping, independently scrolling layers with stable scrollbar gutters.
                Forward navigation sends the list left and brings the reader from 48px right over 360ms; back reverses
                that direction over 200ms. Opacity uses 200ms standard easing, transforms use smooth easing, and blur is zero.
                Inactive panels are inert and hidden from assistive technology. Both remain mounted to preserve the
                return animation and archive scroll. Rapid reversals retarget the same CSS transitions without timers.
                Personal essays are text-only; project writings reuse existing portfolio illustrations as covers or within their sections.
                The date sits above the title in month, day, year format; sample articles use illustrative dates.
                Titles use clamp(2rem, 3vw, 2.5rem), 600 weight, 1.2 line height and -0.025em tracking,
                a scoped editorial exception to the four-step UI scale. Prose stays 18px on desktop and mobile,
                with 1.7 line height, -0.005rem tracking, and a 60ch maximum paragraph measure aligned to the left edge.
                Paragraphs are separated by 24px. Section headings are 24px, 600 weight, with 1.35 line height,
                -0.015rem tracking, balanced wrapping, and a 36ch maximum measure; sections begin after 48px.
                List entries use 18px, 1.5 line height, -0.015rem tracking, and pretty wrapping. Dates use 14px,
                1.5 line height, and -0.00563rem tracking. Font kerning is enabled throughout the dialog.
                Inline images retain their intrinsic
                aspect ratio, fill the reading column, load lazily, and use 16px corners. Optional image captions are 14px.
                The reading column is 48rem wide including its side padding. Prose uses #545454; secondary text uses --muted.
                Archive and reader begin 24px below the toolbar and end with 48px of breathing room.
                More articles is separated from the article by a 1px black divider at 8% opacity, with 48px above the line and 32px below.
                Rows have 12px vertical padding, year headings sit 8px above their entries, and groups are separated by 48px on desktop or 32px on mobile.
                Reader headers have a 32px bottom margin. Desktop side padding is 24px; mobile side padding is 20px.
                Open takes 200ms and close 160ms at scale 0.96 with smooth easing. Reduced motion removes transitions
                and the paper fan. Control hit areas are at least 44px; the dialog traps focus, closes on Escape or outside click,
                and returns focus to the folder. Notes receives focus on open; opening an article focuses its heading,
                and returning through the breadcrumb restores focus to the selected row. Reduced motion disables the panel and breadcrumb transitions.
              </p>
            </div>
            <div className="ds-section-heading">
              <h2>Components</h2>
              <p>
                Rendered from the real components and classes, on the surfaces they actually ship on. Hover and focus
                them — the states are live.
              </p>
            </div>

            <div className="ds-block" data-ds-terms={terms("quote blockquote attribution avatars --radius-lg --text-lg --text-md --text-sm 340px")}>
              <p className="ds-subhead">Quote slider</p>
              <p>
                The slider replaces the dark-mode tile at the start of project row two and takes a 1.25-unit
                column beside a 1.75-unit Protector, so the row still totals four units with the writings tile. Between 700px and 899px, that row grows to 340px to fit the quote;
                from 900px it shares the usual 420px row height. The card uses the existing #f2f2f2 chip surface, an 8%
                black hairline, and --radius-lg corners (--radius-md between 700px and 899px, with the rest of the row). Quotes up to 80 characters (including spaces)
                use --text-lg (18px); longer quotes use --text-md (16px). Both use 1.5 line height with a
                centered 21rem measure and balanced line breaks; attribution uses --text-sm and --muted. A shared grid reserves the longest
                quote's height, author row, and attribution-note row using subgrid. Each 40px portrait and attribution fit their content and are centered
                together, with text wrapping naturally when the available width runs out. Portraits
                carry a 12% black hairline inside the crop so pale photos keep an edge on the card.
                Confirmed authors' names are buttons with invisible 40px-tall hit targets. Hovering for
                260ms, focusing, or tapping the button opens the full X profile popover above the name, centered on the button and portaled
                beyond the carousel clip with viewport collision handling at --z-overlay. The preview
                stays interactive by pointer and keyboard, closes on Escape, restores focus, and uses the shared hover-card motion tokens.
                The author button has no padding or minimum layout height, keeping the name and caption on consecutive lines.
                An invisible pseudo-element extends the hit target, while a 6px spread shadow paints
                --mosaic-card-surface around the name on hover or keyboard focus without affecting spacing.
                The background and shadow transition over --duration-quick with --ease-standard.
                Previews show the full X display name, handle, available bio, Follow action, and following/follower counts.
                Empty bios stay omitted. Missing portraits use an initial avatar. Unlinked authors remain plain text; offscreen slides are inert.
                Click the card outside the identity to advance, select a dot, or drag horizontally in either direction.
                The active and adjacent slides follow the pointer together without easing. A drag of 6% of the card width
                (capped at 24px) selects the adjacent quote and wraps at either end; shorter drags snap
                back over --duration-slow (360ms) with --ease-smooth. Movement under 6px remains a tap. Vertical touch gestures
                scroll the page, and dragging never triggers an extra click. The surface uses grab and
                grabbing cursors. The original dots-only navigation uses 6px dots with 4px gaps,
                centered 18px above the bottom edge. Their buttons remain 10px wide and 40px tall;
                the whole-card Advance quote button is the larger alternative target.
                Dots use --muted-soft at 30% opacity, increasing to 75% when selected without changing size.
                Dot focus rings sit inside the target so the card edge cannot clip them.
                Quotes travel one card width left or right over --duration-slow with --ease-smooth, with no crossfade.
                Selecting a distant dot first positions only the hidden destination beside the current quote;
                incoming and outgoing quotes animate while other hidden slides reposition instantly.
                Grabbing a settling slide catches it at its current position; drag limits apply to the new pointer displacement
                so catching an early transition cannot jump. Reversing can return to the outgoing quote. The dots and card stay fixed. Reduced motion switches immediately.
                Both side gutters soften moving content with four masked backdrop-blur layers, increasing
                from 1px to 2px, 4px, and 8px toward the outer edge. A matching #f2f2f2 gradient fades the
                blurred content into the background. The bands are 24px wide (16px between 700px and
                899px), occupy only the gutters, and ignore pointer input. Resting text stays sharp;
                the gray fade also works when backdrop filtering is unavailable.
                There is no autoplay. Based Floyd's quote uses the supplied post wording and X handle,
                with his X profile photo and no additional attribution note.
                Michael Wong's quote uses his supplied wording and handle. Phil Liao's supplied wording
                is shown with his Head of Engineering at 0x caption, without an additional attribution note.
                The homepage also includes Simon Rico and Jakub Antalik, with role captions and no
                additional attribution notes. This development-only specimen adds Amy’s sample
                to exercise longer copy and distant selections. Portraits are optional.
              </p>
              <QuoteCard quotes={[...portfolioQuotes, ...sampleQuotes]} />
            </div>

            <div className="ds-block" data-ds-terms={terms("personal photos stack polaroid carousel modal Handlee shadow radius slide")}>
              <p className="ds-subhead">Personal photos</p>
              <p>The square-cropped preview keeps four prints below 700px and five at 700px and above, overlapping by 35% of each print’s width. After browsing, it retains a group near the last visible photos, filling from preceding photos at the end of the carousel, so reopening any print lands back in that group. The count also updates when the viewport changes. Prints stay at most 28% of the trigger width and shrink to fit the five-print row. A few prints shift slightly sideways and vertically to loosen the stack. The row uses the shared About scroll entrance, with reduced motion leaving it static. Resting and hover angles alternate in both directions; hover or keyboard focus fans all prints together over --duration-slow (360ms), using --photo-motion-ease with no stagger. The return uses the same 360ms duration and easing, and the hand-drawn note shares the timing so the whole interaction settles together. The preview keeps only 0.5rem of bottom padding on larger screens and 1.5rem on mobile. Each print keeps the original --shadow-overlay card shadow plus a 6% hairline, and its 1:1 image crop sits slightly above center to keep faces in view. Clicking or tapping a print opens the carousel on that photo; keyboard activation has no target photo, so Enter and Space resume the saved scroll position instead. Opening expands the retained prints from their measured positions, sizes, and angles in the source stack into the eleven-photo carousel over --photo-open-duration (200ms). Both directions use Apple Core Animation’s documented default timing curve, --photo-motion-ease: cubic-bezier(0.25, 0.1, 0.25, 1), which builds speed before easing into place. The backdrop and captions share the flight timing with no delay. While expanded, the source stack keeps flat, very light-gray (#f2f2f2) card silhouettes at the original sizes and tilts, with a 1px inset 6% black hairline and no gradient or shadow; only the thumbnail images hide. The hairline uses an inset outline to preserve the card dimensions during the flight. These placeholders also remain with reduced motion and restore their photos on return. Closing returns them to the stack over --photo-close-duration (200ms); Escape restores focus to the row. Temporary, non-interactive copies travel outside the scroller so the flight is never clipped. Each copy keeps an already available image for the entire flight, uses uniform scale, and morphs its frame height, padding, corners, shadow, and image crop to match the real thumbnail before handoff. Photo IDs match each return to its own thumbnail, and the stack reuses the available full-size image after browsing. All retained prints participate in both directions, including those whose carousel positions are outside the viewport. Small thumbnails warm as the preview approaches the viewport so extra photos are ready when opening. Additional slides visible on wide screens expand from the nearest retained print using their own image, starting and landing together with the stack without a stagger. Offscreen slides without a retained print do not fly. Scroll position is retained in slide units so reopening also adapts to a resized viewport. The flight controls final unmount so a shorter, interrupted backdrop fade cannot cut off the landing. JavaScript reads both ms and s duration units so production CSS minification preserves the timing. Browsing or resizing interrupts the flight immediately, and reduced motion opens and closes immediately. Portrait and landscape photos fill a consistent 3:4 crop; the square bridge photo remains fully visible within that frame. Captions use Handlee at --text-lg and images use a subtle inner radius of calc(var(--radius-sm) / 2) (4px). Horizontal gutters use clamp(1.25rem, 4vw, 5rem), keeping the first print close to the left edge even on wide screens. The strip reserves 6rem above and below the prints so their shadows finish fading inside the scroll container. With a fine pointer only the card-height row is draggable, including the gaps between prints and the side gutters; the shadow clearance is non-interactive, so wheel and drag gestures there do not scroll the carousel and clicking there dismisses it. Coarse pointers get the whole strip instead, because the clearance covers more than a third of a phone screen and a thumb cannot aim around it: swiping anywhere pans, and a tap that misses a card still dismisses. Touch panning, wheel scrolling, and keyboard arrows browse the eleven photos with firm stops at both ends. Focusing the strip does not draw an outline around the carousel; the preview trigger keeps its keyboard focus ring. The first and last prints stop at the matching horizontal gutters, with no trailing empty area. Escape or clicking outside closes it.</p>
              <PersonalPhotos />
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Hero hierarchy</p>
              <p>
                Name and role lead directly into the company list.
                Email owns the dark primary pill; LinkedIn and Follow use the light treatment.
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
                    <tr data-ds-terms={terms("email dark pill #171717 #000 white label 112px primary action")}>
                      <td>Email</td>
                      <td>
                        <code>#171717 → #000</code> gradient, white label, 112px fixed
                      </td>
                      <td>The primary action. One per row.</td>
                    </tr>
                    <tr data-ds-terms={terms("linkedin pill #0a66c2 92px secondary vendor")}>
                      <td>LinkedIn</td>
                      <td>
                        Light shell, <code>#0a66c2</code> label, 92px min
                      </td>
                      <td>Secondary. Carries a vendor mark, so it borrows the vendor colour.</td>
                    </tr>
                    <tr data-ds-terms={terms("follow light pill #f4f4f4 #fff #dedee0 80px tertiary")}>
                      <td>Follow</td>
                      <td>
                        <code>#f4f4f4 → #fff</code> gradient, dark label and mark, 80px min
                      </td>
                      <td>Tertiary. The light treatment keeps email as the primary action.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="ds-caption">
                All three use a 2.125rem fine-pointer height and <code>--radius-full</code>; below 700px, touch inputs keep a
                44px target. They share the same physical build: an outer shadow, a{" "}
                <code>::before</code> specular highlight across the top, and a <code>::after</code> ring of inset
                shadows for the bottom bevel. Labels are trimmed with{" "}
                <code>text-box: trim-both cap alphabetic</code> so the flex centring centres the cap box — SF rides
                low in its em box, so an untrimmed label sits about half a pixel below centre. Shadow, not scale,
                carries the press.
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
                  <X aria-hidden="true" />
                </button>
                <p className="mosaic-profile-availability" style={{ margin: 0 }}>
                  <span className="mosaic-availability-dot" style={{ opacity: 1 }} aria-hidden="true" />
                  {formatAvailability()}
                </p>
              </div>
              <p className="ds-caption">
                Company chips rest on <code>--canvas</code> behind a <code>1px solid rgb(0 0 0 / 0.07)</code> hairline, labelled in <code>--muted</code> so the hero name keeps the only dark ink in that block.
                All chips fill to <code>#e9e9e9</code>{" "}
                for hover, focus, and selected — deliberately the same value, because a chip that is open and a chip
                under the cursor mean the same thing. Nav links extend a <code>2.5rem</code> invisible <code>::before</code> so the tap target reaches
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
                    Work cards only. They use a 24px radius — 16px between 700px and 899px, where the row is 180px tall —{" "}
                    <code>1px solid rgb(0 0 0 / 0.08)</code>, and no shadow —
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
              <div className="ds-rule" data-ds-terms={terms("exit entrance 200ms 160ms opacity transform dropped frame")}>
                <strong>Exits are shorter than entrances, and both are honest about it.</strong>
                <p>
                  A hover card enters over 200ms on the smooth curve and leaves over 160ms on the exit curve. Opacity and
                  transform share a duration within each direction — if they differ, the card finishes fading while it is
                  still moving and reads as a dropped frame. Where an element unmounts on transition end, the exit has to
                  outlast the fade, not merely match it.
                </p>
              </div>

              <div
                className="ds-rule"
                data-ds-terms={terms("direction axis preview gallery paging arrows chevron swipe translateX 1.4rem 0.985 190ms")}
              >
                <strong>Motion moves along the axis its control points down.</strong>
                <p>
                  The preview gallery pages sideways because that is what it offers to page with: a left and a right
                  chevron on the rail, and a horizontal swipe on touch. The outgoing card leaves{" "}
                  <code>1.4rem</code> in the direction of travel at <code>scale(0.985)</code> and the incoming one
                  arrives from the opposite edge, both over the shared <code>190ms</code> switch, so the set reads as a
                  strip moving past rather than two unrelated fades. This used to translate on Y, which contradicted
                  both affordances. Reduced motion swaps the preview outright.
                </p>
              </div>

              <div className="ds-rule" data-ds-terms={terms("loading slow network 3g 2g save data offline retry thumbnail blur --blur-reveal 4px")}>
                <strong>Loads and exits share one blur.</strong>
                <p>
                  <code>--blur-reveal: 4px</code> softens the initial profile, work cards, About entrances,
                  media reveals, and project preview headings during entrances, switches, and exits.
                  Full preview dialogs and cards use opacity and transform only; artwork at 700px and above
                  cross-fades over its thumbnail. Blur stays on smaller surfaces. Loaded content clears its filter entirely. Media resolves over <code>--duration-slow</code> on the smooth curve;
                  preview exits keep their shorter existing timing. Reduced motion removes the blur.
                </p>
                <p>
                  Data Saver, 3G or slower connections, and offline mode keep feed video posters visible
                  without requesting loops. Connection changes update this behavior live. Preview videos
                  offer native playback controls on these connections and wait for an explicit play.
                  Full-size images keep a responsive thumbnail underneath while decoding; loading feedback
                  and a retry button cover slow or failed requests without blocking preview navigation.
                  Without connection hints, the initial same-origin script transfer supplies a conservative fallback:
                  an uncached script of at least 32 KB taking at least one second at less than 150 KB/s keeps
                  videos on posters for that page visit. This reuses existing timing data, adds no speed-test
                  requests, and ignores cache hits and CPU-dependent hydration time. Fast loads retain autoplay.
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
            <div className="ds-rule" data-ds-terms={terms("standalone project pages 404 --text-lg --text-md --text-sm --muted --canvas --ink --radius-md 46rem 5rem 1.5rem 70vh")}>
              <strong>Standalone pages reuse the same system.</strong>
              <p>
                Direct project pages and the 404 use a 46rem content width, 5rem vertical and 1.5rem horizontal
                padding with safe-area minimums. Headings use --text-lg at 600; prose uses --text-md and --muted;
                navigation uses --text-sm. Project media has --radius-md corners on --mosaic-card-surface and a
                70vh height cap. The 404 uses --canvas, --ink, and the existing contact pill. Its production HTML
                loads the same compiled stylesheet, so these values cannot drift into a separate palette.
              </p>
            </div>
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
                <li data-ds-terms={terms("responsive mobile desktop table of contents TOC current section label Work About Work history 700px 14px 48px safe-area 24px 16px 360ms 200ms 160ms 120ms #e9e9e9 card 8px inset --toc-compact-width --toc-resize-duration --toc-row-height --toc-inset --blur-reveal")}>
                  <strong>Floating table of contents</strong> appears after 96px of scrolling at every screen size,
                  centered 0.75rem above the bottom safe area. It fades in over 160ms with standard easing
                  and rises 0.375rem over 200ms with smooth easing. Returning to the first 96px hides and closes it;
                  while hidden it is inert and excluded from assistive technology. Reduced motion removes the transition. From 700px up, the top section navigation and local time remain visible alongside it. Its numbered label follows the visible section: 01 Work, 02 About, or 03 Work history.
                  That change carries a direction: the outgoing label leaves the chip over 120ms on the exit
                  curve, travelling 0.25rem and resolving into <code>--blur-reveal</code> (4px), while the new one
                  arrives from the opposite edge over 160ms with standard easing. Scrolling further down the page
                  sends the label up; scrolling back sends it down. The chip keeps its 48px height throughout and
                  only its width eases to the new label.
                  Open, the control is one continuous card with three rows. The surface expands from the measured
                  label width to 17rem and from 48px to 160px — three adjacent 48px rows with an 8px outer inset —
                  keeping its bottom edge fixed. The card has 24px corners and the inset rows have concentric 16px
                  corners; labels are 14px and section numbers 12px. Its white fill is 92% opaque over a 16px backdrop
                  blur, with a 5% hairline and <code>--shadow-overlay</code> around the whole card.
                  Opening moves the rows into place as the card grows over 360ms with smooth easing; closing returns
                  them to the compact chip over 200ms on the same curve. Inactive rows fade and clear
                  <code>--blur-reveal</code> over 160ms. The card clips the rows throughout the transition.
                  The current row becomes the toggle: chip active gray (#e9e9e9) at 92% opacity, ink text,
                  and a 16px close icon. The collapsed row shows an upward chevron instead.
                  Icons fade over 160ms; the chevron rotates 90 degrees while the close icon scales from 0.8 to 1.
                  Transitions retarget during rapid taps; reduced motion makes them instant and drops the outgoing
                  label. Other rows are inert and
                  hidden from assistive technology when closed; keyboard focus rings sit 2px inside the row.
                  Selection, outside click, Escape, or focus leaving the control closes it. Resizing preserves its open state.
                  Selection scrolls and focuses the section. Colour changes use 160ms standard easing;
                  pressing scales the trigger content to 0.96 over 120ms, keeping the shadow stable.
                  Controls suppress native tap highlights and text selection while preserving keyboard focus rings.
                  The shell reserves 6rem plus the safe area so the control clears the final content.
                </li>
                <li data-ds-terms={terms("mosaic row flex 1rem gap 0.625rem 10px tablet --row-height --row-span 320px 420px clamp(340px, 92vw, 380px) contain letterbox minmax(0, 1fr) 16px radius")}>
                  <strong>Mosaic rows</strong> are flex, <code>1rem</code> gap, with height driven by{" "}
                  <code>--row-height</code>, which CSS resolves from the row data's{" "}
                  <code>--row-height-input</code>: <code>clamp(340px, 92vw, 380px)</code> stacked on mobile, 320px
                  base, and 420px from 900px up. Items flex by an inline <code>--row-span</code>. Between 700px and
                  899px the row is only <code>clamp(180px, 16vw, 260px)</code> tall, so the gap closes to{" "}
                  <code>0.625rem</code> (10px), the page inset to 1rem, and every tile — card, quote, and writings —
                  drops to a 16px radius. Contained artwork letterboxes inside the card at that width: the card's grid
                  gets one <code>minmax(0, 1fr)</code> track so the media's <code>max-height: 100%</code> has a definite
                  height to resolve against, and the inset drops to <code>0.375rem</code> (to zero for the two featured
                  clips, whose files already carry their own margin). The two bleed compositions — Family Stories and
                  Matcha Rewards, the same pair that drop the mat from 900px up — instead fill the card with{" "}
                  <code>cover</code>, so their artwork's own cut lands on the card's rounded edge rather than stopping
                  short of it in grey. Family Stories anchors to <code>center top</code>, since its phones already
                  trail off the bottom of their frame.
                </li>
                <li data-ds-terms={terms("row height 420px assertion playwright portfolio-polish scale opacity translate initial load entrance blur 4px reduced motion")}>
                  <strong>Row height is asserted at exactly 420px</strong> in{" "}
                  <code>tests/e2e/portfolio-polish.spec.ts</code>. The initial profile and work-card entrances fade,
                  rise, and resolve from 4px blur to sharp using their existing stagger and timing. The filter clears
                  completely at the end; reduced motion skips the entrance. There is no scale, which would change
                  the measured box and fail that test.
                </li>
                <li data-ds-terms={terms("about takeover sticky stage runway clamp(12rem, 30vh, 18rem) 100dvh z-index 1 display contents")}>
                  <strong>The About takeover is one viewport of scrolling.</strong> From 700px up, all four project rows
                  remain in one sticky stage with 1rem gaps (10px between 700px and 899px), including the quote tile in row two, followed by a responsive white
                  runway of <code>clamp(12rem, 30vh, 18rem)</code>. The runway carries its own{" "}
                  <code>--takeover-row-gap</code> mirroring that value, since the scroll distance it reserves has to
                  match the gaps the stage actually draws.
                  The runway is the gallery's natural height plus <code>100dvh</code>; the gallery pins when its bottom reaches the viewport, then the
                  full-bleed white About sheet crosses it at z-index 1 with the same layered shadow as the hover cards.
                  A top-only layer pairs that shadow with a <code>rgb(0 0 0 / 0.08)</code> hairline while the white sheet
                  remains continuous through the page end. The gallery retreats as one surface, and About
                  continues in normal flow after the cover. Below 700px both wrappers collapse with{" "}
                  <code>display: contents</code>; the white sheet stays full-bleed but no pinning or overlap is applied.
                </li>
                <li data-ds-terms={terms("gallery retreat blur 8px focus rack opacity 0.78 scale 0.98 compositor filter")}>
                  <strong>The gallery retreats out of focus, not just backwards.</strong> Across the same crossing the
                  stage runs three properties together — <code>opacity</code> to 0.78, <code>scale</code> to 0.98, and{" "}
                  <code>filter: blur()</code> to 8px — so the sheet reads as the focal plane rather than as a white
                  rectangle sliding over a sharp one. The blur is back-loaded (0.8px at a third of the crossing, 3px at
                  two thirds) because a linear ramp softens the gallery before the sheet has earned the attention. All
                  three are compositor-animated properties, so the ramp re-runs a shader over the stage's texture
                  instead of repainting the grid; a fourth animated property here would not be free.
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
                  8.75rem below it on desktop, without a hairline. Five overlapping photo prints stay in one row below the contact text, with one gallery trigger for pointer and keyboard users. Each role shows one representative result, aligns its
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
                      <tr key={entry.name} data-ds-terms={terms(entry.z, entry.name, entry.note, "z-index stacking layer")}>
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
                data-ds-terms={terms("tailwind z-scale base dock chrome corner overlay social dialog backdrop reaction skip-link stacking context")}
              >
                <strong>Tailwind and CSS share the same tokens.</strong>
                <p>
                  <code>tailwind.config.js</code> maps the full global stacking ladder to the CSS custom properties.
                  Colours, type sizes, radii, shadows, and motion utilities use those same tokens; responsive utilities
                  use the breakpoints documented above. Prefer an existing tier when adding a layer.
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
                smaller — the desktop 2rem nav links, the map attribution, the takeover cue's 34px chevron — an invisible{" "}
                <code>::before</code> or extra padding makes up the difference rather than the label growing.
              </li>
              <li data-ds-terms={terms("resume résumé preview map hover focus 260ms 140ms 22.5rem")}>
                <strong>The Resume link previews the document.</strong> It shares the map card's surface,
                6px inset, 16px radius, shadow, and motion, opening after 260ms of hover or immediately on
                focus and closing after 140ms away or Escape. The preview is at most 22.5rem wide, fits
                the viewport height, and is available from the desktop corner navigation. The mobile Work history entry scrolls to the on-page experience section; the PDF link lives below that section. Its decorative image
                is generated alongside the PDF and loads on demand; clicking the link opens the PDF in a new tab.
              </li>
              <li data-ds-terms={terms("hover none display none touch project card image only assistive")}>
                <strong>Hover-only content has a non-hover fate.</strong> Every hover card is{" "}
                <code>display: none</code> under <code>(hover: none)</code>; project cards keep their titles visible on touch over a compact 6rem tint. Their button labels
                also expose each project title to assistive technology.
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
