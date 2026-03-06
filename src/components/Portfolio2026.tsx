import { useMemo } from "react"

const links = [
  { label: "@rafaelmedina", href: "https://x.com/rafaelmedina" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/rafaelmedina" },
  { label: "Github", href: "https://github.com/rafaelmedina" },
]

const socialRows = [
  { label: "M1 Studio", count: "+7" },
  { label: "Design Ops", count: "+3" },
  { label: "Invite review", count: "2 pending" },
]

const times = ["2:30am", "3:00am", "3:30am", "4:00am", "4:30am", "5:00am"]

const calendar = [
  ["", "", "", "", "", "1", "2"],
  ["3", "4", "5", "6", "7", "8", "9"],
  ["10", "11", "12", "13", "14", "15", "16"],
  ["17", "18", "19", "20", "21", "22", "23"],
  ["24", "25", "26", "27", "28", "29", "30"],
  ["31", "", "", "", "", "", ""],
]

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function Portfolio2026() {
  const today = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }).format(new Date()),
    [],
  )

  return (
    <div className="fg26-page">
      <section className="fg26-mosaic" aria-label="Portfolio previews">
        <article className="fg26-card fg26-profile">
          <img src="/profile.jpeg" alt="Rafael Medina" className="fg26-avatar" loading="lazy" decoding="async" />
          <h1>Rafael Medina</h1>
          <p className="fg26-role">Software Designer &amp; Engineer</p>
          <p className="fg26-copy">
            Designing digital products with visual craft and engineering rigor. Based in Santo Domingo, building across product,
            systems, and motion.
          </p>
          <ul>
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </article>

        <article className="fg26-card fg26-dashboard" aria-label="Dashboard preview">
          <img src="/Projects/6842e949e1acb44abd669218_shot-small-21.jpg" alt="Dashboard preview" loading="lazy" decoding="async" />
        </article>

        <article className="fg26-card fg26-folder" aria-label="Folder card">
          <div className="fg26-folder-icon" aria-hidden="true" />
          <p>Assets.serve</p>
        </article>

        <article className="fg26-card fg26-phone" aria-label="Mobile preview">
          <video src="/Projects/shot-small-9.webm" autoPlay muted loop playsInline preload="metadata" />
        </article>

        <article className="fg26-card fg26-note">
          <p className="fg26-note-date">Feb 22</p>
          <h2>In progress: v2 naming</h2>
          <p>Keeping card blocks modular so I can swap content quickly without redesigning the entire canvas every sprint.</p>
        </article>

        <article className="fg26-card fg26-social" aria-label="Social activity">
          <h2>Mentions</h2>
          <ul>
            {socialRows.map((row) => (
              <li key={row.label}>
                <span>{row.label}</span>
                <strong>{row.count}</strong>
              </li>
            ))}
          </ul>
        </article>

        <article className="fg26-card fg26-chart" aria-label="Chart tile">
          <img src="/Projects/6842e9492c24a449a9618900_shot-small-14.jpg" alt="Chart tile" loading="lazy" decoding="async" />
        </article>

        <article className="fg26-card fg26-quote">
          <p>
            Previously I led product design for SaaS teams. Today I work with founders to shape systems that are clear,
            measurable, and fast to ship.
          </p>
          <a href="mailto:hello@rafaelmedina.me">Let&apos;s talk about decisive design.</a>
        </article>

        <article className="fg26-card fg26-polaroid" aria-label="Polaroid preview">
          <img
            src="/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg"
            alt="Polaroid collage"
            loading="lazy"
            decoding="async"
          />
        </article>

        <article className="fg26-card fg26-phone-secondary" aria-label="Mobile secondary preview">
          <video src="/Projects/shot-small-16.webm" autoPlay muted loop playsInline preload="metadata" />
        </article>

        <article className="fg26-card fg26-table" aria-label="Table preview">
          <img src="/Projects/6842e9499838ce07a751244b_shot-small-23.jpg" alt="Data table preview" loading="lazy" decoding="async" />
        </article>
      </section>

      <div className="fg26-dots" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <section className="fg26-cv" aria-label="Resume section">
        <div className="fg26-cv-brand">0x</div>
        <div className="fg26-cv-body">
          <p className="fg26-cv-name">Rafael Medina - UX / UI / FE</p>
          <p className="fg26-cv-title">Senior Product Designer</p>
          <p>
            Designing B2B and SaaS experiences with product strategy, visual systems, and engineering collaboration.
          </p>
          <ul>
            <li>Component libraries used across multiple product surfaces.</li>
            <li>Design and handoff workflows for AI-assisted iteration.</li>
            <li>Accessibility-minded interaction patterns for web and mobile.</li>
          </ul>
          <p className="fg26-cv-project">Exclusive Dreams, FWCV - Jan 2021 to Dec 2021</p>
          <p className="fg26-cv-project-detail">
            Product Designer Consultant. Built onboarding and checkout improvements with measurable conversion lift.
          </p>
          <div className="fg26-signature" aria-hidden="true" />
        </div>
      </section>

      <div className="fg26-dots" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <section className="fg26-schedule" aria-label="Schedule panel">
        <aside className="fg26-schedule-intro">
          <p className="fg26-label">Crucial Design</p>
          <h2>Discovery Call</h2>
          <p>{today}. Book 30 minutes and we can review goals, constraints, and next steps.</p>
          <ul>
            <li>30m</li>
            <li>Google Meet</li>
            <li>America/Santo Domingo</li>
          </ul>
        </aside>

        <div className="fg26-calendar">
          <header>
            <h3>March 2026</h3>
            <p>Mon 12</p>
          </header>
          <ol className="fg26-weekdays" aria-label="Weekdays">
            {weekDays.map((day) => (
              <li key={day}>{day}</li>
            ))}
          </ol>
          <ol className="fg26-days" aria-label="Calendar days">
            {calendar.flat().map((day, index) => (
              <li key={`${day}-${index}`} className={day === "3" ? "is-active" : undefined}>
                {day}
              </li>
            ))}
          </ol>
        </div>

        <ul className="fg26-times" aria-label="Available times">
          {times.map((time) => (
            <li key={time}>
              <button type="button">{time}</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
