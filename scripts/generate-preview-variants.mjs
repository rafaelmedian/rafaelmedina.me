// Resized siblings for the webp preview tiles, mirroring the -480w/-960w jpg
// variants the shot-small previews already ship. SimpleFeed's
// `webpPreviewVariantSources` set must list every source handled here.
import ffmpegPath from "ffmpeg-static"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const variantWidths = [480, 960]

// [source, intrinsic width] — widths at or above the intrinsic width are skipped.
const sources = [
  ["public/Projects/protector.webp", 1200],
  ["public/Projects/popparazi_v1.webp", 630],
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
