import ffmpeg from "ffmpeg-static"
import { spawn } from "node:child_process"

// Tile teasers are separate from full gallery videos. Always encode from the
// originals, preserving their full length and resolution for an opened project.
const previews = [
  ["shot-small-9", 640, 8], ["shot-small-16", 640, 8],
  ["pokemon-duo", 480, 8], ["patrol", 320, 8],
  ["protector-dress-code", 320, 8], ["matcha-video-cross-chain-2023", 640, 8],
]
for (const [name, width, duration] of previews) {
  await new Promise((resolve, reject) => {
    const process = spawn(ffmpeg, ["-y", "-i", `public/Projects/${name}.webm`,
      "-t", String(duration), "-vf", `scale=${width}:-2:flags=lanczos,fps=24`,
      "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40",
      "-deadline", "good", "-cpu-used", "2", "-row-mt", "1",
      // sRGB tags: with a BT.709 transfer Chrome lifts light greys while the
      // video plays, so it stops matching its poster and its card.
      "-color_primaries", "bt709", "-color_trc", "iec61966-2-1", "-colorspace", "bt709", "-color_range", "tv",
      `public/Projects/${name}-feed.webm`], { stdio: ["ignore", "ignore", "ignore"] })
    process.once("error", reject)
    process.once("exit", code => code === 0 ? resolve() : reject(new Error(`ffmpeg ${name}: ${code}`)))
  })
}
