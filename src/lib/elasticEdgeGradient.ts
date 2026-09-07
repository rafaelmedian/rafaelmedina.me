export const ELASTIC_EDGE_RANDOMIZE_EVENT = "elastic-edge:randomize"
export const ELASTIC_EDGE_SETTINGS_EVENT = "elastic-edge:settings"
export const ELASTIC_EDGE_REPLAY_EVENT = "elastic-edge:replay"

export const DEFAULT_ELASTIC_EDGE_SETTINGS = {
  preview: false,
  height: 56,
  centerWidth: 42,
  colorSpread: 52,
  translucency: 0.38,
  coreOpacity: 0.9,
  lightOpacity: 0.26,
  staggerMs: 40,
  risePx: 8,
  riseDurationMs: 700,
  fadeDurationMs: 1260,
  sectionOpacity: 0.65,
} as const

export type ElasticEdgeSettings = {
  preview: boolean
  height: number
  centerWidth: number
  colorSpread: number
  translucency: number
  coreOpacity: number
  lightOpacity: number
  staggerMs?: number
  risePx?: number
  riseDurationMs?: number
  fadeDurationMs?: number
  sectionOpacity?: number
}

const HUE_OFFSETS = [-54, -36, -18, 0, 18, 36, 54]

const wrapHue = (hue: number) => ((hue % 360) + 360) % 360

export function createElasticEdgePalette(random = Math.random) {
  const baseHue = Math.floor(random() * 360)
  // 69–76% carries the 4% saturate() the shade used to apply as a filter, so
  // the strip keeps its colour without a per-paint filter pass.
  const saturation = 69 + Math.floor(random() * 8)
  const lightness = 74 + Math.floor(random() * 5)

  return HUE_OFFSETS.map((offset, index) => {
    const hue = wrapHue(baseHue + offset)
    const distanceFromCenter = Math.abs(index - 3)
    const shadeSaturation = saturation - distanceFromCenter * 3
    const shadeLightness = lightness + distanceFromCenter * 2
    return `hsl(${hue} ${shadeSaturation}% ${shadeLightness}%)`
  })
}

export function paintElasticEdgePalette(element: HTMLElement, palette = createElasticEdgePalette()) {
  palette.forEach((color, index) => {
    element.style.setProperty(`--elastic-edge-color-${index + 1}`, color)
  })
}

export function randomizeElasticEdgePalette(element: HTMLElement) {
  const palette = createElasticEdgePalette()
  const repeatsCurrentPalette = palette.every(
    (color, index) => element.style.getPropertyValue(`--elastic-edge-color-${index + 1}`) === color,
  )
  const nextPalette = repeatsCurrentPalette ? [...palette.slice(1), palette[0]] : palette

  paintElasticEdgePalette(element, nextPalette)
}

export function paintElasticEdgeSettings(element: HTMLElement, settings: ElasticEdgeSettings) {
  const shadeOpacity = 1 - settings.translucency

  element.dataset.preview = String(settings.preview)
  element.style.setProperty("--elastic-edge-height", `${settings.height}px`)
  element.style.setProperty("--elastic-edge-center-width", `${settings.centerWidth}%`)
  element.style.setProperty("--elastic-edge-color-spread", `${settings.colorSpread}%`)
  element.style.setProperty("--elastic-edge-shade-opacity", String(shadeOpacity))
  element.style.setProperty("--elastic-edge-shade-strength", `${shadeOpacity * 100}%`)
  element.style.setProperty("--elastic-edge-core-opacity", String(settings.coreOpacity))
  element.style.setProperty("--elastic-edge-core-strength", `${settings.coreOpacity * 100}%`)
  element.style.setProperty("--elastic-edge-light-opacity", String(settings.lightOpacity))
  element.style.setProperty("--elastic-edge-stagger", `${settings.staggerMs ?? DEFAULT_ELASTIC_EDGE_SETTINGS.staggerMs}ms`)
  element.style.setProperty("--elastic-edge-rise", `${settings.risePx ?? DEFAULT_ELASTIC_EDGE_SETTINGS.risePx}px`)
  element.style.setProperty("--elastic-edge-rise-duration", `${settings.riseDurationMs ?? DEFAULT_ELASTIC_EDGE_SETTINGS.riseDurationMs}ms`)
  element.style.setProperty("--elastic-edge-fade-duration", `${settings.fadeDurationMs ?? DEFAULT_ELASTIC_EDGE_SETTINGS.fadeDurationMs}ms`)
  element.style.setProperty("--elastic-edge-section-opacity", String(settings.sectionOpacity ?? DEFAULT_ELASTIC_EDGE_SETTINGS.sectionOpacity))
}
