/**
 * Media sources follow the convention documented beside the card data in
 * src/data/portfolio.ts: .webm/.mp4 render as autoplaying muted video,
 * anything else as an image. Case-insensitive so an upper-case extension
 * cannot silently demote a clip to a broken <img>.
 */
export function isVideoSource(source: string): boolean {
  const normalized = source.toLowerCase()
  return normalized.endsWith(".webm") || normalized.endsWith(".mp4")
}

// Each 1600x1200 shot-small source has `-480w`/`-960w` siblings generated next
// to it. The mosaic selects an appropriate size for each composed slot;
// the gallery dialog keeps loading the original.
const previewVariantWidths = [480, 960]
// The webp previews are one-offs, so their resized siblings are listed
// explicitly instead of pattern-matched. Regenerate with
// scripts/generate-preview-variants.mjs when one of these sources changes.
const webpPreviewVariantSources = new Set([
  "/Projects/protector.webp",
  "/Projects/popparazi_v1.webp",
  "/Projects/dealership-lead-hub.webp",
  "/Projects/shared-family-stories.webp",
  "/Projects/matcha-rewards.webp",
  "/Projects/matcha-rewards-link-preview.webp",
  "/Projects/matcha-rewards-countdown.webp",
])
const hasPreviewVariants = (source: string) =>
  /_shot-small-\d+\.jpg$/.test(source) || webpPreviewVariantSources.has(source)

/** Image slots follow the shell's real gutters at each breakpoint. Desktop
 * shares exclude the group's column gaps; compact Protector spans both columns.
 * Keep this with work-grid.css when changing the shell or grid insets. */
export function previewSizesForShare(share = 1 / 3, columns = 3, compactWide = false, cropped = false) {
  const compact = compactWide ? 100 : 50
  const tabletInset = compactWide ? 32 : 21
  const groupGaps = (columns - 1) * 16
  // Protector is the sole cropped preview. Its 536px desktop height floor
  // can make `cover` wider than the slot, before the shared 1.38 zoom. Above
  // this floor, the slot width is the larger constraint. Keep these in step
  // with the portrait group and --preview-crop-scale in work-grid.css.
  const scale = cropped ? 1.38 : 1
  const cropWidthFloor = Math.ceil(536 * (1200 / 1328) * scale)
  const round = (value: number) => Math.round(value * 100) / 100
  const desktopSize = (vw: number, inset: number) => {
    const slot = `calc(${round(vw * share * scale)}vw - ${round(inset * share * scale)}px)`
    return cropped ? `max(${cropWidthFloor}px, ${slot})` : slot
  }
  return `(max-width: 699.98px) calc(${compact * scale}vw - ${round(16 * scale)}px), ` +
    `(max-width: 899.98px) calc(${compact * scale}vw - ${round(tabletInset * scale)}px), ` +
    `(max-width: 1066.66px) ${desktopSize(94, groupGaps)}, ` +
    `(max-width: 1560px) ${desktopSize(100, 64 + groupGaps)}, ` +
    `${Math.ceil((1496 - groupGaps) * share * scale)}px`
}

// Generic previews outside the home mosaic retain their established sizing.
export const previewSizes = "(max-width: 520px) 82vw, (max-width: 1400px) 31vw, 446px"

export function buildPreviewSrcSet(source: string, intrinsicWidth?: number) {
  if (!hasPreviewVariants(source)) return undefined

  const extension = source.endsWith(".webp") ? ".webp" : ".jpg"
  const stem = source.slice(0, -extension.length)
  // Skip variants at or above the source width (popparazi is only 630px wide,
  // so a -960w sibling would be an upscale that doesn't exist).
  const candidates = previewVariantWidths
    .filter((width) => !intrinsicWidth || width < intrinsicWidth)
    .map((width) => `${stem}-${width}w${extension} ${width}w`)
  if (intrinsicWidth) candidates.push(`${source} ${intrinsicWidth}w`)
  return candidates.join(", ")
}
