// Traces what each home tile draws in its first frame into the outline its
// loading skeleton takes, and writes them to src/data/tileSkeletons.ts. The
// artwork files carry transparent or flat margins, so a placeholder in the
// file's own box does not look like the thing about to appear.
//
// Rerun when a tile's artwork changes: node scripts/build-tile-skeletons.mjs
import { execFileSync } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"
import ffmpegPath from "ffmpeg-static"
import sharp from "sharp"
import { createServer } from "vite"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const output = path.join(root, "src/data/tileSkeletons.ts")

// Long side of the analysis grid. Fine enough for a tile's outline, coarse enough
// that the shipped paths stay small: they are inlined in the prerendered page.
const GRID = 320
// How far a pixel must sit from the backdrop to count as drawn. Above the baked
// drop shadows, below the 24 levels between a white panel and its grey mat.
const COLOR_DISTANCE = 12
const OPAQUE = 160
// Bridges the gaps between a panel's text and rows so they trace as one shape.
const CLOSE_RADIUS = 0.03
// Then shaves off what is thinner than a control: connector nodes, stray labels.
const OPEN_RADIUS = 0.025
const MIN_COMPONENT = 0.004
// A shape that fills this much of its bounding box is a panel whose edge only
// looks uneven because of its contents, so it takes the clean rectangle.
const PANEL_FILL = 0.96
// Panels whose contents break up the trace: Onit's nodes and connectors around a
// window, Twilio's tab row and pale left edge.
const ALWAYS_PANEL = new Set(["preview-onit-process-builder", "preview-twilio-admiral"])
const SIMPLIFY_TOLERANCE = 1
const CORNER_RADIUS = 0.016
// These fill their frame: a phone recording is the phone's screen and a launch
// film runs to the card's edges. Tracing them only follows the footage.
const FULL_FRAME = new Set([
  "preview-protector",
  "preview-patrol",
  "preview-matcha-relaunch-film",
  "preview-turtle",
])

async function firstFrame(source) {
  const file = path.join(root, "public", source)
  if (!existsSync(file)) throw new Error(`Missing artwork: ${source}`)
  if (!/\.(webm|mp4)$/.test(source)) return readFileSync(file)
  const dir = mkdtempSync(path.join(tmpdir(), "tile-skeleton-"))
  const frame = path.join(dir, "frame.png")
  execFileSync(ffmpegPath, ["-v", "error", "-i", file, "-frames:v", "1", frame])
  const data = readFileSync(frame)
  rmSync(dir, { recursive: true })
  return data
}

async function drawnMask(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .resize(GRID, GRID, { fit: "inside" })
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const pixel = (x, y) => data.subarray((y * width + x) * 4, (y * width + x) * 4 + 4)

  const edge = []
  for (let x = 0; x < width; x += 1) edge.push(pixel(x, 0), pixel(x, height - 1))
  for (let y = 0; y < height; y += 1) edge.push(pixel(0, y), pixel(width - 1, y))
  const opaqueEdge = edge.filter((p) => p[3] >= OPAQUE)
  const buckets = new Map()
  for (const p of opaqueEdge) {
    const key = `${p[0] >> 3},${p[1] >> 3},${p[2] >> 3}`
    buckets.set(key, [...(buckets.get(key) ?? []), p])
  }
  const common = [...buckets.values()].sort((a, b) => b.length - a.length)[0] ?? []
  // A backdrop runs most of the way around the frame. Artwork that only touches
  // the edge in places must not have its own colour mistaken for one.
  const backdrop = common.length > edge.length * 0.45 ? common[0] : null

  const mask = new Uint8Array(width * height)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = pixel(x, y)
      if (p[3] < OPAQUE) continue
      if (backdrop && Math.max(Math.abs(p[0] - backdrop[0]), Math.abs(p[1] - backdrop[1]), Math.abs(p[2] - backdrop[2])) < COLOR_DISTANCE) continue
      mask[y * width + x] = 1
    }
  }
  return { mask, width, height }
}

function dilate(mask, width, height, radius) {
  const out = new Uint8Array(mask.length)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!mask[y * width + x]) continue
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = x + dx
          const ny = y + dy
          if (dx * dx + dy * dy <= radius * radius && nx >= 0 && ny >= 0 && nx < width && ny < height) out[ny * width + nx] = 1
        }
      }
    }
  }
  return out
}

// Erosion is dilation of the complement. Everything past the frame counts as
// filled, so shapes that run off the edge stay on it.
function close(mask, width, height, radius) {
  const dilated = dilate(mask, width, height, radius)
  const inverse = dilated.map((value) => 1 - value)
  return dilate(inverse, width, height, radius).map((value) => 1 - value)
}

// Keeps the outline only: a panel's interior is drawn, whatever it contains.
function fillHoles(mask, width, height) {
  const outside = new Uint8Array(mask.length)
  const stack = []
  const push = (x, y) => {
    const index = y * width + x
    if (x >= 0 && y >= 0 && x < width && y < height && !mask[index] && !outside[index]) {
      outside[index] = 1
      stack.push(x, y)
    }
  }
  for (let x = 0; x < width; x += 1) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y)
    push(width - 1, y)
  }
  while (stack.length) {
    const y = stack.pop()
    const x = stack.pop()
    push(x + 1, y)
    push(x - 1, y)
    push(x, y + 1)
    push(x, y - 1)
  }
  return outside.map((value) => 1 - value)
}

function open(mask, width, height, radius) {
  const inverse = mask.map((value) => 1 - value)
  return dilate(dilate(inverse, width, height, radius).map((value) => 1 - value), width, height, radius)
}

function solidShapes(mask, width, height, panelFill) {
  const seen = new Uint8Array(mask.length)
  const out = new Uint8Array(mask.length)
  for (let start = 0; start < mask.length; start += 1) {
    if (!mask[start] || seen[start]) continue
    const cells = []
    const stack = [start]
    seen[start] = 1
    while (stack.length) {
      const index = stack.pop()
      cells.push(index)
      const x = index % width
      for (const next of [x > 0 ? index - 1 : -1, x < width - 1 ? index + 1 : -1, index - width, index + width]) {
        if (next >= 0 && next < mask.length && mask[next] && !seen[next]) {
          seen[next] = 1
          stack.push(next)
        }
      }
    }
    if (cells.length < mask.length * MIN_COMPONENT) continue
    const xs = cells.map((index) => index % width)
    const ys = cells.map((index) => Math.floor(index / width))
    const [left, right] = [Math.min(...xs), Math.max(...xs)]
    const [top, bottom] = [Math.min(...ys), Math.max(...ys)]
    if (cells.length >= (right - left + 1) * (bottom - top + 1) * panelFill) {
      for (let y = top; y <= bottom; y += 1) out.fill(1, y * width + left, y * width + right + 1)
    } else {
      for (const index of cells) out[index] = 1
    }
  }
  return out
}

// Walks the cell edges with the filled side on the right. Holes are gone by now,
// so every loop is an outer outline.
function trace(mask, width, height) {
  const filled = (x, y) => x >= 0 && y >= 0 && x < width && y < height && mask[y * width + x] === 1
  const edges = new Map()
  const add = (ax, ay, bx, by) => {
    const key = `${ax},${ay}`
    edges.set(key, [...(edges.get(key) ?? []), [bx, by]])
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (!filled(x, y)) continue
      if (!filled(x, y - 1)) add(x, y, x + 1, y)
      if (!filled(x + 1, y)) add(x + 1, y, x + 1, y + 1)
      if (!filled(x, y + 1)) add(x + 1, y + 1, x, y + 1)
      if (!filled(x - 1, y)) add(x, y + 1, x, y)
    }
  }
  const loops = []
  while (edges.size) {
    const [startKey] = edges.keys()
    const [sx, sy] = startKey.split(",").map(Number)
    const loop = [[sx, sy]]
    let [cx, cy] = [sx, sy]
    for (;;) {
      const key = `${cx},${cy}`
      const options = edges.get(key)
      if (!options) break
      const [nx, ny] = options.pop()
      if (!options.length) edges.delete(key)
      if (nx === sx && ny === sy) break
      loop.push([nx, ny])
      cx = nx
      cy = ny
    }
    loops.push(loop)
  }
  return loops
}

function simplify(points, tolerance) {
  if (points.length < 3) return points
  let farthest = 0
  let distance = -1
  const [ax, ay] = points[0]
  const [bx, by] = points[points.length - 1]
  const length = Math.hypot(bx - ax, by - ay) || 1
  for (let i = 1; i < points.length - 1; i += 1) {
    const [x, y] = points[i]
    const d = Math.abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / length
    if (d > distance) {
      distance = d
      farthest = i
    }
  }
  if (distance <= tolerance) return [points[0], points[points.length - 1]]
  return [...simplify(points.slice(0, farthest + 1), tolerance).slice(0, -1), ...simplify(points.slice(farthest), tolerance)]
}

function simplifyLoop(loop) {
  // A closed loop has no endpoints to anchor on: split it at its farthest pair.
  const far = loop.reduce((best, p, i) => (Math.hypot(p[0] - loop[0][0], p[1] - loop[0][1]) > Math.hypot(loop[best][0] - loop[0][0], loop[best][1] - loop[0][1]) ? i : best), 0)
  const first = simplify(loop.slice(0, far + 1), SIMPLIFY_TOLERANCE)
  const second = simplify([...loop.slice(far), loop[0]], SIMPLIFY_TOLERANCE)
  return [...first.slice(0, -1), ...second.slice(0, -1)]
}

// Rounds each corner with a quadratic so the coarse grid never reads as facets.
function toPath(loop, scaleX, scaleY, radius) {
  const round = (value) => Number(value.toFixed(1))
  const scaled = loop.map(([x, y]) => [x * scaleX, y * scaleY])
  const toward = (from, to, distance) => {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1
    const amount = Math.min(distance, length / 2) / length
    return [from[0] + (to[0] - from[0]) * amount, from[1] + (to[1] - from[1]) * amount]
  }
  return scaled.map((point, i) => {
    const previous = scaled[(i + scaled.length - 1) % scaled.length]
    const next = scaled[(i + 1) % scaled.length]
    const entry = toward(point, previous, radius)
    const exit = toward(point, next, radius)
    return `${i === 0 ? "M" : "L"}${round(entry[0])} ${round(entry[1])}Q${round(point[0])} ${round(point[1])} ${round(exit[0])} ${round(exit[1])}`
  }).join("") + "Z"
}

const vite = await createServer({ root, server: { middlewareMode: true }, appType: "custom", logLevel: "error" })
const { homeGroups, portfolioCards } = await vite.ssrLoadModule("/src/data/portfolio.ts")
await vite.close()

const cards = new Map(portfolioCards.map((card) => [card.id, card]))
const shapes = {}
for (const group of homeGroups) {
  for (const item of group.items) {
    if (item.kind !== "project") continue
    const card = cards.get(item.cardId)
    // Compositions hold many images, so they have no single outline to trace.
    if (card.homeImages) continue
    const width = card.previewWidth
    const height = card.previewHeight
    if (!width || !height) continue
    if (FULL_FRAME.has(card.id)) {
      shapes[card.id] = { width, height, fullFrame: true, d: `M0 0H${width}V${height}H0Z` }
      continue
    }
    const frame = await firstFrame(card.previewPoster ?? card.image)
    const drawn = await drawnMask(frame)
    const longSide = Math.max(drawn.width, drawn.height)
    const closed = close(drawn.mask, drawn.width, drawn.height, Math.round(longSide * CLOSE_RADIUS))
    const opened = open(fillHoles(closed, drawn.width, drawn.height), drawn.width, drawn.height, Math.round(longSide * OPEN_RADIUS))
    const solid = solidShapes(opened, drawn.width, drawn.height, ALWAYS_PANEL.has(card.id) ? 0 : PANEL_FILL)
    const loops = trace(solid, drawn.width, drawn.height).map(simplifyLoop).filter((loop) => loop.length > 2)
    const scaleX = width / drawn.width
    const scaleY = height / drawn.height
    const radius = Math.max(width, height) * CORNER_RADIUS
    shapes[card.id] = { width, height, d: loops.map((loop) => toPath(loop, scaleX, scaleY, radius)).join("") }
  }
}

const rows = Object.entries(shapes).map(([id, shape]) =>
  `  "${id}": { width: ${shape.width}, height: ${shape.height},${shape.fullFrame ? " fullFrame: true," : ""} d: "${shape.d}" },`)
writeFileSync(output, `// Generated by scripts/build-tile-skeletons.mjs. Do not edit by hand.
// The outline of what each home tile draws in its first frame, in the
// coordinates of its preview box.
import type { ProjectId } from "./projectIds"

export const tileSkeletons: Partial<Record<ProjectId, { width: number; height: number; fullFrame?: boolean; d: string }>> = {
${rows.join("\n")}
}
`)
console.log(`Wrote ${rows.length} outlines, ${readFileSync(output).length} bytes`)
