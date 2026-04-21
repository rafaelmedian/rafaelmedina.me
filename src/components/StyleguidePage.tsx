import type { SiteLinks } from "../data/portfolio"
import { ContactActionRow } from "./ContactActionRow"
import { WorkedWithCompaniesInline } from "./WorkedWithCompaniesInline"

type StyleguidePageProps = {
  links: SiteLinks
  name: string
}

const colorSwatches = [
  { label: "Body", variable: "--body-color" },
  { label: "Body BG", variable: "--body-bg" },
  { label: "Primary", variable: "--primary" },
  { label: "Secondary", variable: "--secondary" },
  { label: "Accent", variable: "--accent" },
  { label: "Surface", variable: "--surface-2" },
]

const motionTokens = [
  { label: "Snappy", value: "220ms / cubic-bezier(0.175, 0.885, 0.32, 1.1)" },
  { label: "Swift", value: "800ms / cubic-bezier(0.175, 0.885, 0.32, 1.275)" },
  { label: "Smooth", value: "300ms / cubic-bezier(0.19, 1, 0.22, 1)" },
]

export function StyleguidePage({ links, name }: StyleguidePageProps) {
  return (
    <main id="main-content" tabIndex={-1} className="styleguide-page">
      <header className="styleguide-hero">
        <div className="styleguide-hero-topline">
          <a href="/" className="styleguide-home-link">
            Back to portfolio
          </a>
          <span className="styleguide-badge">System inventory</span>
        </div>
        <div className="styleguide-hero-copy">
          <p className="styleguide-eyebrow">Rafael Medina UI system</p>
          <h1>Styleguide</h1>
          <p className="styleguide-lede">
            A living page for the real components, link treatments, text styles, surfaces, and motion tokens currently shaping{" "}
            {name}
            &apos;s portfolio.
          </p>
        </div>
      </header>

      <div className="styleguide-main">
        <section className="styleguide-section">
          <div className="styleguide-section-heading">
            <p>Buttons</p>
            <h2>Contact action row</h2>
          </div>
          <div className="styleguide-specimen styleguide-specimen-wide">
            <ContactActionRow email={links.email} contactHref={`mailto:${links.email}`} telegramHref={links.telegram} xHref={links.x} />
          </div>
          <div className="styleguide-notes-grid">
            <article className="styleguide-note-card">
              <span>Primary</span>
              <strong>Copy email</strong>
              <p>Utility-first action with the strongest contrast in the row.</p>
            </article>
            <article className="styleguide-note-card">
              <span>Secondary</span>
              <strong>Message</strong>
              <p>Friendlier blue accent that stays related to the main button family.</p>
            </article>
            <article className="styleguide-note-card">
              <span>Tertiary</span>
              <strong>Follow</strong>
              <p>Darker social action that stays present without overpowering the row.</p>
            </article>
          </div>
        </section>

        <section className="styleguide-section">
          <div className="styleguide-section-heading">
            <p>Links</p>
            <h2>Editorial inline treatments</h2>
          </div>
          <div className="styleguide-copy-sample">
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
        </section>

        <section className="styleguide-section styleguide-grid-two">
          <div className="styleguide-column">
            <div className="styleguide-section-heading">
              <p>Typography</p>
              <h2>Core text rhythm</h2>
            </div>
            <div className="styleguide-type-stack">
              <article className="styleguide-type-card">
                <span>Hero title</span>
                <h3>Rafael Medina</h3>
                <p>16px / 170% / -0.005em</p>
              </article>
              <article className="styleguide-type-card">
                <span>Body base</span>
                <h4>I&apos;m a designer who ships products, now AI-enabled.</h4>
                <p>14px / 1.25rem / -0.00563rem</p>
              </article>
              <article className="styleguide-type-card">
                <span>Meta</span>
                <div className="styleguide-meta-line">Punta Cana · Local time: 5:03pm AST</div>
                <p>14px / 1.25rem / -0.00563rem</p>
              </article>
            </div>
          </div>

          <div className="styleguide-column">
            <div className="styleguide-section-heading">
              <p>Tokens</p>
              <h2>Color and motion references</h2>
            </div>
            <div className="styleguide-swatch-grid">
              {colorSwatches.map((swatch) => (
                <article key={swatch.variable} className="styleguide-swatch-card">
                  <div className="styleguide-swatch" style={{ background: `var(${swatch.variable})` }} />
                  <strong>{swatch.label}</strong>
                  <span>{swatch.variable}</span>
                </article>
              ))}
            </div>
            <div className="styleguide-motion-list">
              {motionTokens.map((token) => (
                <article key={token.label} className="styleguide-motion-card">
                  <strong>{token.label}</strong>
                  <span>{token.value}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="styleguide-section">
          <div className="styleguide-section-heading">
            <p>Surfaces</p>
            <h2>Panels and atmosphere</h2>
          </div>
          <div className="styleguide-surface-grid">
            <article className="styleguide-surface-card styleguide-surface-card-overlay">
              <span>Overlay</span>
              <strong>Blurred system surface</strong>
              <p>Uses the shared overlay blur, background, and layered shadow tokens.</p>
            </article>
            <article className="styleguide-surface-card styleguide-surface-card-tile">
              <span>Tile</span>
              <strong>Project canvas</strong>
              <p>The softer neutral panel used by the portfolio grid.</p>
            </article>
            <article className="styleguide-surface-card styleguide-surface-card-accent">
              <span>Accent</span>
              <strong>Highlight wash</strong>
              <p>A low-contrast accent surface for emphasis, notes, or future badges.</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  )
}
