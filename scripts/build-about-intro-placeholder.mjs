// Development-only bedroom vlog. Marcus Aurelius / Pexels, free stock license.
// https://www.pexels.com/video/a-woman-vlogging-while-in-bed-9780901/
// Usage: node scripts/build-about-intro-placeholder.mjs [original.mp4]
import { execFileSync } from 'node:child_process'
import { copyFile, mkdtemp, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = await mkdtemp(join(tmpdir(), 'about-speaking-'))
const source = 'https://www.pexels.com/download/video/9780901/'
try {
  const input = process.argv[2] ? resolve(process.argv[2]) : join(temporary, 'source.mp4')
  if (!process.argv[2]) {
    const response = await fetch(source)
    if (!response.ok) throw new Error(`Cannot download speaking fixture: ${response.status}`)
    await writeFile(input, Buffer.from(await response.arrayBuffer()))
  }
  const output = join(root, 'tests/fixtures/about-intro')
  const run = args => execFileSync(ffmpeg, ['-y', ...args], { stdio: 'ignore', timeout: 30_000 })
  // Keep the face and headboard in the square, rather than the full vertical shot.
  // The source has no audio; do not invent speech or add a synthetic test tone.
  const crop = 'crop=1000:1000:220:100'
  run(['-ss', '3', '-t', '5', '-i', input, '-vf', `${crop},scale=720:720:flags=lanczos`,
    '-an', '-c:v', 'libx264', '-crf', '26', '-preset', 'medium', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', join(temporary, 'recording.mp4')])
  run(['-t', '2', '-i', join(temporary, 'recording.mp4'), '-filter_complex',
    '[0:v]fps=8,scale=160:160:flags=lanczos,split[a][b];[a]palettegen=max_colors=32[p];[b][p]paletteuse=dither=bayer:bayer_scale=5',
    '-loop', '0', join(temporary, 'teaser.gif')])
  run(['-i', join(temporary, 'recording.mp4'), '-vf', 'scale=360:360:flags=lanczos',
    '-frames:v', '1', '-quality', '80', join(temporary, 'poster.webp')])
  await writeFile(join(temporary, 'captions.vtt'), 'WEBVTT\n\n00:00.000 --> 00:05.000\n[Silent bedroom vlog preview]\n')
  if ((await stat(join(temporary, 'teaser.gif'))).size >= 150_000) throw new Error('Teaser exceeds 150 KB')
  if ((await stat(join(temporary, 'recording.mp4'))).size >= 5_000_000) throw new Error('Recording exceeds 5 MB')
  for (const file of ['recording.mp4', 'teaser.gif', 'poster.webp', 'captions.vtt']) {
    await copyFile(join(temporary, file), join(output, file))
    console.log(`${file}: ${(await stat(join(output, file))).size} bytes`)
  }
} finally {
  await rm(temporary, { recursive: true, force: true })
}
