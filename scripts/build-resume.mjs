// Builds public/rafael-medina-resume.pdf and its hover-preview image.
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
// Work history, dates, and education mirror src/data/cv.ts. The contact address
// is siteLinks.email in src/data/portfolio.ts — keep all three in step.
//
// The sheet is set the way the site reads: Inter, one size, two weights, the
// site's greys. Every bullet is written to fit a single line of the measure,
// and the script refuses to write if one wraps or the content spills past the
// first page -- a résumé that wraps or runs long is a regression, not a variant.

import { mkdtemp, writeFile, rm } from "node:fs/promises"
import { createRequire } from "node:module"
import { tmpdir } from "node:os"
import { join, resolve, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { chromium } from "playwright-core"

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outputPath = join(rootDir, "public", "rafael-medina-resume.pdf")
const previewPath = join(rootDir, "public", "rafael-medina-resume-preview.png")

// The site's own stack leads with Inter but never loads it; the PDF embeds the
// variable face from the package so the sheet prints the same everywhere.
const require = createRequire(import.meta.url)
const fontUrl = pathToFileURL(require.resolve("@fontsource-variable/inter/files/inter-latin-wght-normal.woff2")).href

const profile = {
  name: "Rafael Medina",
  title: "Senior Product Designer",
  email: "hey@rafaelmedina.me",
  location: "NYC / Santo Domingo",
}

const links = [
  { label: "rafaelmedina.me", href: "https://rafaelmedina.me" },
  { label: "linkedin.com/in/rafaelmedian", href: "https://www.linkedin.com/in/rafaelmedian" },
]

const work = [
  {
    company: "Stealth fintech",
    place: "Remote",
    dates: "2026 - Present",
    role: "Co-founder",
    bullets: ["Building a mobile wallet for colmados, the corner stores of the Dominican Republic."],
  },
  {
    company: "0x Project",
    place: "Remote, SF",
    dates: "Dec 2021 - March 2026",
    role: "Senior Product Designer",
    bullets: [
      "Redesigned Matcha.xyz from scratch, adding monetization flows that generated revenue.",
      "Shipped the 0x API dashboard in 5 weeks; helped scale API revenue to $100K+/month.",
      "Led marketing design for a year: campaigns, video, and web that grew adoption.",
    ],
  },
  {
    company: "BoldVoice",
    place: "Remote, NYC",
    dates: "July 2021 - Dec 2021",
    role: "Product Designer (Contract)",
    bullets: [
      "Sole designer for an accent-training app with 50K+ users, pairing with one developer.",
      "Prioritized high-ROI improvements over a full redesign to maximize impact.",
    ],
  },
  {
    company: "Moody's",
    place: "Remote, NYC",
    dates: "Jan 2021 - July 2021",
    role: "Product Designer (Contract)",
    bullets: [
      "Redesigned financial-analysis tools for institutional analysts, improving data discovery.",
      "Shaped UX for company profiles and government entities used by thousands of analysts.",
    ],
  },
  {
    company: "TM (Chainlink & Twilio)",
    place: "Remote, Los Angeles",
    dates: "Dec 2018 - Dec 2020",
    role: "Product Designer & Frontend Developer",
    bullets: [
      "Chainlink: partnered with the Design Director on internal tools and the brand system.",
      "Twilio: led a full redesign of the developer tools platform, grounded in user interviews.",
      "Onit: rebuilt the logic builder in React. Design engineering, before AI took over.",
    ],
  },
  {
    company: "Incubeta (Google)",
    place: "Remote, NYC",
    dates: "Jan 2018 - May 2018",
    role: "Product Designer & Developer (Contract)",
    bullets: ["Designed Google Edu Directory, connecting schools with certified Google trainers."],
  },
]

const education = [
  {
    school: "CCI Program - NOVA Community College",
    place: "Washington, DC",
    dates: "2016 - 2018",
    note: "Computer Science · U.S. State Department scholarship recipient",
  },
  {
    school: "ITLA - Las Américas Institute of Technology",
    place: "Dominican Republic",
    dates: "2015",
    note: "Associate's, Computer Science · GPA 3.8, full scholarship",
  },
]

const skills = [
  { group: "Design", items: ["Web3/DeFi products", "Figma", "Prototyping", "Web/Mobile", "Animation with Jitter, Rive"] },
  { group: "Development", items: ["TypeScript, React", "Webflow, Framer", "Claude Code, Conductor, Codex Cloud"] },
]

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

// "Dec 2021 - March 2026" is set over two lines, the dash closing the first.
const datesHtml = (range) => {
  const [from, to] = range.split(" - ")
  return to ? `<p>${escapeHtml(from)} –</p><p>${escapeHtml(to)}</p>` : `<p>${escapeHtml(from)}</p>`
}

// Each entry writes its copy before its dates: the grid paints the dates in
// the left column, but the company leads the entry in the PDF's text layer
// and for a screen reader.
const workHtml = work
  .map(
    (job) => `
      <li>
        <div class="body">
          <h3 class="company">${escapeHtml(job.company)} <span class="place">· ${escapeHtml(job.place)}</span></h3>
          <p class="role">${escapeHtml(job.role)}</p>
          <ul class="points">${job.bullets.map((bullet) => `<li class="one-line">${escapeHtml(bullet)}</li>`).join("")}</ul>
        </div>
        <div class="rail">${datesHtml(job.dates)}</div>
      </li>`,
  )
  .join("")

const educationHtml = education
  .map(
    (item) => `
      <li>
        <div class="body">
          <h3 class="company">${escapeHtml(item.school)} <span class="place">· ${escapeHtml(item.place)}</span></h3>
          <p class="one-line">${escapeHtml(item.note)}</p>
        </div>
        <div class="rail">${datesHtml(item.dates)}</div>
      </li>`,
  )
  .join("")

const skillsHtml = skills
  .map(
    ({ group, items }) => `
      <div>
        <h3 class="rail group">${escapeHtml(group)}</h3>
        <p class="body one-line">${items.map(escapeHtml).join(" · ")}</p>
      </div>`,
  )
  .join("")

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Rafael Medina — Product Designer — Résumé</title>
    <style>
      @font-face {
        font-family: "Inter Variable";
        src: url("${fontUrl}") format("woff2");
        font-weight: 100 900;
        font-style: normal;
      }
      @page { size: letter; margin: 0; }
      /* The site's inks: --ink, the About sheet's title grey and body grey,
         --muted-soft, and its hairline. */
      :root {
        --title: #2d2d2d;
        --body: #545454;
        --muted: #6b6b6b;
        --muted-soft: #757575;
        --hairline: rgb(0 0 0 / 0.08);
      }
      * { box-sizing: border-box; }
      html, body { margin: 0; }
      body {
        width: 816px;
        height: 1056px;
        overflow: hidden;
        padding: 56px 60px 52px;
        font-family: "Inter Variable", sans-serif;
        /* One size for the whole sheet: the site's --text-xs on its 1.5 leading. */
        font-size: 12px;
        line-height: 1.5;
        color: var(--body);
        -webkit-font-smoothing: antialiased;
        /* Inter's contextual alternates print as glyphs with no Unicode mapping,
           so the PDF's text layer would lose the hyphen in "2026 - Present". */
        font-feature-settings: "calt" 0;
      }
      a { color: inherit; text-decoration: none; }
      h1, h2, h3, p, ul, ol { margin: 0; padding: 0; font-size: inherit; font-weight: inherit; }
      ul, ol { list-style: none; }
      p, li, h3 { text-wrap: pretty; }
      /* Two weights: the company, the school, and the skill group carry 600. */
      .company, .group { font-weight: 600; }

      /* The header is set light throughout: one weight, one grey, the name only
         a step darker. The work below is what should carry the weight. */
      header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--hairline); }
      header, .contact a { color: var(--muted-soft); }
      h1 { color: var(--title); }
      .contact { text-align: right; }

      section { padding-top: 26px; }
      section + section { margin-top: 26px; border-top: 1px solid var(--hairline); }

      /* Dates hang alone in a column of their own, the range broken over two
         lines, so the copy never shares a line with them. */
      .entries { display: grid; gap: 24px; }
      .entries > li, .skills > div { display: grid; grid-template-columns: 96px 1fr; column-gap: 24px; }
      .rail { grid-column: 1; grid-row: 1; color: var(--muted-soft); }
      .body { grid-column: 2; grid-row: 1; }
      .place { color: var(--muted-soft); font-weight: 400; }
      .company { color: var(--title); }
      .role { color: var(--muted); }
      .points { margin-top: 6px; display: grid; gap: 3px; }
      .points li { padding-left: 14px; }
      /* A mark just strong enough to show where a line starts. It sits in the
         line rather than being positioned: a positioned item is painted in a
         later pass, which put every bullet after the skills in the text layer. */
      .points li::before { content: ""; display: inline-block; width: 3px; height: 3px; margin: 0 10px 0.18em -13px; border-radius: 50%; background: #d9d9d9; vertical-align: baseline; }

      .skills { display: grid; gap: 8px; }
      .group { color: var(--title); }
    </style>
  </head>
  <body>
    <header>
      <div>
        <h1>${escapeHtml(profile.name)}</h1>
        <p>${escapeHtml(profile.title)}</p>
      </div>
      <div class="contact">
        <p><a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a> · ${escapeHtml(profile.location)}</p>
        <p>${links.map((link) => `<a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join(" · ")}</p>
      </div>
    </header>

    <section>
      <ol class="entries" aria-label="Work">${workHtml}</ol>
    </section>

    <section>
      <ul class="entries" aria-label="Education">${educationHtml}</ul>
    </section>

    <section>
      <div class="skills" aria-label="Skills">${skillsHtml}</div>
    </section>
  </body>
</html>`

const workDir = await mkdtemp(join(tmpdir(), "resume-"))
const htmlPath = join(workDir, "resume.html")
await writeFile(htmlPath, html, "utf-8")

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 } })
  await page.emulateMedia({ media: "print" })
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" })
  await page.evaluate(() => document.fonts.ready)

  // Every `.one-line` was written to fit the measure; measure it rather than
  // trust it, and find the lowest painted text so the page can't quietly clip.
  const { wrapped, bottom } = await page.evaluate(() => {
    const lineHeight = parseFloat(getComputedStyle(document.body).lineHeight)
    const wrapped = [...document.querySelectorAll(".one-line")]
      .filter((el) => el.getBoundingClientRect().height > lineHeight * 1.5)
      .map((el) => el.textContent.trim())
    let bottom = 0
    for (const el of document.body.querySelectorAll("*")) {
      const rect = el.getBoundingClientRect()
      if (rect.height > 0 && el.children.length === 0) bottom = Math.max(bottom, rect.bottom)
    }
    return { wrapped, bottom }
  })
  if (wrapped.length > 0) {
    throw new Error(`These lines wrap; shorten them:\n  ${wrapped.join("\n  ")}`)
  }
  const pageBottom = 1056 - 52
  if (bottom > pageBottom) {
    throw new Error(`Content reaches ${Math.round(bottom)}px, past the ${pageBottom}px bottom margin. Tighten the spacing or the copy.`)
  }

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
  // Letter at 96dpi, using the same print styles and content as the PDF.
  await page.screenshot({ path: previewPath })

  console.log(`Wrote ${outputPath} (${(pdf.length / 1024).toFixed(0)} KB, ${pageCount} page, text to ${Math.round(bottom)}px)`)
} finally {
  await browser.close()
  await rm(workDir, { recursive: true, force: true })
}
