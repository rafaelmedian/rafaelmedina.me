// Node 22.18+; run from any directory. Originals are never overwritten.
import sharp from "sharp"
import ffmpegPath from "ffmpeg-static"
import { spawnSync } from "node:child_process"
import { access, mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { fileURLToPath } from "node:url"
import path from "node:path"
import { personalPhotoItems } from "../src/data/personalPhotos.ts"

const root = fileURLToPath(new URL("../", import.meta.url))
for (const photo of personalPhotoItems) {
  const stem = path.join(root, "public/images/personal", photo.name)
  for (const width of [400, 800]) {
    await sharp(`${stem}.webp`).resize({ width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 }).toFile(`${stem}-${width}w.webp`)
  }
  // The fan's prints and the flights' first frame. The first eleven thumbs
  // predate this step and no setting reproduces them byte for byte, so only a
  // missing one is written and a rerun leaves the committed ones alone.
  const thumb = `${stem}-thumb.webp`
  if (!(await access(thumb).then(() => true, () => false))) {
    await sharp(`${stem}.webp`).resize({ width: 300, height: 400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 }).toFile(thumb)
  }
}

// Optional original GIF/WebP. Do not pass the optimized output back as input:
// successive lossy encodes would reduce quality on every regeneration.
const reactionInput = process.argv[2]
if (reactionInput) {
  const temp = await mkdtemp(path.join(tmpdir(), "portfolio-reaction-"))
  try {
    // Sharp decodes animated WebP (which FFmpeg's WebP decoder cannot reliably
    // do). Lossless PNG frames and concat durations preserve the source timing.
    const metadata = await sharp(reactionInput, { animated: true }).metadata()
    const frames = []
    for (let page = 0; page < (metadata.pages ?? 1); page++) {
      const name = `frame-${page}.png`
      await sharp(reactionInput, { page, pages: 1 }).png().toFile(path.join(temp, name))
      frames.push(`file '${name}'\nduration ${(metadata.delay?.[page] ?? 100) / 1000}`)
    }
    const { writeFile } = await import("node:fs/promises")
    await writeFile(path.join(temp, "frames.txt"), `${frames.join("\n")}\nfile 'frame-${(metadata.pages ?? 1) - 1}.png'\n`)
    const result = spawnSync(ffmpegPath, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", path.join(temp, "frames.txt"),
      "-t", "3.2", "-vf", "fps=10,scale=400:-2:flags=lanczos", "-loop", "0", "-quality", "55", "-compression_level", "6",
      path.join(root, "public/reactions/copy-email-success.webp")], { stdio: "inherit" })
    if (result.error) throw result.error
    if (result.status !== 0) throw new Error("Reaction encoding failed")
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
}
