// Node 22.18+. Produces committed browser assets from a local camera recording.
import ffmpegPath from "ffmpeg-static"
import { spawnSync } from "node:child_process"
import { access, mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = fileURLToPath(new URL("../", import.meta.url))
const defaults = {
  output: path.join(root, "public/about-intro"),
  baseUrl: "/about-intro",
}

function usage() {
  return "Usage: node scripts/build-about-intro.mjs --source <video> --captions <vtt> --transcript <txt> [--output <dir>] [--base-url <url>] [--teaser-format <mp4|gif>]"
}

function parseArgs(argv) {
  const values = {}
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index]
    const value = argv[index + 1]
    if (!flag?.startsWith("--") || !value || value.startsWith("--")) throw new Error(usage())
    if (!["--source", "--captions", "--transcript", "--output", "--base-url", "--teaser-format"].includes(flag)) {
      throw new Error(`Unknown option: ${flag}\n${usage()}`)
    }
    values[flag.slice(2)] = value
  }
  for (const required of ["source", "captions", "transcript"]) {
    if (!values[required]) throw new Error(`Missing --${required}\n${usage()}`)
  }
  const teaserFormat = values["teaser-format"] ?? "mp4"
  if (!["mp4", "gif"].includes(teaserFormat)) throw new Error("--teaser-format must be mp4 or gif")
  return {
    source: path.resolve(values.source),
    captions: path.resolve(values.captions),
    transcript: path.resolve(values.transcript),
    output: path.resolve(values.output ?? defaults.output),
    baseUrl: (values["base-url"] ?? defaults.baseUrl).replace(/\/$/, ""),
    teaserFormat,
  }
}

function runFfmpeg(args, errorMessage) {
  const result = spawnSync(ffmpegPath, args, { encoding: "utf8" })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`${errorMessage}\n${result.stderr.trim()}`)
  return result
}

function parseTimestamp(timestamp) {
  const parts = timestamp.split(":")
  if (parts.length !== 2 && parts.length !== 3) return Number.NaN
  const seconds = Number(parts.at(-1))
  const minutes = Number(parts.at(-2))
  const hours = parts.length === 3 ? Number(parts[0]) : 0
  if (![hours, minutes, seconds].every(Number.isFinite) || minutes >= 60 || seconds >= 60) return Number.NaN
  return hours * 3600 + minutes * 60 + seconds
}

function validateCaptions(captions, duration) {
  const normalized = captions.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n")
  const blocks = normalized.trim().split(/\n{2,}/)
  if (!/^WEBVTT(?:[ \t].*)?(?:\n|$)/.test(blocks[0] ?? "")) {
    throw new Error("Captions must begin with a WEBVTT header")
  }

  let cueCount = 0
  let previousStart = 0
  for (const block of blocks.slice(1)) {
    const lines = block.split("\n")
    if (/^(NOTE|STYLE|REGION)(?:[ \t]|$)/.test(lines[0])) continue
    const timingIndex = lines.findIndex((line, index) => index < 2 && line.includes("-->"))
    if (timingIndex < 0) throw new Error("Every WebVTT cue must include a timing line")
    const timing = lines[timingIndex].match(/^((?:\d{2,}:)?\d{2}:\d{2}\.\d{3})\s+-->\s+((?:\d{2,}:)?\d{2}:\d{2}\.\d{3})(?:[ \t]+.*)?$/)
    if (!timing) throw new Error("Every WebVTT cue must use valid timestamps")
    const start = parseTimestamp(timing[1])
    const end = parseTimestamp(timing[2])
    const payload = lines.slice(timingIndex + 1).join("\n").trim()
    if (!payload) throw new Error("Every WebVTT cue must have nonempty text")
    if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) {
      throw new Error("Every WebVTT cue must end after it starts")
    }
    if (start < previousStart) throw new Error("WebVTT cues must be ordered by start time")
    if (end > duration + 0.02) throw new Error("WebVTT cue times must stay within the source duration")
    previousStart = start
    cueCount += 1
  }
  if (cueCount === 0) throw new Error("Captions must contain at least one WebVTT cue")
}

async function validateInputs(options) {
  await Promise.all([options.source, options.captions, options.transcript].map(async (file) => {
    await access(file)
    if (!(await stat(file)).isFile()) throw new Error(`Input is not a file: ${file}`)
  }))

  const captions = await readFile(options.captions, "utf8")
  const transcript = (await readFile(options.transcript, "utf8")).trim()
  if (!transcript) throw new Error("Transcript must not be empty")

  const probe = spawnSync(ffmpegPath, ["-hide_banner", "-i", options.source], { encoding: "utf8" })
  if (probe.error) throw probe.error
  const durationMatch = probe.stderr.match(/Duration:\s+(\d+):(\d+):(\d+(?:\.\d+)?)/)
  if (!durationMatch || !/Stream #.*Video:/.test(probe.stderr)) throw new Error("Source must be a readable video")
  if (!/Stream #.*Audio:/.test(probe.stderr)) throw new Error("Source must contain an audio stream")
  const duration = Number(durationMatch[1]) * 3600 + Number(durationMatch[2]) * 60 + Number(durationMatch[3])
  if (!(duration > 0)) throw new Error("Source video duration must be greater than zero")
  validateCaptions(captions, duration)
  return { captions, transcript, duration }
}

async function encode(options, validated, staging) {
  const square = "crop='min(iw,ih)':'min(iw,ih)',scale=720:720:flags=lanczos"
  const teaserName = `teaser.${options.teaserFormat}`
  runFfmpeg([
    "-y", "-loglevel", "error", "-i", options.source,
    "-vf", square, "-c:v", "libx264", "-preset", "slow", "-crf", "24",
    "-maxrate", "700k", "-bufsize", "1400k", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", path.join(staging, "recording.mp4"),
  ], "Recording encode failed")
  if (options.teaserFormat === "gif") {
    runFfmpeg([
      "-y", "-loglevel", "error", "-i", options.source, "-t", "2.5",
      "-filter_complex", "crop='min(iw,ih)':'min(iw,ih)',scale=180:180:flags=lanczos,fps=10,split[s0][s1];[s0]palettegen=max_colors=64[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3",
      "-an", path.join(staging, teaserName),
    ], "Teaser encode failed")
  } else {
    runFfmpeg([
      "-y", "-loglevel", "error", "-i", options.source, "-t", "2.5",
      "-vf", "crop='min(iw,ih)':'min(iw,ih)',scale=360:360:flags=lanczos,fps=15",
      "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "32", "-pix_fmt", "yuv420p",
      "-movflags", "+faststart", path.join(staging, teaserName),
    ], "Teaser encode failed")
  }
  runFfmpeg([
    "-y", "-loglevel", "error", "-ss", String(Math.min(1, validated.duration / 2)), "-i", options.source,
    "-vf", square, "-frames:v", "1", "-c:v", "libwebp", "-quality", "82", "-compression_level", "6",
    path.join(staging, "poster.webp"),
  ], "Poster encode failed")

  const recordingSize = (await stat(path.join(staging, "recording.mp4"))).size
  const teaserSize = (await stat(path.join(staging, teaserName))).size
  if (recordingSize >= 5_000_000) throw new Error(`Recording is ${recordingSize} bytes; target is under 5 MB`)
  if (teaserSize >= 150_000) throw new Error(`Teaser is ${teaserSize} bytes; target is under 150 KB`)

  await writeFile(path.join(staging, "captions.vtt"), validated.captions)
  const asset = (name) => `${options.baseUrl}/${name}`
  await writeFile(path.join(staging, "manifest.json"), `${JSON.stringify({
    duration: Number(validated.duration.toFixed(3)),
    transcript: validated.transcript,
    assets: {
      recording: asset("recording.mp4"),
      teaser: asset(teaserName),
      poster: asset("poster.webp"),
      captions: asset("captions.vtt"),
    },
  }, null, 2)}\n`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const validated = await validateInputs(options)
  const parent = path.dirname(options.output)
  const staging = path.join(parent, `.${path.basename(options.output)}-${process.pid}.tmp`)
  const backup = `${staging}.previous`
  await mkdir(parent, { recursive: true })
  await rm(staging, { recursive: true, force: true })
  await mkdir(staging)
  let hadOutput = false
  let committed = false
  try {
    await encode(options, validated, staging)
    try {
      await rename(options.output, backup)
      hadOutput = true
    } catch (error) {
      if (error.code !== "ENOENT") throw error
    }
    await rename(staging, options.output)
    committed = true
  } catch (error) {
    if (hadOutput && !committed) {
      try {
        await rename(backup, options.output)
      } catch (restoreError) {
        throw new AggregateError(
          [error, restoreError],
          `Could not restore prior output; backup is preserved at ${backup}`,
        )
      }
    }
    throw error
  } finally {
    await rm(staging, { recursive: true, force: true })
  }
  if (hadOutput) await rm(backup, { recursive: true, force: true })
  console.log(`Built About intro assets in ${options.output}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
