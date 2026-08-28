// Builds public/rafael-medina-resume.pdf.
//
// The résumé used to be a Figma export, which meant the downloadable PDF drifted
// away from the live site every time src/data/cv.ts changed. This script renders
// the same content as HTML and prints it with Chromium, so the file is
// regenerated from source instead of re-exported by hand.
//
//   node scripts/build-resume.mjs
//
// It is deliberately NOT part of `npm run build`: the PDF is a committed asset in
// public/, and a build should not need a browser to produce it. Run this after
// editing the résumé content below or src/data/cv.ts, then commit the result.
//
// Work history, dates, and education mirror src/data/cv.ts; the per-role bullets
// are the longer form carried over from the previous PDF. The contact address is
// siteLinks.email in src/data/portfolio.ts — keep all three in step.

import { mkdtemp, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { chromium } from "playwright-core"

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outputPath = join(rootDir, "public", "rafael-medina-resume.pdf")

const profile = {
  name: "Rafael Medina",
  title: "Senior Product Designer",
  email: "hey@rafaelmedina.me",
  phone: "+1 (829) 786 9580",
  location: "NYC / Santo Domingo",
}

const links = ["rafaelmedina.me", "dribbble.com/rafaelmedian", "linkedin.com/in/rafaelmedian"]

const work = [
  {
    company: "Startup",
    place: "Remote",
    dates: "2026 - Present",
    role: "Co-founder",
    bullets: [
      "Building a mobile wallet for colmados, helping neighborhood store owners in the Dominican Republic manage payments and day-to-day finances from their phones.",
    ],
  },
  {
    company: "0x Project",
    place: "Remote, SF",
    dates: "Dec 2021 - March 2026",
    role: "Senior Product Designer",
    bullets: [
      "Redesigned Matcha.xyz DEX aggregator from scratch, introducing monetization flows that generated sustainable revenue.",
      "Designed and shipped the 0x API dashboard in 5 weeks; directly contributed to scaling API revenue to $100K+/month.",
      "Led marketing design strategy for 12 months: campaigns, video content, and web experiences that increased developer adoption.",
    ],
  },
  {
    company: "BoldVoice",
    place: "Remote, NYC",
    dates: "July 2021 - December 2021",
    role: "Product Designer (Contract)",
    bullets: [
      "Sole designer for an accent-training mobile app with 50K+ users; partnered directly with a single developer to ship growth experiments.",
      "Prioritized high-ROI feature improvements over a full redesign, maximizing impact with limited resources.",
    ],
  },
  {
    company: "Moody's",
    place: "Remote, NYC",
    dates: "Jan 2021 - July 2021",
    role: "Product Designer (Contract)",
    bullets: [
      "Redesigned financial-analysis tools for institutional analysts, improving data discovery and workflow efficiency.",
      "Shaped UX for company profiles and government entity features used by thousands of financial professionals.",
    ],
  },
  {
    company: "TM [Chainlink & Twilio]",
    place: "Remote, Los Angeles",
    dates: "Dec 2018 - Dec 2020",
    role: "Product Designer & Frontend Developer",
    bullets: [
      "Chainlink: collaborated with the Design Director on internal tools and the brand system for a leading blockchain oracle network.",
      "Twilio: led a complete redesign of the developer tools platform; conducted user interviews and UX research to inform decisions.",
      "Onit: rebuilt the drag-and-drop logic builder with React, improving usability for legal workflow automation.",
    ],
  },
  {
    company: "Incubeta [Google]",
    place: "Remote, NYC",
    dates: "Jan 2018 - May 2018",
    role: "Product Designer & Developer (Contract)",
    bullets: [
      "Designed Google Edu Directory (edudirectory.withgoogle.com), connecting schools globally with certified Google trainers.",
    ],
  },
]

const education = [
  {
    school: "CCI Program - NOVA Community College",
    place: "Washington, DC",
    detail: "Computer Science · 2016 - 2018",
    note: "U.S. State Dept. scholarship recipient (1 of 5 from the Dominican Republic).",
  },
  {
    school: "ITLA - Las Américas Institute of Technology",
    place: "Dominican Republic",
    detail: "Associate's, Computer Science · 2015",
    note: "GPA 3.8, Full Scholarship.",
  },
]

const skills = {
  Design: ["Web3/DeFi products", "Figma", "Prototyping", "Web/Mobile", "Animation with Jitter, Rive"],
  Development: ["TypeScript, React", "Webflow, Framer", "AI-assisted development (Cursor, Claude Code, Codex)"],
}

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const workHtml = work
  .map(
    (job) => `
      <article class="entry">
        <div class="entry-head">
          <h3>${escapeHtml(job.company)} <span class="place">(${escapeHtml(job.place)})</span></h3>
          <span class="dates">${escapeHtml(job.dates)}</span>
        </div>
        <p class="role">${escapeHtml(job.role)}</p>
        <ul>${job.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
      </article>`,
  )
  .join("")

const educationHtml = education
  .map(
    (item) => `
      <article class="entry">
        <div class="entry-head">
          <h3>${escapeHtml(item.school)} <span class="place">(${escapeHtml(item.place)})</span></h3>
          <span class="dates">${escapeHtml(item.detail)}</span>
        </div>
        <p class="note">${escapeHtml(item.note)}</p>
      </article>`,
  )
  .join("")

const skillsHtml = Object.entries(skills)
  .map(
    ([group, items]) => `
      <div class="skill-group">
        <h3>${escapeHtml(group)}</h3>
        <p>${items.map(escapeHtml).join(" · ")}</p>
      </div>`,
  )
  .join("")

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Rafael Medina — Product Designer — Résumé</title>
    <style>
      @page { size: letter; margin: 0; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 14mm 15mm 12mm;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 8.7pt;
        line-height: 1.35;
        color: #171717;
        -webkit-font-smoothing: antialiased;
      }
      a { color: inherit; text-decoration: none; }
      header { display: flex; align-items: baseline; justify-content: space-between; gap: 12pt; }
      h1 { margin: 0; font-size: 16pt; letter-spacing: -0.01em; }
      h1 span { font-weight: 400; color: #575757; }
      .contact { text-align: right; color: #575757; font-size: 8.6pt; line-height: 1.5; }
      .contact strong { color: #171717; font-weight: 600; }
      hr { border: 0; border-top: 1px solid #e0e0e0; margin: 10pt 0 8pt; }
      h2 {
        margin: 0 0 6pt;
        font-size: 7.9pt;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #575757;
        font-weight: 600;
      }
      .entry { margin: 0 0 8pt; break-inside: avoid; }
      .entry:last-child { margin-bottom: 0; }
      .entry-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10pt; }
      .entry-head h3 { margin: 0; font-size: 9.4pt; font-weight: 600; }
      .place { font-weight: 400; color: #575757; }
      .dates { flex: none; color: #575757; font-size: 8.6pt; white-space: nowrap; }
      .role { margin: 1pt 0 3pt; color: #383838; font-style: italic; }
      ul { margin: 0; padding-left: 12pt; }
      li { margin: 0 0 2pt; text-wrap: pretty; }
      .note { margin: 1pt 0 0; color: #575757; text-wrap: pretty; }
      .skills { display: flex; gap: 18pt; }
      .skill-group { flex: 1; }
      .skill-group h3 { margin: 0 0 3pt; font-size: 8.8pt; font-weight: 600; }
      .skill-group p { margin: 0; color: #383838; text-wrap: pretty; }
      footer { margin-top: 10pt; padding-top: 6pt; border-top: 1px solid #e0e0e0; color: #575757; font-size: 8.2pt; }
    </style>
  </head>
  <body>
    <header>
      <h1>${escapeHtml(profile.name)} <span>· ${escapeHtml(profile.title)}</span></h1>
      <div class="contact">
        <div><strong>${escapeHtml(profile.email)}</strong></div>
        <div>${escapeHtml(profile.phone)} · ${escapeHtml(profile.location)}</div>
      </div>
    </header>

    <hr />
    <section>
      <h2>Work</h2>
      ${workHtml}
    </section>

    <hr />
    <section>
      <h2>Education</h2>
      ${educationHtml}
    </section>

    <hr />
    <section>
      <h2>Skills</h2>
      <div class="skills">${skillsHtml}</div>
    </section>

    <footer>${[profile.email, ...links].map(escapeHtml).join(" · ")}</footer>
  </body>
</html>`

const workDir = await mkdtemp(join(tmpdir(), "resume-"))
const htmlPath = join(workDir, "resume.html")
await writeFile(htmlPath, html, "utf-8")

const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" })

  // `tagged` keeps the structure tree, so the résumé stays screen-reader
  // navigable the way the previous PDF/UA export from Figma was.
  const pdf = await page.pdf({
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
    tagged: true,
  })

  // A résumé that spills onto a second page is a regression, not a variant, so
  // check before overwriting the shipped file rather than after.
  const pageCount = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length
  if (pageCount !== 1) {
    throw new Error(`Expected a single-page résumé, produced ${pageCount} pages. Tighten the content or type scale.`)
  }

  await writeFile(outputPath, pdf)

  console.log(`Wrote ${outputPath} (${(pdf.length / 1024).toFixed(0)} KB, ${pageCount} page)`)
} finally {
  await browser.close()
  await rm(workDir, { recursive: true, force: true })
}
