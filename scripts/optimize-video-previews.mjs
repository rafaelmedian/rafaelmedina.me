import ffmpegPath from "ffmpeg-static"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import fs from "node:fs/promises"
import path from "node:path"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const previews = [
  { name: "shot-small-9", width: 480, fps: 24, crf: 42 },
  { name: "shot-small-16", width: 640, fps: 30, crf: 36 },
  { name: "shot-small-20", width: 640, fps: 30, crf: 36 },
]

const srgbTags = ["-color_primaries", "bt709", "-color_trc", "iec61966-2-1", "-colorspace", "bt709", "-color_range", "tv"]

function transcode(input, output, { width, fps, crf }) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-y",
      "-i",
      input,
      "-vf",
      `scale=${width}:-2:flags=lanczos,fps=${fps}`,
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      String(crf),
      "-deadline",
      "good",
      "-cpu-used",
      "2",
      "-row-mt",
      "1",
      // Tag the files as sRGB. Left as ffmpeg's default BT.709 transfer, Chrome
      // converts the curve while playing and lifts the light grey margin from
      // e9 to ec, so the tile visibly brightens when the poster hands over to
      // the video, and the margin no longer matches the card behind it.
      ...srgbTags,
      output,
    ])

    ffmpeg.addListener("error", reject)
    ffmpeg.addListener("exit", (code) => {
      if (code === 0) resolve()
      else reject(new Error(`ffmpeg exited with code ${code}`))
    })
  })
}

for (const preview of previews) {
  const input = path.join(root, "public", "Projects", `${preview.name}.webm`)
  const output = path.join(root, "public", "Projects", `${preview.name}.optimized.webm`)
  await transcode(input, output, preview)
  await fs.rename(output, input)
}
