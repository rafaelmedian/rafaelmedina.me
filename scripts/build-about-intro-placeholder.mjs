// Development-only speaking teaser. Source: Pedro Pascal interview GIF on Tenor.
// https://tenor.com/view/pedro-pascal-palta-avocado-gif-16406806577894432292
// Usage: node scripts/build-about-intro-placeholder.mjs [original.gif]
import { execFileSync } from 'node:child_process'
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = await mkdtemp(join(tmpdir(), 'about-speaking-'))
const source = 'https://media1.tenor.com/m/47Cvp9XwniQAAAAd/pedro-pascal-palta.gif'
try {
  const input = process.argv[2] ? resolve(process.argv[2]) : join(temporary, 'source.gif')
  if (!process.argv[2]) {
    const response = await fetch(source)
    if (!response.ok) throw new Error(`Cannot download speaking fixture: ${response.status}`)
    await writeFile(input, Buffer.from(await response.arrayBuffer()))
  }
  const output = 'tests/fixtures/about-intro'
  const run = args => execFileSync(ffmpeg, ['-y', ...args], { cwd: root, stdio: 'ignore', timeout: 30_000 })
  // Crop the speaker's face above the original interview captions.
  const crop = 'crop=200:200:94:0'
  run(['-t', '2', '-i', input, '-filter_complex',
    `[0:v]${crop},fps=8,scale=144:144:flags=lanczos,split[a][b];[a]palettegen=max_colors=32[p];[b][p]paletteuse=dither=bayer:bayer_scale=5`,
    '-loop', '0', `${output}/teaser.gif`])
  run(['-i', input, '-vf', `${crop},scale=360:360:flags=lanczos`, '-frames:v', '1', '-quality', '80', `${output}/poster.webp`])
  if ((await stat(join(root, output, 'teaser.gif'))).size >= 150_000) throw new Error('Teaser exceeds 150 KB')
} finally {
  await rm(temporary, { recursive: true, force: true })
}
