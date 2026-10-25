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

// Each shot-small source has responsive width siblings generated next
// to it. The mosaic selects an appropriate size for each composed slot;
// the gallery dialog keeps loading the original.
const previewVariantWidths = [96, 160, 240, 320, 480, 640, 800, 960]
// The webp previews are one-offs, so their resized siblings are listed
// explicitly instead of pattern-matched. Regenerate with
// scripts/generate-preview-variants.mjs when one of these sources changes.
const webpPreviewVariantSources = new Set([
  "/Projects/protector.webp",
  "/Projects/popparazi_v1.webp",
  "/Projects/dealership-lead-hub.webp",
  "/Projects/dealership-hub-hub-light.webp",
  "/Projects/dealership-hub-hub-answer.webp",
  "/Projects/dealership-hub-old-lead-hub.webp",
  "/Projects/dealership-hub-leads-filters.webp",
  "/Projects/dealership-hub-leads-confirm.webp",
  "/Projects/dealership-hub-design-system-light.webp",
  "/Projects/dealership-hub-workshop-light.webp",
  "/Projects/dealership-hub-workshop-dark.webp",
  "/Projects/dealership-hub-customers-light.webp",
  "/Projects/dealership-hub-customer-profile.webp",
  "/Projects/dealership-hub-team-light.webp",
  "/Projects/shared-family-stories.webp",
  "/Projects/matcha-rewards.webp",
  "/Projects/matcha-rewards-link-preview.webp",
  "/Projects/matcha-rewards-countdown.webp",
  "/Projects/matcha-marketing.webp",
  "/Projects/matcha-marketing-optimism.webp",
  "/Projects/matcha-marketing-savings.webp",
  "/Projects/matcha-marketing-arbitrum-feed.webp",
  "/Projects/matcha-marketing-50-billion-tweet.webp",
  "/Projects/matcha-marketing-50-billion.webp",
  "/Projects/matcha-marketing-2-million.webp",
  "/Projects/matcha-marketing-fantom.webp",
  "/Projects/matcha-marketing-polygon.webp",
  "/Projects/matcha-marketing-avalanche-750m.webp",
  "/Projects/matcha-marketing-match-markets.webp",
  "/Projects/matcha-marketing-match-roses.webp",
  "/Projects/matcha-marketing-arbitrum.webp",
  "/Projects/matcha-marketing-40-billion.webp",
  "/Projects/matcha-marketing-50-billion-bars.webp",
  "/Projects/matcha-marketing-bnb-chain.webp",
  "/Projects/matcha-marketing-bnb-250k.webp",
  "/Projects/matcha-marketing-bsc-1-billion.webp",
  "/Projects/matcha-marketing-limit-orders.webp",
  "/Projects/matcha-marketing-match-headline.webp",
  "/Projects/matcha-marketing-optimism-blog.webp",
  "/Projects/matcha-marketing-arbitrum-cover.webp",
  "/Projects/matcha-marketing-polygon-alt.webp",
  "/Projects/matcha-marketing-bnb-chain-alt.webp",
  "/Projects/matcha-marketing-bnb-chain-icon.webp",
  "/Projects/twilio-admiral.webp",
  "/Projects/twilio-admiral-card-sort.webp",
  "/Projects/twilio-admiral-ownership.webp",
  "/Projects/twilio-admiral-hierarchy.webp",
  "/Projects/twilio-admiral-team-switcher.webp",
  "/Projects/twilio-admiral-access-flow.webp",
  "/Projects/twilio-admiral-deployment.webp",
  "/Projects/twilio-admiral-design-system.webp",
  "/Projects/twilio-admiral-icons.webp",
  "/Projects/moodys-research-views.webp",
  "/Projects/moodys-research-views-tile.webp",
  "/Projects/moodys-research-views-email.webp",
  "/Projects/moodys-research-views-audio-brief.webp",
  "/Projects/moodys-research-views-takeaways.webp",
  "/Projects/moodys-research-views-selection.webp",
  "/Projects/moodys-research-views-comment.webp",
  "/Projects/moodys-research-views-bookmark.webp",
  "/Projects/moodys-research-views-snippets.webp",
  "/Projects/moodys-research-views-focus.webp",
  "/Projects/moodys-research-views-indicators.webp",
  "/Projects/moodys-research-views-peers.webp",
  "/Projects/moodys-research-views-scenario.webp",
  "/Projects/onit-process-builder.webp",
  "/Projects/onit-process-builder-workflow.webp",
  "/Projects/onit-process-builder-design-system.webp",
  "/Projects/onit-process-builder-frontend.webp",
  "/Projects/onit-process-builder-action-block.webp",
  "/Projects/onit-process-builder-history.webp",
  "/Projects/turtle.webp",
  "/Projects/turtle-conversations.webp",
  "/Projects/turtle-reveal.webp",
  "/Projects/turtle-guess-games.webp",
  "/Projects/turtle-onboarding.webp",
  "/Projects/turtle-profiles.webp",
  "/Projects/turtle-schools.webp",
  "/Projects/turtle-product-hunt.webp",
  "/Projects/turtle-business-insider.webp",
])
// Product screenshots carry small UI text and run 800-900px wide in the
// gallery, so a 2x screen needs ~1800 real pixels. These keep their full
// capture resolution and add the larger steps; everything else stops at 960.
const hiDpiVariantWidths = [1280, 1600, 1920, 2400]
const hiDpiPreviewSources = new Set([
  "/Projects/dealership-lead-hub.webp",
  "/Projects/dealership-hub-hub-light.webp",
  "/Projects/dealership-hub-hub-answer.webp",
  "/Projects/dealership-hub-workshop-light.webp",
  "/Projects/dealership-hub-workshop-dark.webp",
  "/Projects/dealership-hub-customers-light.webp",
  "/Projects/dealership-hub-customer-profile.webp",
  "/Projects/dealership-hub-team-light.webp",
  "/Projects/dealership-hub-leads-filters.webp",
  "/Projects/dealership-hub-leads-confirm.webp",
  "/Projects/dealership-hub-design-system-light.webp",
  "/Projects/moodys-research-views.webp",
  "/Projects/moodys-research-views-tile.webp",
  "/Projects/moodys-research-views-email.webp",
  "/Projects/moodys-research-views-audio-brief.webp",
  "/Projects/moodys-research-views-takeaways.webp",
  "/Projects/moodys-research-views-selection.webp",
  "/Projects/moodys-research-views-comment.webp",
  "/Projects/moodys-research-views-bookmark.webp",
  "/Projects/moodys-research-views-snippets.webp",
  "/Projects/moodys-research-views-focus.webp",
  "/Projects/moodys-research-views-indicators.webp",
  "/Projects/moodys-research-views-peers.webp",
  "/Projects/moodys-research-views-scenario.webp",
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
  const widths = hiDpiPreviewSources.has(source) ? [...previewVariantWidths, ...hiDpiVariantWidths] : previewVariantWidths
  const candidates = widths
    .filter((width) => !intrinsicWidth || width < intrinsicWidth)
    .map((width) => `${stem}-${width}w${extension} ${width}w`)
  if (intrinsicWidth) candidates.push(`${source} ${intrinsicWidth}w`)
  return candidates.join(", ")
}
