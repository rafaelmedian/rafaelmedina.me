// Responsive siblings for the project previews. Keep widths and WebP sources
// in step with src/lib/media.ts. Always encode from originals.
import ffmpegPath from "ffmpeg-static"
import sharp from "sharp"
import { readdir } from "node:fs/promises"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const variantWidths = [96, 160, 240, 320, 480, 640, 800, 960]
// Larger steps for the product screenshots in hiDpiPreviewSources (media.ts).
const hiDpiVariantWidths = [1280, 1600, 1920, 2400]

// [source, intrinsic width, extra widths?] — widths at or above the intrinsic width are skipped.
const sources = [
  ["public/Projects/protector.webp", 2400, hiDpiVariantWidths],
  ["public/Projects/protector-booking-start.webp", 2400, hiDpiVariantWidths],
  ["public/Projects/protector-dress-code.webp", 2400, hiDpiVariantWidths],
  ["public/Projects/protector-convoy.webp", 2400, hiDpiVariantWidths],
  ["public/Projects/protector-review.webp", 2400, hiDpiVariantWidths],
  ["public/Projects/popparazi_v1.webp", 630],
  ["public/Projects/dealership-lead-hub.webp", 3200, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-hub-light.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-hub-answer.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-old-lead-hub.webp", 1400],
  ["public/Projects/dealership-hub-leads-filters.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-leads-confirm.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-design-system-light.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-workshop-light.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-workshop-dark.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-customers-light.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-customer-profile.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/dealership-hub-team-light.webp", 2880, hiDpiVariantWidths],
  ["public/Projects/shared-family-stories.webp", 1600],
  ["public/Projects/matcha-rewards.webp", 1540],
  ["public/Projects/matcha-rewards-link-preview.webp", 805],
  ["public/Projects/matcha-rewards-countdown.webp", 805],
  ["public/Projects/matcha-marketing.webp", 1600],
  ["public/Projects/matcha-marketing-optimism.webp", 1200],
  ["public/Projects/matcha-marketing-savings.webp", 1200],
  ["public/Projects/matcha-marketing-arbitrum-feed.webp", 1200],
  ["public/Projects/matcha-marketing-50-billion-tweet.webp", 1200],
  ["public/Projects/matcha-marketing-50-billion.webp", 1200],
  ["public/Projects/matcha-marketing-2-million.webp", 1200],
  ["public/Projects/matcha-marketing-fantom.webp", 1200],
  ["public/Projects/matcha-marketing-polygon.webp", 1200],
  ["public/Projects/matcha-marketing-avalanche-750m.webp", 1200],
  ["public/Projects/matcha-marketing-match-markets.webp", 1200],
  ["public/Projects/matcha-marketing-match-roses.webp", 1200],
  ["public/Projects/matcha-marketing-arbitrum.webp", 1200],
  ["public/Projects/matcha-marketing-40-billion.webp", 1200],
  ["public/Projects/matcha-marketing-50-billion-bars.webp", 1200],
  ["public/Projects/matcha-marketing-bnb-chain.webp", 1200],
  ["public/Projects/matcha-marketing-bnb-250k.webp", 1200],
  ["public/Projects/matcha-marketing-bsc-1-billion.webp", 1200],
  ["public/Projects/matcha-marketing-limit-orders.webp", 1200],
  ["public/Projects/matcha-marketing-match-headline.webp", 1200],
  ["public/Projects/matcha-marketing-optimism-blog.webp", 1200],
  ["public/Projects/matcha-marketing-arbitrum-cover.webp", 1200],
  ["public/Projects/matcha-marketing-polygon-alt.webp", 1200],
  ["public/Projects/matcha-marketing-bnb-chain-alt.webp", 1200],
  ["public/Projects/matcha-marketing-bnb-chain-icon.webp", 1200],
  ["public/Projects/twilio-admiral.webp", 1920],
  ["public/Projects/twilio-admiral-overview.webp", 1920],
  ["public/Projects/twilio-admiral-card-sort.webp", 1600],
  ["public/Projects/twilio-admiral-ownership.webp", 1600],
  ["public/Projects/twilio-admiral-hierarchy.webp", 1600],
  ["public/Projects/twilio-admiral-team-switcher.webp", 1600],
  ["public/Projects/twilio-admiral-access-flow.webp", 1600],
  ["public/Projects/twilio-admiral-deployment.webp", 1600],
  ["public/Projects/twilio-admiral-design-system.webp", 1600],
  ["public/Projects/twilio-admiral-icons.webp", 1600],
  ["public/Projects/moodys-sprints.webp", 1920],
  ["public/Projects/moodys-esg.webp", 1600],
  ["public/Projects/moodys-company-overview.webp", 1600],
  ["public/Projects/moodys-sprint-week.webp", 1024],
  ["public/Projects/moodys-journey-map.webp", 1600],
  ["public/Projects/moodys-key-indicators.webp", 1600],
  ["public/Projects/moodys-iterations.webp", 1600],
  ["public/Projects/moodys-peer-comparison.webp", 1600],
  ["public/Projects/onit-process-builder.webp", 1920],
  ["public/Projects/onit-process-builder-workflow.webp", 1600],
  ["public/Projects/onit-process-builder-design-system.webp", 1600],
  ["public/Projects/onit-process-builder-frontend.webp", 1600],
  ["public/Projects/onit-process-builder-action-block.webp", 1600],
  ["public/Projects/onit-process-builder-history.webp", 1600],
  ["public/Projects/turtle.webp", 1920],
  ["public/Projects/turtle-conversations.webp", 1600],
  ["public/Projects/turtle-reveal.webp", 1600],
  ["public/Projects/turtle-guess-games.webp", 1600],
  ["public/Projects/turtle-onboarding.webp", 1200],
  ["public/Projects/turtle-profiles.webp", 1600],
  ["public/Projects/turtle-schools.webp", 1600],
  ["public/Projects/turtle-product-hunt.webp", 1600],
  ["public/Projects/turtle-business-insider.webp", 1534],
]

function resize(input, output, width) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-y",
      "-i",
      input,
      "-vf",
      `scale=${width}:-2:flags=lanczos`,
      "-c:v",
      "libwebp",
      "-quality",
      "82",
      output,
    ])

    ffmpeg.addListener("error", reject)
    ffmpeg.addListener("exit", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg exited with code ${code} for ${output}`))
    })
  })
}

for (const [source, intrinsicWidth, extraWidths = []] of sources) {
  const input = path.join(root, source)
  const stem = input.slice(0, -".webp".length)
  for (const width of [...variantWidths, ...extraWidths]) {
    if (width >= intrinsicWidth) continue
    const output = `${stem}-${width}w.webp`
    await resize(input, output, width)
    console.log(`wrote ${path.relative(root, output)}`)
  }
}

// Retain the existing 480/960 JPEG exports; fill the gaps from their originals.
for (const name of await readdir(path.join(root, "public/Projects"))) {
  if (!/_shot-small-\d+\.jpg$/.test(name)) continue
  const input = path.join(root, "public/Projects", name)
  for (const width of variantWidths.filter(width => width !== 480 && width !== 960)) {
    const output = input.replace(/\.jpg$/, `-${width}w.jpg`)
    await sharp(input).resize({ width, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true }).toFile(output)
    console.log(`wrote ${path.relative(root, output)}`)
  }
}
