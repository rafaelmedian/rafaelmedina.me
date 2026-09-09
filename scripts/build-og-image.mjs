// Builds public/og-image.png: a screenshot of the real homepage.
//
//   npm run build && node scripts/build-og-image.mjs
//
// The social card used to be a cropped portrait, which told a reader nothing
// about the site behind the link. This shoots the built site instead, so the
// preview is the page — header, portrait, the work grid's first row — rather
// than a picture of its author.
//
// It serves `dist/` on an ephemeral port and screenshots it at 1600x840 CSS
// pixels, the 1.91:1 frame every social card crops to, with the first row of
// tiles landing whole above the fold and the next row's edge showing that the
// page continues. Chromium renders at 2x and ffmpeg scales that back down to
// the 1200x630 the meta tags declare, so the type is supersampled rather than
// rasterised at final size.
//
// Reduced motion is emulated, which is the site's own path to a settled first
// paint: `useAvatarIntro` drops straight to the revealed state, the tile
// entrances are cancelled, and the reaction tiles swap their loops for stills.
//
// Like the résumé, this is deliberately NOT part of `npm run build`: the PNG is
// a committed asset and a build should not need a browser. Re-run it when the
// homepage changes — the card carries the "Last updated" line, so a stale image
// is a visibly stale one.

import ffmpegPath from "ffmpeg-static"
import { spawn } from "node:child_process"
import { createServer } from "node:http"
import { createReadStream } from "node:fs"
import { mkdtemp, rm, stat } from "node:fs/promises"
import { tmpdir } from "node:os"
import { extname, join, resolve, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { chromium } from "playwright-core"

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const distDir = join(rootDir, "dist")
const outputPath = join(rootDir, "public", "og-image.png")

// The card is declared 1200x630 in index.html and src/lib/projectMetadata.ts.
// Shooting 1600x840 renders a desktop layout, not a cramped 1200px one, and
// divides back to the same aspect ratio.
const viewport = { width: 1600, height: 840 }
const output = { width: 1200, height: 630 }

const contentTypes = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
}

if (!(await stat(distDir).catch(() => null))) {
  throw new Error("dist/ is missing. Run `npm run build` first — this shoots the built site, not the dev server.")
}

/** Just enough static file serving to load one prerendered page. */
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname)
  let file = join(distDir, pathname)
  if (await stat(file).then(entry => entry.isDirectory(), () => false)) file = join(file, "index.html")
  if (!(await stat(file).catch(() => null))) {
    response.writeHead(404).end()
    return
  }
  response.writeHead(200, { "content-type": contentTypes[extname(file)] ?? "application/octet-stream" })
  createReadStream(file).pipe(response)
})

await new Promise(resolveListening => server.listen(0, "127.0.0.1", resolveListening))
const origin = `http://127.0.0.1:${server.address().port}`

const workDir = await mkdtemp(join(tmpdir(), "og-image-"))
const shotPath = join(workDir, "home@2x.png")
const browser = await chromium.launch()
try {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
    colorScheme: "light",
  })
  const page = await context.newPage()
  await page.goto(origin, { waitUntil: "networkidle" })

  // The intro owns `data-avatar-intro` until the page is fully revealed, and
  // removes it; anything shot before then catches content mid-entrance.
  await page.waitForSelector("html:not([data-avatar-intro])")
  // `networkidle` covers the images; the webfonts and the video tiles are the
  // two things that can still swap under it. Do not wait on `image.decode()`
  // here — the lazy tiles below the fold never resolve one.
  await page.evaluate(() => document.fonts.ready)
  await page.waitForFunction(
    () => [...document.querySelectorAll("video")].every(video => video.readyState >= 2 || video.poster),
  )
  // Fonts land before the metrics they change do.
  await page.waitForTimeout(500)

  await page.screenshot({ path: shotPath })
  await scale(shotPath, outputPath)
  console.log(`Wrote ${outputPath} (${output.width}x${output.height}, ${((await stat(outputPath)).size / 1024).toFixed(0)} KB)`)
} finally {
  await browser.close()
  server.close()
  await rm(workDir, { recursive: true, force: true })
}

/** Lanczos down to the declared size, matching the other image scripts here. */
function scale(input, outputFile) {
  return new Promise((resolveScale, reject) => {
    const ffmpeg = spawn(ffmpegPath, [
      "-y",
      "-loglevel",
      "error",
      "-i",
      input,
      "-vf",
      `scale=${output.width}:${output.height}:flags=lanczos`,
      "-frames:v",
      "1",
      "-update",
      "1",
      outputFile,
    ], { stdio: ["ignore", "ignore", "inherit"] })

    ffmpeg.addListener("error", reject)
    ffmpeg.addListener("exit", code => {
      if (code === 0) resolveScale()
      else reject(new Error(`ffmpeg exited with code ${code}`))
    })
  })
}
