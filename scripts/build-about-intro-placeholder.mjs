// A local preview using the site's existing portrait, not simulated speech.
// The separate color-bar recording remains a playback test fixture.
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import ffmpeg from 'ffmpeg-static'

const root = fileURLToPath(new URL('../', import.meta.url))
const input = 'src/assets/profile-photo.webp'
const output = 'tests/fixtures/about-intro'
const run = args => execFileSync(ffmpeg, ['-y', ...args], { cwd: root, stdio: 'ignore' })

run(['-framerate', '10', '-loop', '1', '-t', '2.5', '-i', input,
  '-filter_complex', "[0:v]scale=720:720,zoompan=z='1.02+0.015*sin(on*PI/12)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=144x144:fps=10,split[a][b];[a]palettegen=max_colors=32[p];[b][p]paletteuse=dither=bayer:bayer_scale=3",
  '-loop', '0', `${output}/teaser.gif`])
run(['-i', input, '-vf', 'scale=208:208', '-frames:v', '1', '-quality', '80', `${output}/poster.webp`])
