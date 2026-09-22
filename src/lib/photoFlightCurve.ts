import { PHOTO_WALL_WARP_SCALE, photoWallDisplacement, curvedPhotoWallStages } from "./photoWallWarp"

let nextCurve = 0

/** Warp the complete DOM flight layer with the resting wall's displacement.
 * SVG preserves each moving print's crop, frame, rotation and shadow; the
 * WebGL wall takes over at the same curve when the flights land. */
export function createPhotoFlightCurve(stage: HTMLElement) {
  if (!curvedPhotoWallStages.has(stage)) return null
  const settings = getComputedStyle(stage)
  const bend = parseFloat(settings.getPropertyValue("--wall-bend")) || 0
  const rim = parseFloat(settings.getPropertyValue("--wall-rim")) || 0
  if (!bend && !rim) return null
  const { width, height } = stage.getBoundingClientRect()
  // A low-resolution field is smoothly resampled over the viewport. These
  // are displacement samples, not photo pixels, so images retain resolution.
  const map = document.createElement("canvas")
  map.width = 256
  map.height = Math.max(1, Math.round(256 * height / width))
  const context = map.getContext("2d")!
  const pixels = context.createImageData(map.width, map.height)
  for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) {
    const offset = photoWallDisplacement((x + 0.5) / map.width, (y + 0.5) / map.height, bend, rim)
    const index = (y * map.width + x) * 4
    pixels.data[index] = Math.round(128 + offset.x * 127)
    pixels.data[index + 1] = Math.round(128 + offset.y * 127)
    pixels.data[index + 3] = 255
  }
  context.putImageData(pixels, 0, 0)
  const namespace = "http://www.w3.org/2000/svg"
  const node = (name: string, attributes: Record<string, string>) => {
    const element = document.createElementNS(namespace, name)
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value)
    return element
  }
  const id = `photo-flight-curve-${nextCurve++}`
  const svg = node("svg", { width: "0", height: "0", "aria-hidden": "true" })
  const filter = node("filter", { id, filterUnits: "userSpaceOnUse", x: "0", y: "0", width: String(width), height: String(height), "color-interpolation-filters": "sRGB" })
  filter.append(node("feImage", { href: map.toDataURL(), x: "0", y: "0", width: String(width), height: String(height), preserveAspectRatio: "none", result: "field" }))
  // PNG's neutral byte is 128/255; shift it to exactly 0.5 so zero
  // displacement stays still instead of nudging the handoff by a fraction.
  const neutral = node("feComponentTransfer", { in: "field", result: "centred-field" })
  for (const channel of ["R", "G"]) neutral.append(node(`feFunc${channel}`, { type: "linear", slope: "1", intercept: String(-0.5 / 255) }))
  filter.append(neutral, node("feGaussianBlur", { in: "centred-field", stdDeviation: String(Math.min(width, height) / 256), result: "smooth-field" }), node("feDisplacementMap", { in: "SourceGraphic", in2: "smooth-field", scale: String(Math.min(width, height) * PHOTO_WALL_WARP_SCALE / 2 * 255 / 127), xChannelSelector: "R", yChannelSelector: "G" }))
  svg.append(filter)
  const layer = document.createElement("div")
  layer.setAttribute("data-photo-flight-curve", "")
  layer.setAttribute("aria-hidden", "true")
  Object.assign(layer.style, { position: "fixed", inset: "0", pointerEvents: "none", zIndex: "calc(var(--z-dialog) - 1)", filter: `url(#${id})` })
  layer.append(svg)
  document.body.append(layer)
  return layer
}
