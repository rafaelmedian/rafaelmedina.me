export const ELASTIC_EDGE_RANDOMIZE_EVENT = "elastic-edge:randomize"
export const ELASTIC_EDGE_SETTINGS_EVENT = "elastic-edge:settings"

export const DEFAULT_ELASTIC_EDGE_SETTINGS = {
  preview: false,
  height: 56,
  centerWidth: 42,
  colorSpread: 52,
  blur: 8,
  saturation: 1.04,
  translucency: 0.38,
  coreOpacity: 0.9,
  lightOpacity: 0.26,
} as const

export type ElasticEdgeSettings = {
  preview: boolean
  height: number
  centerWidth: number
  colorSpread: number
  blur: number
  saturation: number
  translucency: number
  coreOpacity: number
  lightOpacity: number
}

const HUE_OFFSETS = [-34, -17, 0, 17, 34]

const wrapHue = (hue: number) => ((hue % 360) + 360) % 360

export function createElasticEdgePalette(random = Math.random) {
  const baseHue = Math.floor(random() * 360)
  const saturation = 66 + Math.floor(random() * 8)
  const lightness = 74 + Math.floor(random() * 5)

  return HUE_OFFSETS.map((offset, index) => {
    const hue = wrapHue(baseHue + offset)
    const distanceFromCenter = Math.abs(index - 2)
    const shadeSaturation = saturation - distanceFromCenter * 5
    const shadeLightness = lightness + distanceFromCenter * 4
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
  element.style.setProperty("--elastic-edge-blur", `${settings.blur}px`)
  element.style.setProperty("--elastic-edge-saturation", String(settings.saturation))
  element.style.setProperty("--elastic-edge-shade-opacity", String(shadeOpacity))
  element.style.setProperty("--elastic-edge-shade-strength", `${shadeOpacity * 100}%`)
  element.style.setProperty("--elastic-edge-core-opacity", String(settings.coreOpacity))
  element.style.setProperty("--elastic-edge-core-strength", `${settings.coreOpacity * 100}%`)
  element.style.setProperty("--elastic-edge-light-opacity", String(settings.lightOpacity))
}
