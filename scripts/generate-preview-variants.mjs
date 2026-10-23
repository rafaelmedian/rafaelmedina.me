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

// [source, intrinsic width] — widths at or above the intrinsic width are skipped.
const sources = [
  ["public/Projects/protector.webp", 1200],
  ["public/Projects/popparazi_v1.webp", 630],
  ["public/Projects/dealership-lead-hub.webp", 1600],
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
  ["public/Projects/twilio-admiral.webp", 1600],
  ["public/Projects/twilio-admiral-card-sort.webp", 1200],
  ["public/Projects/twilio-admiral-ownership.webp", 1200],
  ["public/Projects/twilio-admiral-hierarchy.webp", 1200],
  ["public/Projects/twilio-admiral-team-switcher.webp", 1200],
  ["public/Projects/twilio-admiral-access-flow.webp", 1200],
  ["public/Projects/twilio-admiral-design-system.webp", 1200],
  ["public/Projects/twilio-admiral-icons.webp", 1200],
  ["public/Projects/moodys-sprints.webp", 1320],
  ["public/Projects/moodys-sprint-week.webp", 1200],
  ["public/Projects/moodys-journey-map.webp", 1200],
  ["public/Projects/moodys-iterations.webp", 1200],
  ["public/Projects/moodys-key-indicators.webp", 1200],
  ["public/Projects/moodys-esg.webp", 1200],
  ["public/Projects/moodys-prototypes.webp", 1200],
  ["public/Projects/onit-process-builder.webp", 1600],
  ["public/Projects/onit-process-builder-workflow.webp", 1200],
  ["public/Projects/onit-process-builder-design-system.webp", 1200],
  ["public/Projects/onit-process-builder-frontend.webp", 1200],
  ["public/Projects/onit-process-builder-prototypes.webp", 1200],
  ["public/Projects/turtle.webp", 1320],
  ["public/Projects/turtle-guess-games.webp", 1200],
  ["public/Projects/turtle-reveal.webp", 1200],
  ["public/Projects/turtle-conversations.webp", 1200],
  ["public/Projects/turtle-onboarding.webp", 1200],
  ["public/Projects/turtle-profiles.webp", 1200],
  ["public/Projects/turtle-schools.webp", 1200],
  ["public/Projects/turtle-share.webp", 1200],
  ["public/Projects/turtle-press.webp", 1200],
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

for (const [source, intrinsicWidth] of sources) {
  const input = path.join(root, source)
  const stem = input.slice(0, -".webp".length)
  for (const width of variantWidths) {
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
