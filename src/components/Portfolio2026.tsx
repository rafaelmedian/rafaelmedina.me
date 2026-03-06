import { useMemo } from "react"

const colorTokens = [
  { name: "Canvas", value: "#E6E7EB" },
  { name: "Card", value: "#DFE1E6" },
  { name: "Ink", value: "#1F1F41" },
  { name: "Muted", value: "#7578B5" },
  { name: "Accent", value: "#706EFF" },
  { name: "Positive", value: "#00A41B" },
]

const quickLinks = [
  { label: "Github", href: "https://github.com/rafaelmedina" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rafaelmedina" },
  { label: "Twitter", href: "https://x.com/rafaelmedina" },
]

const scheduleTimes = ["2:30am", "3:00am", "3:30am", "4:00am", "4:30am", "5:00am"]

const calendarDays = [
  ["", "", "", "", "", "1", "2"],
  ["3", "4", "5", "6", "7", "8", "9"],
  ["10", "11", "12", "13", "14", "15", "16"],
  ["17", "18", "19", "20", "21", "22", "23"],
  ["24", "25", "26", "27", "28", "29", "30"],
  ["31", "", "", "", "", "", ""],
]

export function Portfolio2026() {
  const todaysDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(new Date()),
    [],
  )

  return (
    <div className="p26-shell">
      <section className="p26-styleguide" aria-label="Portfolio styleguide">
        <div>
          <p className="p26-eyebrow">Styleguide v0</p>
          <h1>Rafael Medina Portfolio 2026</h1>
        </div>
        <p className="p26-styleguide-text">
          Editorial-minimal tiles, soft grayscale surfaces, and a controlled electric accent for actions and highlights.
        </p>
        <div className="p26-token-grid" role="list" aria-label="Color tokens">
          {colorTokens.map((token) => (
            <article key={token.name} className="p26-token" role="listitem">
              <div className="p26-token-swatch" style={{ backgroundColor: token.value }} aria-hidden="true" />
              <p>{token.name}</p>
              <span>{token.value}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="p26-mosaic" aria-label="Figma-inspired layout">
        <article className="p26-card p26-profile">
          <img src="/profile.jpeg" alt="Rafael Medina" className="p26-avatar" loading="lazy" decoding="async" />
          <p className="p26-eyebrow">Product Designer</p>
          <h2>Rafael Medina</h2>
          <p>
            Designing products that align strategy, usability, and visual craft. I build with design systems, code, and fast loops.
          </p>
          <div className="p26-chip-row" aria-label="Profile tags">
            <span>Design systems</span>
            <span>Product UX</span>
            <span>Prototyping</span>
          </div>
          <ul>
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <article className="p26-card p26-dashboard" aria-label="Project dashboard preview">
          <img
            src="/Projects/6842e949e1acb44abd669218_shot-small-21.jpg"
            alt="Analytics dashboard preview"
            loading="lazy"
            decoding="async"
          />
        </article>

        <article className="p26-card p26-folder" aria-label="Asset folder tile">
          <div className="p26-folder-art" aria-hidden="true" />
          <p>Assets.serve</p>
        </article>

        <article className="p26-card p26-phone" aria-label="Mobile work preview">
          <video src="/Projects/shot-small-9.webm" autoPlay muted loop playsInline preload="metadata" />
        </article>

        <article className="p26-card p26-note">
          <p className="p26-eyebrow">Feb 22</p>
          <h3>Draft note</h3>
          <p>
            Building a portfolio as modular cards allows me to ship experiments quickly while keeping the visual language coherent.
          </p>
        </article>

        <article className="p26-card p26-social" aria-label="Social stat widget">
          <h3>Mentions</h3>
          <ul>
            <li>
              Product Lab <span>+7</span>
            </li>
            <li>
              Build.club <span>+3</span>
            </li>
            <li>
              Invite review queue <span>2 pending</span>
            </li>
          </ul>
        </article>

        <article className="p26-card p26-quote">
          <p>
            Previously I led product design at SaaS startups. Now I partner with teams that need clarity, speed, and measurable UX
            outcomes.
          </p>
          <a href="mailto:hello@rafaelmedina.me">Let&apos;s make decisive design.</a>
        </article>

        <article className="p26-card p26-polaroid" aria-label="Personal moments collage">
          <img
            src="/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg"
            alt="Polaroid style collage"
            loading="lazy"
            decoding="async"
          />
        </article>

        <article className="p26-card p26-phone-alt" aria-label="Secondary mobile preview">
          <video src="/Projects/shot-small-16.webm" autoPlay muted loop playsInline preload="metadata" />
        </article>

        <article className="p26-card p26-table" aria-label="Ops table preview">
          <img
            src="/Projects/6842e9499838ce07a751244b_shot-small-23.jpg"
            alt="Operations table"
            loading="lazy"
            decoding="async"
          />
        </article>
      </section>

      <section className="p26-resume-card" aria-label="Resume summary">
        <h2>CV Snapshot</h2>
        <p className="p26-resume-title">Senior Product Designer and Design Engineer</p>
        <p>
          9+ years shipping B2B and creator tools. I connect product thinking with implementation to reduce handoff friction and
          increase delivery speed.
        </p>
        <ul>
          <li>Led component libraries used across 4 product areas.</li>
          <li>Built reusable interaction patterns with accessibility first.</li>
          <li>Mentored designers to prototype with real data and constraints.</li>
        </ul>
      </section>

      <section className="p26-scheduler" aria-label="Discovery call schedule">
        <aside>
          <p className="p26-eyebrow">Cruical Design</p>
          <h2>Discovery Call</h2>
          <p>{todaysDate}. Book a 30-minute session to review goals and constraints.</p>
          <span className="p26-slot-duration">30m</span>
        </aside>

        <div className="p26-calendar-panel">
          <header>
            <h3>March 2026</h3>
            <p>Mon 12</p>
          </header>
          <ol className="p26-weekdays" aria-label="Days of week">
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
            <li>Sun</li>
          </ol>
          <ol className="p26-days" aria-label="Calendar days">
            {calendarDays.flat().map((day, index) => (
              <li key={`${day}-${index}`} className={day === "3" ? "is-active" : undefined}>
                {day}
              </li>
            ))}
          </ol>
        </div>

        <ul className="p26-time-list" aria-label="Available times">
          {scheduleTimes.map((time) => (
            <li key={time}>
              <button type="button">{time}</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
