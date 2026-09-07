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
// to it. Those all sit in span-1 slots, which render at most ~446 CSS px
// (measured at 1440px and wider, where the mosaic stops growing), so the
// full-size file is ~3.6x oversampled at 1x and ~1.8x at 2x. The gallery dialog
// keeps loading the original.
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
])
const hasPreviewVariants = (source: string) =>
  /_shot-small-\d+\.jpg$/.test(source) || webpPreviewVariantSources.has(source)

// Measured widths for a span-1 tile in a three-unit row: 317px at 390vw, 228px
// at 768, 393px at 1280, 446px at 1440 and up.
const baseTileShare = 1 / 3

// Rows are not all three-up, and a tile that owns more of its row is that much
// wider. `share` is the tile's fraction of its row's total span, so the widths
// above scale off the one-third baseline. Getting this wrong is expensive in one
// direction only: a slot that claims less than it renders is handed a variant
// below its own size and paints it soft. Protector is the case that matters --
// 1.75 of a 3-unit row, magnified again by `--preview-crop-scale`, so at the
// flat one-third figure it drew the 480w variant across ~1090 CSS px.
export function previewSizesForShare(share: number = baseTileShare) {
  const scale = share / baseTileShare
  const vw = Math.round(31 * scale * 10) / 10
  const wide = Math.round(446 * scale)
  return `(max-width: 520px) 82vw, (max-width: 1400px) ${vw}vw, ${wide}px`
}

export const previewSizes = previewSizesForShare()

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
