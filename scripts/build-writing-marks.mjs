// The notes reader's pencil marks: the brackets that hold a passage beside a
// margin note, and the stroke under an interjection.
//
// These used to be single bezier paths written by hand, and they read as
// vector geometry rather than as something drawn -- one clean stroke, the same
// curve every time. Rough.js draws each line as several overlapping passes with
// randomised bowing, the way a pen doubles back over a mark, so the output has
// the density variation and wobble a real stroke has. That is a raster
// property, not a vector one, so the marks are rendered here and shipped as
// PNGs rather than generated in the browser: the reader loads pictures of
// pencil, and no drawing library reaches production.
//
// Run `node scripts/build-writing-marks.mjs` and commit the result. Playwright
// is already a devDependency and is doing the rasterising, so nothing native
// gets built for this.
//
// The PNGs are black on transparent and are used as CSS masks, so the reader
// still colours them with `currentColor` and one asset serves any ink.

import { chromium } from "playwright"
import { mkdir, readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outDir = resolve(root, "public/writings/marks")

// The reader's own numbers: a 104px note at --text-sm over 1.35 line-height.
// A bracket is drawn at the height of the note it will hold, so the mask is
// never stretched by more than the line it guessed wrong by.
const LINE_HEIGHT = 18.9
// Wide enough for the hooks to survive being drawn: at 9px the top and bottom
// turns collapsed into the spine and every bracket read as a plain vertical
// line. The hooks are what make it a bracket rather than a rule.
const BRACKET_WIDTH = 16
const BRACKET_LINES = [1, 2, 3, 4]
// A one-line note gets a mark taller than its text so the hooks have somewhere
// to turn; below about 26px the two ends meet and close into a blob.
const MIN_BRACKET_HEIGHT = 30
// Three of each, so a run of notes down one edge is not the same mark repeated.
const VARIANTS = ["a", "b", "c"]
const UNDERLINE = { width: 72, height: 10 }

// Rough.js needs a seed to be repeatable; without one every run would produce
// different artwork and the committed PNGs would churn on every build.
const seedFor = (name, index) => [...name].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, index + 1) >>> 0

async function main() {
  await mkdir(outDir, { recursive: true })
  const rough = await readFile(resolve(root, "node_modules/roughjs/bundled/rough.js"), "utf8")

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 400, height: 200 }, deviceScaleFactor: 3 })
  await page.setContent('<!doctype html><html><body style="margin:0;background:transparent"><div id="stage"></div></body></html>')
  await page.addScriptTag({ content: rough })

  const written = []

  for (const lines of BRACKET_LINES) {
    for (const [index, variant] of VARIANTS.entries()) {
      const height = Math.max(MIN_BRACKET_HEIGHT, Math.round(LINE_HEIGHT * lines))
      const name = `bracket-${lines}-${variant}.png`
      await draw(page, {
        width: BRACKET_WIDTH,
        height,
        seed: seedFor(name, index),
        shape: "bracket",
      })
      await shoot(page, name)
      written.push(name)
    }
  }

  for (const [index, variant] of VARIANTS.entries()) {
    const name = `underline-${variant}.png`
    await draw(page, { ...UNDERLINE, seed: seedFor(name, index), shape: "underline" })
    await shoot(page, name)
    written.push(name)
  }

  await browser.close()
  console.log(`Wrote ${written.length} marks to public/writings/marks/`)
}

// Drawn inside the page so Rough.js runs against a real SVG element.
async function draw(page, options) {
  await page.evaluate(({ width, height, seed, shape }) => {
    const svgNS = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(svgNS, "svg")
    svg.setAttribute("width", String(width))
    svg.setAttribute("height", String(height))
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
    const stage = document.getElementById("stage")
    stage.replaceChildren(svg)

    const rc = rough.svg(svg)
    // Two passes with neighbouring seeds: the second retraces the first
    // slightly off, which is what gives a pen mark its doubled edge and its
    // uneven density. Both sit under full opacity so the overlap darkens.
    const passes = [
      { seed, opacity: 0.9, strokeWidth: 1.35 },
      { seed: seed + 1, opacity: 0.45, strokeWidth: 1 },
    ]

    for (const pass of passes) {
      // Rough.js at its defaults (roughness 1, bowing 1) already doubles and
      // wobbles every line. Pushed past about 1.4 it stops reading as a drawn
      // mark and starts reading as a scribble, and small turns like a
      // bracket's hooks dissolve entirely.
      const options = {
        stroke: "#000",
        strokeWidth: pass.strokeWidth,
        roughness: 1.05,
        // An underline is one long stroke and reads as ruled unless it is
        // allowed to wander; a bracket's short segments need the opposite.
        bowing: shape === "underline" ? 2.2 : 1.1,
        seed: pass.seed % 2 ** 31,
        disableMultiStroke: false,
      }
      let node
      if (shape === "bracket") {
        // A ] closing around the column: hook in along the top, down the
        // spine, hook back out along the bottom. The hooks run most of the
        // width so they stay legible once the stroke has wandered.
        const hook = 1.5
        const spine = width - 2
        node = rc.path(
          `M${hook} 1.5 L${spine - 1.5} 2.5 C${spine} 3 ${spine} 4 ${spine} 5.5` +
            ` L${spine} ${height - 5.5} C${spine} ${height - 4} ${spine} ${height - 3} ${spine - 1.5} ${height - 2.5}` +
            ` L${hook} ${height - 1.5}`,
          options,
        )
      } else {
        // One flat stroke with a little lift in the middle. The underline sits
        // beneath handwriting, so it has to stay a line: given curvature to
        // play with, Rough.js crosses it over itself and it reads as a
        // strike-through instead.
        node = rc.path(
          `M2 ${height - 4} C${width * 0.3} ${height - 5.5} ${width * 0.6} ${height - 3.5} ${width - 2} ${height - 5}`,
          options,
        )
      }
      node.setAttribute("opacity", String(pass.opacity))
      svg.appendChild(node)
    }
  }, options)
}

async function shoot(page, name) {
  const stage = page.locator("#stage svg")
  await stage.screenshot({ path: resolve(outDir, name), omitBackground: true })
}

await main()
