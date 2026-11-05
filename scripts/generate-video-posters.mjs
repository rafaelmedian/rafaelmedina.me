import ffmpegPath from "ffmpeg-static"
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const previews = ["shot-small-9", "shot-small-16", "shot-small-20"]

function generatePoster(input, output) {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-y",
      "-ss",
      "2",
      "-i",
      input,
      "-frames:v",
      "1",
      "-vf",
      // Decode with the same BT.709 matrix the browser uses for the video, so
      // the poster's grey is the value playback shows when it takes over.
      "scale=640:-2:flags=lanczos:in_color_matrix=bt709",
      "-c:v",
      "libwebp",
      "-quality",
      "80",
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
  await generatePoster(
    path.join(root, "public", "Projects", `${preview}.webm`),
    path.join(root, "public", "Projects", `${preview}-poster.webp`),
  )
}
