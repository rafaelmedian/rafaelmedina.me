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
// to it. Grid tiles render at most ~446 CSS px (measured at 1440px and wider,
// where the mosaic stops growing), so the full-size file is ~3.6x oversampled at
// 1x and ~1.8x at 2x. The gallery dialog keeps loading the original.
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

// Measured tile widths: 317px at 390vw, 228px at 768, 393px at 1280, 446px at
// 1440 and up.
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
