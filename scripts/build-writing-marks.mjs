// The notes folder's pencil: the brackets that hold a passage beside a margin
// note, the stroke under an interjection, and the objects drawn into the
// archive's empty gutters.
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

// The archive's gutters get objects rather than marks: the things a note gets
// written with. They are drawn at the 88px the gutter gives them, which is
// small enough that the roughness the brackets take pulls a cup's handle off
// its body -- see the drawing tuning in `draw` below. The paths themselves are
// the outline only; everything that makes them read as drawn rather than
// traced happens on the way through Rough.js.
const DRAWING_SIZE = 88
// Each object ships as a strip of frames, side by side in one PNG. The first is
// the drawing at rest; hovered, the archive steps through the rest the way a
// stop-motion drawing boils between exposures. Every frame is the same outline
// retraced by Rough.js on a seed of its own, then set back down a hair off
// where the last one lay -- the wobble changes, the object does not. Moved by
// more than a pixel or a degree and a frame reads as the object jumping rather
// than as the line being redrawn. One file rather than one per frame, so the
// frames arrive with the drawing and the first hover has nothing to wait on.
const DRAWING_FRAMES = [
  { dx: 0, dy: 0, turn: 0 },
  { dx: 0.6, dy: -0.4, turn: -1.1 },
  { dx: -0.5, dy: 0.35, turn: 0.9 },
]
const DRAWINGS = {
  // A written-on sheet with the corner turned down, a second page behind it,
  // and three strokes of shadow where it lifts off the desk.
  sheet: [
    "M31.2 15.4C42.4 13.9 53.6 13.2 64.8 13.4 64.6 16.6 64.9 19.6 65.8 22.2 66.7 24.8 68.2 26.8 70.2 28.2 70.6 41.6 70.2 55 69 68.4 57.6 70.4 46 71.6 34.4 72.1 32.4 53.2 31.4 34.3 31.2 15.4Z",
    "M64.8 13.4C67.4 16 69.2 18.4 70.2 28.2 68 27.6 66.2 26.6 64.9 25.1 63.6 23.6 62.9 21.6 62.8 19.2 64 17.3 64.7 15.4 64.8 13.4Z",
    "M37.4 25.6C44.2 24.6 51.1 23.9 58 23.6",
    "M37.8 33.4C45 32.4 52.2 31.7 59.4 31.4 60.9 31.3 62.4 31.3 63.9 31.3",
    "M38.2 41.2C45.4 40.2 52.7 39.5 60 39.2 61.5 39.1 63 39.1 64.5 39.1",
    "M38.6 49C45.4 48.1 52.2 47.4 59 47.1",
    "M39 56.8C44.6 56 50.2 55.5 55.8 55.2",
    "M25.2 18.4C24.6 36.6 25.4 54.8 27.6 72.9 28.7 72.7 29.9 72.5 31.1 72.3",
    "M20.2 66.4C22.8 68.4 25.4 70.4 28 72.4",
    "M20.6 70C22.4 71.4 24.2 72.8 26 74.2",
    "M22.2 74.6C23.4 75.6 24.6 76.5 25.8 77.4",
  ],
  // Sharpened, three-quarter view: two long facets, the ferrule's two bands, the
  // graphite showing at the point, and the shavings it left.
  pencil: [
    "M20.3 73.7C21.2 70.6 22.2 67.8 23.3 65.3",
    "M20.3 73.7C23.2 72.6 26 71.6 28.7 70.7",
    "M23.3 65.3C35.9 53 48.6 40.7 61.3 27.3",
    "M28.7 70.7C41.2 58.4 53.9 46.1 66.7 32.7",
    "M26.2 67.8C37.9 56.2 49.6 44.7 61.4 33.2",
    "M56 32.6C57.8 34.4 59.6 36.2 61.4 38",
    "M58.6 30C60.4 31.8 62.2 33.6 64 35.4",
    "M61.3 27.3C63.4 24.6 67 23.8 69.3 25.6 71.6 27.4 71 30.7 66.7 32.7",
    "M21.7 69.9C22.5 70.9 23.3 71.9 24.1 72.9",
    "M12.6 79.4C13.4 76.8 15.6 75 17.8 75.4 19.4 75.7 20.2 77 19.8 78.4 19.4 79.8 17.8 80.4 16.6 79.6 15.8 79 15.6 77.8 16.2 77",
    "M29.4 78.6C30.6 76.6 32.8 76 34.2 77.2 35.4 78.2 35.2 79.8 33.8 80.4 32.8 80.8 31.8 80.2 31.8 79.2",
  ],
  // A cup on its saucer, the rim drawn as an ellipse rather than a line, with
  // three strokes down its shaded side and two of steam.
  cup: [
    "M25.4 36.8C36.4 35.6 47.4 35.6 58.4 36.8 58.6 46.4 57.6 54.4 55.4 60.8 53.8 65.4 50.4 67.9 45.6 68.4 40.8 68.9 36.6 67.2 34 63.4 31.2 59.4 29.4 54 28.2 47.6 27.4 43.6 26.4 40 25.4 36.8Z",
    "M25.4 36.8C30.2 34.6 36.4 33.6 42 33.6 47.6 33.6 53.6 34.6 58.4 36.8 53.6 38.8 47.8 39.7 42 39.7 36.2 39.7 30.2 38.8 25.4 36.8Z",
    "M58.8 42.4C63 40.7 66.8 41.4 68.4 44.4 70 47.5 68.8 51.4 65.4 53.6 63.2 55 60.2 55.6 57 55.4",
    "M52.4 46.4C52.8 51.6 52 56.2 50.2 60",
    "M56.2 45.4C56.4 50.4 55.8 54.8 54.4 58.4",
    "M48.6 47C49.2 52.2 48.6 57 46.8 61",
    "M35.8 27C38.4 24.2 35.4 21.4 37 18 37.8 16.2 39 15.2 40.2 14.6",
    "M44.6 28.2C47.2 25.4 44.2 22.6 45.8 19.2 46.4 18 47.2 17.2 48 16.7",
    "M30.4 73.2C38.4 74.8 47.6 74.8 55.6 73.2",
    "M32.6 76C39.6 77.2 46.6 77.2 53.6 76",
  ],
  // A page lifted out of a folder while a pencil finishes its last line. This
  // belongs to the Tools shelf: the note is still writing itself as the thing
  // inside it becomes something another person can use. It stays after the
  // original drawings so their index-derived seeds remain byte-stable.
  "folder-pencil": [
    "M27 15.4C37.2 14.5 47.4 14.2 57.6 14.6 58.4 28.4 59.1 42.2 59.5 56 49.3 56.8 39.1 57.1 28.9 56.7 28.4 42.9 27.8 29.1 27 15.4Z",
    "M32.8 24.4C39.2 23.7 45.6 23.5 52 23.8",
    "M33.2 31.8C39.5 31.1 45.8 30.9 52.1 31.2",
    "M33.5 39.2C38.6 38.6 43.8 38.4 49 38.6",
    "M13.8 42.4C13.8 37.9 14 33.4 14.5 28.9 22.2 28.4 29.9 28.4 37.6 28.9 40 31.8 42.4 34.7 44.8 37.6 54.7 37.3 64.6 37.6 74.5 38.4",
    "M12.4 43.8C32.9 42.8 53.4 42.7 73.9 43.6 72.4 54 70.6 64.3 68.5 74.5 51.8 75.7 35.1 75.8 18.4 74.8 16.1 64.6 14.1 54.3 12.4 43.8Z",
    "M23.4 51.7C35.8 51 48.2 50.9 60.6 51.5",
    "M61.3 39.6C65.1 34.8 69 30.1 73 25.5",
    "M65.2 43C69 38.1 72.9 33.4 76.9 28.7",
    "M73 25.5C75.1 22.5 78.2 22 80.1 23.7 82 25.4 80.9 28.2 76.9 28.7",
    "M61.3 39.6C61.7 41.2 63 42.4 65.2 43 63.4 44.1 61.7 45.1 60 46.1 60.4 43.9 60.8 41.7 61.3 39.6Z",
    "M59.8 46.2C58.9 46.8 58.1 47.4 57.2 48",
  ],
}

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

  for (const [index, [object, paths]] of Object.entries(DRAWINGS).entries()) {
    // Seeded off the name the single frame had, so the drawing at rest is the
    // one the archive has always shown and only the hover frames are new.
    const name = `drawing-${object}-frames.png`
    await draw(page, {
      width: DRAWING_SIZE,
      height: DRAWING_SIZE,
      seed: seedFor(`drawing-${object}.png`, index),
      shape: "drawing",
      paths,
      frames: DRAWING_FRAMES,
    })
    await shoot(page, name)
    written.push(name)
  }

  await browser.close()
  console.log(`Wrote ${written.length} marks to public/writings/marks/`)
}

// Drawn inside the page so Rough.js runs against a real SVG element.
async function draw(page, options) {
  await page.evaluate(({ width, height, seed, shape, paths, frames = [{ dx: 0, dy: 0, turn: 0 }] }) => {
    const svgNS = "http://www.w3.org/2000/svg"
    const svg = document.createElementNS(svgNS, "svg")
    const stripWidth = width * frames.length
    svg.setAttribute("width", String(stripWidth))
    svg.setAttribute("height", String(height))
    svg.setAttribute("viewBox", `0 0 ${stripWidth} ${height}`)
    const stage = document.getElementById("stage")
    stage.replaceChildren(svg)

    const rc = rough.svg(svg)
    // Two passes with neighbouring seeds: the second retraces the first
    // slightly off, which is what gives a pen mark its doubled edge and its
    // uneven density. Both sit under full opacity so the overlap darkens.
    // A drawing is many more lines than a mark is, and they meet at corners; at
    // the marks' weight the object fills in and reads as a blot at 88px, so
    // both passes come down and the second is a ghost rather than a retrace.
    const passes = shape === "drawing"
      ? [
          { seed, opacity: 0.85, strokeWidth: 1 },
          { seed: seed + 1, opacity: 0.35, strokeWidth: 0.8 },
        ]
      : [
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
        // The marks are 16px and 72px of nothing but stroke, and can take the
        // wobble. A drawing has to survive being a recognisable object at
        // 88px: at 1.05 the cup's handle came away from its body and the
        // sheet's ruled lines curled into scribble, so the drawings take
        // roughly half of it and half the bowing with it.
        roughness: shape === "drawing" ? 0.55 : 1.05,
        // An underline is one long stroke and reads as ruled unless it is
        // allowed to wander; a bracket's short segments need the opposite.
        bowing: shape === "underline" ? 2.2 : shape === "drawing" ? 0.6 : 1.1,
        seed: pass.seed % 2 ** 31,
        disableMultiStroke: false,
      }
      let node
      if (shape === "drawing") {
        // One node per path, all under the pass's opacity: an object is a set
        // of separate strokes, not one figure, and Rough.js seeds each from
        // the one it is given so no two lines wobble the same way. Each frame
        // takes its own cell of the strip, turned about the cell's centre;
        // the first keeps the pass's own seeds, so it is the resting drawing.
        for (const [frameIndex, frame] of frames.entries()) {
          const cell = document.createElementNS(svgNS, "g")
          cell.setAttribute(
            "transform",
            `translate(${frameIndex * width + frame.dx} ${frame.dy}) rotate(${frame.turn} ${width / 2} ${height / 2})`,
          )
          for (const [index, d] of paths.entries()) {
            const stroke = rc.path(d, { ...options, seed: (pass.seed + index * 17 + frameIndex * 7919) % 2 ** 31 })
            stroke.setAttribute("opacity", String(pass.opacity))
            cell.appendChild(stroke)
          }
          svg.appendChild(cell)
        }
        continue
      }
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
