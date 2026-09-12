import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { mkdtemp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import test from "node:test"
import ffmpegPath from "ffmpeg-static"

const root = path.resolve(import.meta.dirname, "..")
const script = path.join(root, "scripts/build-about-intro.mjs")

test("keeps the shipped intro metadata in step with its public manifest", async () => {
  const [{ aboutIntroProduction }, manifestText] = await Promise.all([
    import("../src/data/aboutIntroProduction.ts"),
    readFile(path.join(root, "public/about-intro/manifest.json"), "utf8"),
  ])

  assert.deepEqual(aboutIntroProduction, JSON.parse(manifestText))
})

function run(command, args) {
  return spawnSync(command, args, { cwd: root, encoding: "utf8" })
}

async function makeSource(directory) {
  const source = path.join(directory, "source.mp4")
  const result = run(ffmpegPath, [
    "-y", "-loglevel", "error",
    "-f", "lavfi", "-i", "testsrc2=size=960x540:rate=24:duration=5",
    "-f", "lavfi", "-i", "sine=frequency=440:sample_rate=48000:duration=5",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", source,
  ])
  assert.equal(result.status, 0, result.stderr)
  return source
}

async function makeSilentSource(directory) {
  const source = path.join(directory, "silent-source.mp4")
  const result = run(ffmpegPath, [
    "-y", "-loglevel", "error",
    "-f", "lavfi", "-i", "color=c=blue:size=960x540:rate=24:duration=5",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", source,
  ])
  assert.equal(result.status, 0, result.stderr)
  return source
}

test("builds browser-ready intro assets and a matching manifest", async () => {
  const temp = await mkdtemp(path.join(tmpdir(), "about-intro-test-"))
  try {
    const source = await makeSource(temp)
    const captions = path.join(temp, "captions.vtt")
    const transcript = path.join(temp, "transcript.txt")
    const output = path.join(temp, "output")
    await writeFile(captions, "WEBVTT\n\n00:00.000 --> 00:02.000\nHello from a synthetic test.\n")
    await writeFile(transcript, "Hello from a synthetic test.\n")

    const result = run(process.execPath, [script,
      "--source", source,
      "--captions", captions,
      "--transcript", transcript,
      "--output", output,
      "--base-url", "/tests/fixtures/about-intro",
    ])
    assert.equal(result.status, 0, result.stderr)

    const manifest = JSON.parse(await readFile(path.join(output, "manifest.json"), "utf8"))
    assert.ok(manifest.duration >= 4.9 && manifest.duration <= 5.1, manifest.duration)
    assert.equal(manifest.transcript, "Hello from a synthetic test.")
    assert.deepEqual(manifest.assets, {
      recording: "/tests/fixtures/about-intro/recording.mp4",
      teaser: "/tests/fixtures/about-intro/teaser.mp4",
      poster: "/tests/fixtures/about-intro/poster.webp",
      captions: "/tests/fixtures/about-intro/captions.vtt",
    })
    assert.equal(await readFile(path.join(output, "captions.vtt"), "utf8"), await readFile(captions, "utf8"))

    const recordingInfo = run(ffmpegPath, ["-i", path.join(output, "recording.mp4"), "-f", "null", "-"])
    assert.match(recordingInfo.stderr, /Video: h264/)
    assert.match(recordingInfo.stderr, /720x720/)
    assert.match(recordingInfo.stderr, /Audio: aac/)

    const teaserInfo = run(ffmpegPath, ["-i", path.join(output, "teaser.mp4"), "-f", "null", "-"])
    assert.match(teaserInfo.stderr, /Video: h264/)
    assert.doesNotMatch(teaserInfo.stderr, /Audio:/)
    assert.ok((await stat(path.join(output, "teaser.mp4"))).size < 150_000)
    assert.ok((await stat(path.join(output, "recording.mp4"))).size < 5_000_000)
    assert.ok((await stat(path.join(output, "poster.webp"))).size > 0)
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
})

test("can build a compact GIF teaser for the development placeholder", async () => {
  const temp = await mkdtemp(path.join(tmpdir(), "about-intro-gif-"))
  try {
    const source = await makeSource(temp)
    const captions = path.join(temp, "captions.vtt")
    const transcript = path.join(temp, "transcript.txt")
    const output = path.join(temp, "output")
    await writeFile(captions, "WEBVTT\n\n00:00.000 --> 00:02.000\nSynthetic placeholder.\n")
    await writeFile(transcript, "Synthetic placeholder.\n")

    const result = run(process.execPath, [script,
      "--source", source,
      "--captions", captions,
      "--transcript", transcript,
      "--output", output,
      "--base-url", "/tests/fixtures/about-intro",
      "--teaser-format", "gif",
    ])
    assert.equal(result.status, 0, result.stderr)

    const manifest = JSON.parse(await readFile(path.join(output, "manifest.json"), "utf8"))
    assert.equal(manifest.assets.teaser, "/tests/fixtures/about-intro/teaser.gif")
    const teaser = await readFile(path.join(output, "teaser.gif"))
    assert.match(teaser.subarray(0, 6).toString("ascii"), /^GIF8[79]a$/)
    assert.ok(teaser.length < 150_000)
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
})

test("rejects invalid captions before replacing an existing output", async () => {
  const temp = await mkdtemp(path.join(tmpdir(), "about-intro-invalid-"))
  try {
    const source = await makeSource(temp)
    const captions = path.join(temp, "captions.vtt")
    const transcript = path.join(temp, "transcript.txt")
    const output = path.join(temp, "output")
    await writeFile(captions, "not WebVTT")
    await writeFile(transcript, "A transcript")
    await mkdir(output)
    await writeFile(path.join(output, "sentinel.txt"), "keep me")

    const result = run(process.execPath, [script,
      "--source", source, "--captions", captions, "--transcript", transcript, "--output", output,
    ])
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /WEBVTT header/)
    assert.equal(await readFile(path.join(output, "sentinel.txt"), "utf8"), "keep me")
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
})

test("rejects a source without an audio stream", async () => {
  const temp = await mkdtemp(path.join(tmpdir(), "about-intro-silent-"))
  try {
    const source = await makeSilentSource(temp)
    const captions = path.join(temp, "captions.vtt")
    const transcript = path.join(temp, "transcript.txt")
    await writeFile(captions, "WEBVTT\n\n00:00.000 --> 00:02.000\nSpoken introduction.\n")
    await writeFile(transcript, "Spoken introduction.\n")

    const result = run(process.execPath, [script,
      "--source", source, "--captions", captions, "--transcript", transcript,
      "--output", path.join(temp, "output"),
    ])
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /audio stream/i)
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
})

test("rejects invalid WebVTT cue timing, payload, and duration bounds", async () => {
  const cases = [
    ["reversed cue", "WEBVTT\n\n00:03.000 --> 00:02.000\nBackwards.\n"],
    ["empty cue", "WEBVTT\n\n00:00.000 --> 00:02.000\n"],
    ["out-of-bounds cue", "WEBVTT\n\n00:04.000 --> 00:06.000\nToo late.\n"],
    ["out-of-order cues", "WEBVTT\n\n00:02.000 --> 00:04.000\nFirst.\n\n00:01.000 --> 00:02.000\nSecond.\n"],
  ]
  const temp = await mkdtemp(path.join(tmpdir(), "about-intro-cues-"))
  try {
    const source = await makeSource(temp)
    const transcript = path.join(temp, "transcript.txt")
    await writeFile(transcript, "A transcript.\n")
    for (const [name, contents] of cases) {
      const captions = path.join(temp, `${name}.vtt`)
      await writeFile(captions, contents)
      const result = run(process.execPath, [script,
        "--source", source, "--captions", captions, "--transcript", transcript,
        "--output", path.join(temp, "output"),
      ])
      assert.notEqual(result.status, 0, `${name} was accepted`)
      assert.match(result.stderr, /WebVTT cue/i, name)
    }
  } finally {
    await rm(temp, { recursive: true, force: true })
  }
})
