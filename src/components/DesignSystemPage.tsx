import type { CSSProperties } from "react"

import { linkedinHoverMedia, xProfilePreview, type SiteLinks } from "../data/portfolio"
import { ContactActionRow } from "./ContactActionRow"
import { WorkedWithCompaniesInline } from "./WorkedWithCompaniesInline"

import "./design-system.css"

/*
 * The reference for what this site already is.
 *
 * Everything below was read out of src/index.css, tailwind.config.js, and the
 * components — it documents the system that shipped rather than one somebody
 * would like to have. Two consequences worth knowing before editing:
 *
 * 1. When you change a value in index.css, change it here too, or this page
 *    starts lying. The live specimens (ContactActionRow, the chips, the inline
 *    links) import the real components and cannot drift; the swatches, scale,
 *    and motion tables are transcriptions and can.
 * 2. Where the code and the intent disagree, the code wins and the gap is
 *    written down as a rule rather than quietly cleaned up. See the muted-ramp
 *    warning under Colour and the second-face note under Typography.
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

const SURFACES = [
  {
    hex: "#ffffff",
    token: "--canvas / --surface",
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
  {
    hex: "#f6f8fb",
    token: "--surface-2",
    name: "Unused",
    note: "Declared in :root and referenced nowhere. Do not reach for it; pick one of the surfaces above.",
  },
]

const INK = [
  { hex: "#111111", token: "--body-color / --heading-color", use: "Body default and headings" },
  { hex: "#141414", token: "--ink", use: "App wrapper text colour" },
  { hex: "#171717", token: "—", use: "Text inside white cards and the preview dialog" },
  { hex: "#2d2d2d", token: "--focus-ring", use: "Primary UI labels, hover states, and every focus ring" },
  { hex: "#4a4a4a", token: "—", use: "Inline links at rest" },
  { hex: "#545454", token: "—", use: "About-panel prose and résumé highlights" },
  { hex: "#6b6b6b", token: "--muted", use: "Secondary copy: subtitles, captions, dialog descriptions" },
  { hex: "#747474", token: "—", use: "Corner nav links and the local-time label" },
  { hex: "#757575", token: "--muted-soft", use: "Tertiary labels: definition terms, hobby notes, headings" },
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

const DECLARED_ONLY = [
  { hex: "#3e9fff", token: "--primary", note: "Declared in :root; no component paints text or a surface with it." },
  { hex: "#f09637", token: "--secondary", note: "Declared in :root; unused. Neither is a brand colour yet." },
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
    where: "Hero name; About prose, labels, section headings, résumé companies, and metadata",
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
  { value: 400, use: "Body copy, nav links, summaries, definition values" },
  { value: 500, use: "Pill labels, preview titles, popover roles" },
  { value: 600, use: "Headings, card titles, résumé companies, the mobile reveal, the X follow button" },
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
  { value: "1.25rem", use: "Maximum mobile contact-pill side padding" },
  { value: "8px", use: "Mobile page gutter and row-video side inset below 700px" },
  { value: "1rem", use: "Mosaic row and column gap — the layout unit" },
  { value: "clamp(16px, 3vw, 32px)", use: "Page gutter from 700px to 899px" },
  { value: "clamp(8rem, 20vh, 12rem)", use: "Desktop white runway before the About takeover" },
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
    name: "Hover card",
    shadow: "0 1px 2px rgb(16 16 20 / 0.06), 0 12px 32px rgb(16 16 20 / 0.16)",
    use: "LinkedIn and X cards, the work-history popover. A tight contact shadow plus one wide ambient.",
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
    name: "Standard",
    css: "cubic-bezier(0.2, 0, 0, 1)",
    duration: "160–300ms",
    use: "The house curve. Chips, icons, expand buttons, card-title reveals — anything changing state in place.",
  },
  {
    name: "Responsive resize",
    css: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    duration: "180ms",
    use: "The hero's min-height and padding as the viewport crosses layout states.",
  },
  {
    name: "Entrance",
    css: "cubic-bezier(0.16, 1, 0.3, 1)",
    duration: "200–240ms",
    use: "Overlays arriving: hover cards, popovers, the local-time card. Fast out of the gate, long settle.",
  },
  {
    name: "Gallery open",
    css: "cubic-bezier(0.32, 0.8, 0.32, 1)",
    duration: "200ms",
    use: "The preview gallery's origin-aware expansion and its fallback lift.",
  },
  {
    name: "Exit",
    css: "cubic-bezier(0.4, 0, 1, 1)",
    duration: "120–160ms",
    use: "Hover cards and the preview gallery leaving. Always shorter than the entrance it reverses.",
  },
  {
    name: "Popover exit",
    css: "cubic-bezier(0.55, 0, 1, 0.45)",
    duration: "160ms",
    use: "The work-history popover only — a slightly firmer close than the other overlays.",
  },
  {
    name: "First load",
    css: "cubic-bezier(0.19, 1, 0.22, 1)",
    duration: "380–480ms",
    use: "--ease-smooth. The hero and mosaic intro cascades; the avatar press reuses it at 160ms.",
  },
  {
    name: "Coin flip",
    css: "cubic-bezier(0.22, 1, 0.36, 1)",
    duration: "700ms",
    use: "The avatar's 180-degree flip and its long settle.",
  },
  {
    name: "Overshoot",
    css: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    duration: "220ms",
    use: "The copy-email reaction only. The single place in the system that overshoots — keep it that way.",
  },
  {
    name: "About takeover",
    css: "linear",
    duration: "1 viewport of scroll",
    use: "A CSS View Timeline scales and fades the complete pinned gallery as the About sheet covers it.",
  },
]

const DURATIONS = [
  { value: "100–120ms", use: "Fallback fades, popover-content swaps, and the shortest exit feedback." },
  { value: "140–160ms", use: "Colour, opacity, and shadow on hover or focus. The default for a state change." },
  { value: "180–240ms", use: "Anything that also moves: overlays and title reveals." },
  { value: "300ms", use: "The gallery expand/minimise icon swap." },
  { value: "360ms", use: "Media un-blurring as it decodes." },
  { value: "380–480ms", use: "First-load entrance travel, hero then mosaic." },
  { value: "700ms", use: "The avatar coin flip — a deliberate outlier, and the longest thing on the site." },
]

/* ------------------------------------------------------------------ layout */

const BREAKPOINTS = [
  { at: "≤ 327.98px", change: "Contact pills use 0.625rem side padding; location and availability stack without a separator." },
  { at: "≤ 479.98px", change: "Contact pills gain up to 1.25rem side padding and wrap when their container cannot accommodate them." },
  { at: "≤ 639.98px", change: "The hero reserves 4rem of top clearance." },
  { at: "≤ 699.98px", change: "Local time hides; the 14px About and Resume labels centre optically; the shell uses 8px gutters; every project shows in one 340–380px column; featured media crops to fill its card; the full-bleed About sheet returns to normal document flow; card captions hide." },
  { at: "480–699.98px + fine hover", change: "Contact pills stay 32px tall." },
  { at: "≥ 760px", change: "This page's own two-column grids. Not a portfolio breakpoint." },
  { at: "≥ 900px", change: "Mosaic rows go to 420px and the shell drops its inline padding." },
  {
    at: "≥ 1320px",
    change: "The hero name settles at 16px; project previews open in the 1090px wide view with a 5vh top inset.",
  },
]

const STACKING = [
  { z: "0–20", name: "Base, dock, chrome", note: "Tailwind's z-base / z-dock / z-chrome. The page and the mosaic." },
  { z: "1", name: "About sheet", note: "The full-viewport white surface paints above the pinned project gallery during takeover." },
  {
    z: "30 / 50",
    name: "Corner nav",
    note: "The section corner sits at 30; the social corner sits at 50 so its hover cards clear other overlays.",
  },
  { z: "40", name: "Hover cards", note: "LinkedIn, X, work-history popovers, the local-time card." },
  { z: "60 / 70", name: "Dialog", note: "The preview gallery backdrop, then its shell." },
  { z: "100", name: "Copy reaction", note: "Has to clear the dialog trigger it sits under." },
  { z: "120", name: "Skip link", note: "Above everything, always." },
]

export function DesignSystemPage({ links, name }: DesignSystemPageProps) {
  return (
    <main id="main-content" tabIndex={-1} className="ds-page">
      <header className="ds-hero">
        <div className="ds-hero-topline">
          <a href="/" className="ds-home-link">
            ← Back to portfolio
          </a>
          <span className="ds-badge">Dev only</span>
        </div>
        <p className="ds-eyebrow">{name} · Portfolio</p>
        <h1>Design system</h1>
        <p className="ds-lede">
          Not a proposal — an inventory. Every value here was read back out of the shipped stylesheet and components, so
          it describes what this site already does. Treat it as the constraint: reach for something on this page before
          inventing a new one, and when you do change a value, change it in both places.
        </p>
      </header>

      <div className="ds-shell">
        <nav className="ds-nav" aria-label="Design system sections">
          {SECTIONS.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>

        <div className="ds-sections">
          {/* ------------------------------------------------- principles -- */}
          <section id="principles" className="ds-section">
            <div className="ds-section-heading">
              <h2>Principles</h2>
              <p>Five habits the existing code already keeps. They are descriptive first and prescriptive second.</p>
            </div>
            <ul className="ds-list">
              <li>
                <strong>Grey does the work; colour is a signal.</strong> The entire interface is built from nine steps of
                neutral ink on four near-white surfaces. The only saturated colours on screen belong to a status (the
                availability dot) or to somebody else's brand (LinkedIn, X). A new accent needs a reason beyond
                decoration.
              </li>
              <li>
                <strong>Hover reveals; it never relocates.</strong> Cards, titles, and icons fade and settle in place.
                Space is reserved ahead of time — the work-history block holds <code>min-height: 6.225rem</code> so the
                first chip expansion cannot push the page. If an interaction would reflow the layout, reserve the room
                instead.
              </li>
              <li>
                <strong>Every entrance owns its exit.</strong> Overlays enter on the entrance curve and leave on the exit
                curve, shorter. Opacity and transform share a duration so a card never finishes fading while it is still
                moving.
              </li>
              <li>
                <strong>Contrast is a floor, not a preference.</strong> The ink ramp stops at <code>#757575</code>{" "}
                because the next step down fails AA on the page background, and the focus ring is <code>#2d2d2d</code>{" "}
                rather than a grey because it needs 3:1 against white.
              </li>
              <li>
                <strong>Nothing is required to move.</strong> A global{" "}
                <code>prefers-reduced-motion</code> reset zeroes durations, and nine further blocks opt individual
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
                  <article key={surface.name} className="ds-swatch-card">
                    <div className="ds-swatch" style={{ background: surface.hex }} />
                    <div className="ds-swatch-body">
                      <strong>{surface.name}</strong>
                      <code>
                        {surface.hex} · {surface.token}
                      </code>
                      <p className="ds-swatch-note">{surface.note}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Ink ramp</p>
              <div className="ds-ramp">
                {INK.map((step) => (
                  <div key={step.hex} className="ds-ramp-row">
                    <div className="ds-ramp-sample" style={{ color: step.hex }}>
                      {step.use}
                      <span>
                        {step.hex}
                        {step.token === "—" ? "" : ` · ${step.token}`}
                      </span>
                    </div>
                    <div className="ds-ramp-meta">
                      <ContrastBadge color={step.hex} on={PAGE_BG} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="ds-rule ds-rule-warn">
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
                  <article key={entry.hex} className="ds-swatch-card">
                    <div className="ds-swatch" style={{ background: entry.hex }} />
                    <div className="ds-swatch-body">
                      <strong>{entry.name}</strong>
                      <code>{entry.hex}</code>
                      <p className="ds-swatch-note">{entry.note}</p>
                      <ContrastBadge color={entry.hex} kind={entry.kind} on={PAGE_BG} />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Borrowed brand</p>
              <div className="ds-grid">
                {BRAND.map((entry) => (
                  <article key={entry.hex} className="ds-swatch-card">
                    <div className="ds-swatch" style={{ background: entry.hex }} />
                    <div className="ds-swatch-body">
                      <strong>{entry.name}</strong>
                      <code>{entry.hex}</code>
                      <p className="ds-swatch-note">{entry.note}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="ds-rule">
                <strong>Vendor colours stay vendor colours.</strong>
                <p>
                  The X card reproduces X's own palette and the LinkedIn pill its blue, because a recognisable chrome is
                  the point of both. That exemption does not extend past those two components — nothing else on the site
                  may introduce a hue.
                </p>
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Declared but unused</p>
              <div className="ds-grid">
                {DECLARED_ONLY.map((entry) => (
                  <article key={entry.token} className="ds-swatch-card">
                    <div className="ds-swatch" style={{ background: entry.hex }} />
                    <div className="ds-swatch-body">
                      <strong>{entry.token}</strong>
                      <code>{entry.hex}</code>
                      <p className="ds-swatch-note">{entry.note}</p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="ds-rule">
                <strong>Do not treat these as the brand palette.</strong>
                <p>
                  <code>--primary</code>, <code>--secondary</code>, and <code>--surface-2</code> survive in{" "}
                  <code>:root</code> from an earlier direction. Nothing renders them. Either give one a real job
                  deliberately, or leave them alone — do not reach for them because they sound canonical.
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
                emoji sticker are deliberate display exceptions.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Families</p>
              <div className="ds-grid ds-grid-wide">
                <article className="ds-token-card">
                  <strong>UI — the system stack</strong>
                  <code>
                    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Inter", sans-serif
                  </code>
                  <p>
                    All interface copy and controls. No webfont, no layout shift, SF Pro on Apple hardware. Prefer{" "}
                    <code>var(--font-body)</code> — twelve rules currently write the stack out inline instead.
                  </p>
                </article>
                <article className="ds-token-card">
                  <strong>Display — Handlee</strong>
                  <code>"Handlee", "Bradley Hand", "Segoe Print", cursive</code>
                  <p>
                    The only real webfont, preloaded and scoped to a single element: the handwritten hint beside the
                    avatar. It ships one weight, so it fakes bold with a 0.45px text-stroke.
                  </p>
                </article>
                <article className="ds-token-card">
                  <strong>Mono — --font-code</strong>
                  <code>"SF Mono", "SFMono-Regular", "Consolas", Menlo, monospace</code>
                  <p>Specification text only — token names and values, as used throughout this page.</p>
                </article>
              </div>
              <div className="ds-rule">
                <strong>There is no second general-purpose face.</strong>
                <p>
                  <code>--font-primary</code> and <code>--font-secondary</code> both resolve to{" "}
                  <code>--font-fallback</code>, because <code>--font-inter</code> and <code>--font-newsreader</code> are
                  never defined. Asking for <code>--font-secondary</code> gets the interface stack, not the narrowly
                  scoped Handlee display face. Any additional general-purpose face needs a real <code>@font-face</code>,
                  not that variable.
                </p>
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Scale</p>
              <div>
                {TYPE_SCALE.map((entry) => (
                  <div key={entry.spec} className="ds-type-row">
                    <div className="ds-type-sample" style={entry.style}>
                      {entry.sample}
                    </div>
                    <div className="ds-type-spec">
                      {entry.token}
                      <br />
                      {entry.spec}
                      <br />
                      <b>{entry.where}</b>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ds-rule">
                <strong>Four steps, and the element bends before the scale does.</strong>
                <p>
                  This ramp used to carry twelve distinct sizes, half of them a fraction of a pixel from a neighbour —{" "}
                  <code>0.82rem</code> beside <code>0.8125rem</code>, <code>0.9rem</code> beside <code>0.875rem</code>.
                  That is noise, not a scale. Use a token; if a new element will not fit one of the four, change the
                  element.
                </p>
              </div>
              <div className="ds-rule">
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
                      <tr key={weight.value}>
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
              <div className="ds-specimen ds-specimen-canvas">
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
              <div className="ds-grid">
                {SPACE.map((entry) => (
                  <article key={entry.value} className="ds-token-card">
                    <strong>{entry.value}</strong>
                    <p>{entry.use}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Radius</p>
              <div className="ds-grid">
                {RADII.map((entry) => (
                  <article key={entry.value} className="ds-radius-card">
                    <div
                      className="ds-radius-proof"
                      style={{ borderRadius: `${entry.css} ${entry.css} 0 0` }}
                      aria-hidden="true"
                    />
                    <div>
                      <strong
                        style={{
                          display: "block",
                          color: "#171717",
                          fontSize: "var(--text-sm)",
                          fontWeight: 600,
                          letterSpacing: "-0.00563rem",
                        }}
                      >
                        {entry.value}
                      </strong>
                      <p style={{ margin: "0.3rem 0 0", color: "#757575", fontSize: "var(--text-sm)", lineHeight: 1.4 }}>
                        {entry.use}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
              <div className="ds-rule">
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
            <div className="ds-grid ds-grid-wide">
              {ELEVATION.map((level) => (
                <article key={level.name} className="ds-elevation-card">
                  <div className="ds-elevation-proof" style={{ boxShadow: level.shadow }} aria-hidden="true" />
                  <div>
                    <strong
                      style={{
                        display: "block",
                        color: "#171717",
                        fontSize: "var(--text-sm)",
                        fontWeight: 600,
                        letterSpacing: "-0.00563rem",
                      }}
                    >
                      {level.name}
                    </strong>
                    <code
                      style={{
                        display: "block",
                        margin: "0.3rem 0 0",
                        color: "#757575",
                        fontFamily: "var(--font-code)",
                        fontSize: "var(--text-xs)",
                        lineHeight: 1.5,
                        wordBreak: "break-word",
                      }}
                    >
                      {level.shadow}
                    </code>
                    <p style={{ margin: "0.45rem 0 0", color: "#545454", fontSize: "var(--text-sm)", lineHeight: 1.45 }}>
                      {level.use}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            <div className="ds-rule">
              <strong>
                <code>--overlay-shadow</code> is a fifth level, and it is expensive.
              </strong>
              <p>
                Seven stacked layers from <code>0 0 0.125rem</code> out to <code>0 1.625rem 3.375rem</code>, paired with{" "}
                <code>--overlay-filter: blur(1rem)</code>. It exists for full-bleed glass surfaces. For a card, use the
                hover-card level above — the seven-layer stack costs paint time it will not earn back at that size.
              </p>
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
              <div className="ds-specimen ds-specimen-canvas ds-specimen-center">
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
                    <tr>
                      <td>Default</td>
                      <td>
                        <code>#f4f4f4 → #fff</code> gradient, <code>#dedee0</code> border, 104px min
                      </td>
                      <td>The primary action. One per row.</td>
                    </tr>
                    <tr>
                      <td>LinkedIn</td>
                      <td>
                        Same shell, <code>#0a66c2</code> label, 92px min
                      </td>
                      <td>Secondary. Carries a vendor mark, so it borrows the vendor colour.</td>
                    </tr>
                    <tr>
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
              <div className="ds-specimen ds-specimen-canvas">
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
                <p className="mosaic-profile-availability" style={{ margin: 0 }}>
                  <span className="mosaic-availability-dot" style={{ opacity: 1 }} aria-hidden="true" />
                  Available for work
                </p>
              </div>
              <p className="ds-caption">
                Chips carry <code>#f2f2f2</code> at rest and <code>#e9e9e9</code> for hover, focus, and selected —
                deliberately the same value, because a chip that is open and a chip under the cursor mean the same
                thing. Nav links extend a <code>2.5rem</code> invisible <code>::before</code> so the tap target reaches
                40px while the visible label stays 2rem.
              </p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Surfaces in place</p>
              <div className="ds-grid ds-grid-wide">
                <div
                  className="ds-specimen ds-specimen-white"
                  style={{ display: "block", boxShadow: "var(--overlay-shadow)" }}
                >
                  <strong style={{ fontSize: "var(--text-md)", fontWeight: 600, letterSpacing: "-0.005rem" }}>
                    Raised — #ffffff
                  </strong>
                  <p style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: "var(--text-sm)", lineHeight: 1.45 }}>
                    Hover cards, popovers, dialogs. Always white, always shadowed. The edge is normally a zero-blur{" "}
                    <code>0 0 0 1px</code> layer inside the shadow rather than a real border — the X card, which uses{" "}
                    <code>1px solid #e6e6e8</code> as well, is the exception.
                  </p>
                </div>
                <div className="ds-specimen" style={{ display: "block" }}>
                  <strong style={{ fontSize: "var(--text-md)", fontWeight: 600, letterSpacing: "-0.005rem" }}>
                    Tile — #ececee
                  </strong>
                  <p style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: "var(--text-sm)", lineHeight: 1.45 }}>
                    Work cards only. They use a 24px radius, <code>1px solid rgb(0 0 0 / 0.08)</code>, and no shadow —
                    they sit in the page rather than above it. About uses the full-bleed white canvas surface.
                  </p>
                </div>
                <div className="ds-specimen" style={{ display: "block", background: "#f2f2f2" }}>
                  <strong style={{ fontSize: "var(--text-md)", fontWeight: 600, letterSpacing: "-0.005rem" }}>
                    Chip — #f2f2f2
                  </strong>
                  <p style={{ margin: "0.4rem 0 0", color: "var(--muted)", fontSize: "var(--text-sm)", lineHeight: 1.45 }}>
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
              <p>Ten curves and seven duration bands, including the deliberate component outliers. Hover a card to replay its easing.</p>
            </div>

            <div className="ds-block">
              <p className="ds-subhead">Easing</p>
              <div className="ds-grid ds-grid-wide">
                {EASINGS.map((easing) => (
                  <article
                    key={easing.name}
                    className="ds-motion-card"
                    style={
                      {
                        "--ds-motion-ease": easing.css,
                        "--ds-motion-duration": easing.duration.includes("–")
                          ? `${easing.duration.split("–")[1]}`
                          : easing.duration,
                      } as CSSProperties
                    }
                  >
                    <div className="ds-motion-track">
                      <span className="ds-motion-dot" />
                    </div>
                    <strong
                      style={{
                        display: "block",
                        color: "#171717",
                        fontSize: "var(--text-sm)",
                        fontWeight: 600,
                        letterSpacing: "-0.00563rem",
                      }}
                    >
                      {easing.name} · {easing.duration}
                    </strong>
                    <code
                      style={{
                        display: "block",
                        margin: "0.25rem 0 0",
                        color: "#6b6b6b",
                        fontFamily: "var(--font-code)",
                        fontSize: "var(--text-xs)",
                      }}
                    >
                      {easing.css}
                    </code>
                    <p style={{ margin: "0.45rem 0 0", color: "#545454", fontSize: "var(--text-sm)", lineHeight: 1.45 }}>
                      {easing.use}
                    </p>
                  </article>
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
                      <tr key={entry.value}>
                        <td>{entry.value}</td>
                        <td>{entry.use}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="ds-rule">
              <strong>Exits are shorter than entrances, and both are honest about it.</strong>
              <p>
                A hover card enters over 220ms on the entrance curve and leaves over 150ms on the exit curve. Opacity and
                transform share a duration within each direction — if they differ, the card finishes fading while it is
                still moving and reads as a dropped frame. Where an element unmounts on transition end, the exit has to
                outlast the fade, not merely match it.
              </p>
            </div>

            <div className="ds-rule">
              <strong>The reduced-motion reset is not sufficient on its own.</strong>
              <p>
                The global rule zeroes <code>animation-duration</code> but not <code>animation-delay</code>, so a
                delayed <code>both</code>-filled entrance still holds its invisible from-state for the whole delay. Any
                staggered entrance needs its own <code>animation: none</code> override at matching specificity. Any
                transform-based hover needs one too.
              </p>
            </div>

            <div className="ds-rule ds-rule-warn">
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
                <li>
                  <strong>Max width 1560px</strong>, with an 8px gutter below 700px and a{" "}
                  <code>clamp(1rem, 5vw, 1.5rem)</code> gutter from 700px to 899px — dropped entirely at 900px so the
                  mosaic can run full-bleed.
                </li>
                <li>
                  <strong>Mosaic rows</strong> are flex, <code>1rem</code> gap, with height driven by{" "}
                  <code>--row-height</code>: <code>clamp(340px, 92vw, 380px)</code> stacked on mobile, 320px base, and
                  420px from 900px up. Items flex by an inline <code>--row-span</code>.
                </li>
                <li>
                  <strong>Row height is asserted at exactly 420px</strong> in{" "}
                  <code>tests/e2e/portfolio-polish.spec.ts</code>. Entrance animations use opacity and translate only —
                  a scale would change the measured box and fail that test.
                </li>
                <li>
                  <strong>The About takeover is one viewport of scrolling.</strong> From 700px up, all four project rows
                  remain in one sticky stage at their original sizes and 1rem gaps, followed by a responsive white
                  runway of <code>clamp(8rem, 20vh, 12rem)</code>.
                  The runway is the gallery's natural height plus <code>100dvh</code>; the gallery pins when its bottom reaches the viewport, then the
                  full-bleed white About sheet crosses it at z-index 1. The gallery retreats as one surface, and About
                  continues in normal flow after the cover. Below 700px both wrappers collapse with{" "}
                  <code>display: contents</code>; the white sheet stays full-bleed but no pinning or overlap is applied.
                </li>
                <li>
                  <strong>About is one continuous reading surface.</strong> The introduction, Work history, and Education
                  share one left-aligned 34rem reading axis in normal document flow. A content-width hairline separates
                  About from Work history, with 3rem of space before the heading. Both eight-sticker sets span four
                  vertical bands inside the outer 8% of the desktop side gutters. Work-history company names reveal
                  their logo tooltips on hover, focus, and touch. There is no tab state or hidden panel; <code>#about-panel-resume</code> anchors
                  directly to the visible Work history section.
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
                      <tr key={entry.at}>
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
                      <tr key={entry.z}>
                        <td>{entry.z}</td>
                        <td>{entry.name}</td>
                        <td>{entry.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="ds-rule">
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
              <li>
                <strong>Focus is always visible and always the same.</strong>{" "}
                <code>2px solid var(--focus-ring)</code> at <code>2–3px</code> offset, applied by a{" "}
                <code>:where()</code> base rule to every interactive element. <code>#2d2d2d</code> was chosen over a
                grey because 1.4.11 wants 3:1 against the adjacent surface, which the greys cannot reach on near-white.
              </li>
              <li>
                <strong>Targets meet 24px; primary touch controls reach 44px.</strong> Where the visible control is
                smaller — the 2rem nav links, the map attribution — an invisible <code>::before</code> or extra padding
                makes up the difference rather than the label growing.
              </li>
              <li>
                <strong>Hover-only content has a non-hover fate.</strong> Every hover card is{" "}
                <code>display: none</code> under <code>(hover: none)</code>; project cards stay image-only on touch while
                their button labels continue to expose each project title to assistive technology.
              </li>
              <li>
                <strong>Asynchronous results are announced.</strong> Copying the email writes to an{" "}
                <code>aria-live="polite"</code> region, because the visual confirmation is a label swap and an image.
              </li>
              <li>
                <strong>The skip link is real.</strong> It is the first focusable element, sits at z-index 120, and every
                page target carries <code>scroll-margin-top: 5rem</code> so an anchored heading is not hidden under the
                corner nav.
              </li>
              <li>
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
