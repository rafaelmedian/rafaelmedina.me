# About video introduction

The About introduction is designed for a short, face-only recording. Local
development shows a portrait teaser and a synthetic recording so the interaction
can be reviewed before that recording exists. Production stays disabled until
the real recording, captions, and transcript have been reviewed and generated
into `public/about-intro/`. Running the asset script does not enable production.

## Record it

- Aim for 30–45 seconds; about 35 seconds leaves enough room to speak naturally.
- Record at 1080p or better with the camera at eye level. The final frame is
  square, so keep your face centered and leave some space above your head.
- Face a window or soft light, use a quiet room, and record clean speech without
  music. Avoid virtual backgrounds and background movement.
- Look into the lens and pause for a beat at the start and end. A simple,
  face-only take is easier to compress and makes the silent teaser readable.

Suggested script:

> Hey, I’m Rafael. I design the complicated parts of products people prefer not
> to think about. I help figure out what’s worth building, test ideas with real
> people, and prototype in code—because working interactions answer questions
> faster than static mockups. Outside work, I’m usually kickboxing, swimming, or
> riding a bike. I’m also learning salsa and jiu jitsu, which keep me humble.
> That’s the quick introduction. If you’re building something, I’d love to hear
> about it.

## Prepare captions and transcript

Save the spoken text as plain UTF-8 in `transcript.txt`. Create a WebVTT file
named `captions.vtt`; it must begin with `WEBVTT` and contain timed cues:

```vtt
WEBVTT

00:00.000 --> 00:03.200
Hi, I’m Rafael.
```

Caption what was actually said, including meaningful deviations from the draft.
Keep cues to one or two short lines, use sentence case and punctuation, and do
not put speaker names on a single-speaker recording. Check every cue against the
audio for wording, timing, spelling, and a final cue that ends before the video.

## Generate the assets

From the repository root, pass all three source files explicitly:

```sh
node scripts/build-about-intro.mjs \
  --source /absolute/path/to/about-intro-source.mov \
  --captions /absolute/path/to/captions.vtt \
  --transcript /absolute/path/to/transcript.txt
```

The default output is `public/about-intro/`. It contains a square 720 px H.264
and AAC `recording.mp4`, a silent 2.5-second `teaser.mp4`, `poster.webp`, the
validated copy of `captions.vtt`, and `manifest.json`. MP4 remains the production
teaser default. Pass `--teaser-format gif` when a GIF is needed; it generates a
180 px, 10 fps, 64-color `teaser.gif` and points the manifest at that file. The
manifest has this shape by default:

```json
{
  "duration": 35.04,
  "transcript": "The complete spoken transcript…",
  "assets": {
    "recording": "/about-intro/recording.mp4",
    "teaser": "/about-intro/teaser.mp4",
    "poster": "/about-intro/poster.webp",
    "captions": "/about-intro/captions.vtt"
  }
}
```

The script refuses unreadable video, empty transcripts, malformed captions, a
recording at or above 5 MB, or a teaser at or above 150 KB. It stages the whole
result and only replaces the output directory after every asset succeeds.

To rebuild the committed synthetic fixture used in development, provide its
output path and URL prefix:

```sh
node scripts/build-about-intro.mjs \
  --source /tmp/about-intro-synthetic-source.mp4 \
  --captions /tmp/about-intro-fixture-captions.vtt \
  --transcript /tmp/about-intro-fixture-transcript.txt \
  --output tests/fixtures/about-intro \
  --base-url /tests/fixtures/about-intro \
  --teaser-format gif
```

Before enabling production, play the generated `recording.mp4` with captions in
a browser. Listen once without reading, then replay while following every cue.
Confirm the square crop throughout the take, legible caption breaks, synchronized
starts and ends, clear audio, and a poster and silent teaser that still look like
the same recording.

After running `npm run dev`, `http://localhost:5173/` shows the portrait teaser and synthetic
placeholder recording by default. Use `http://localhost:5173/?intro=off` when the widget
would get in the way of other development work. The placeholder code and query
switch are development-only and cannot enable the widget in a production build.

Once the real media and captions are approved, import the generated manifest at
the top of `src/data/aboutIntro.ts`:

```ts
import aboutIntroManifest from "../../public/about-intro/manifest.json"
```

Then replace the disabled value with the imported, typed manifest:

```ts
export const aboutIntro: AboutIntroMedia = aboutIntroManifest
```

Run lint, build, and the About intro browser tests before committing that
activation with the generated files.

## Portrait preview and replies

The development teaser now uses the existing profile photo with a gentle zoom,
not generated speech. Rebuild that 2.5-second GIF (about 104 KB) and its WebP
poster with `node scripts/build-about-intro-placeholder.mjs`. The separate
five-second color-bar recording and its captions still exercise real playback.

The glass badge at the portrait's upper-right reveals Play, Reply in text, and
Reply on video. Hover or keyboard focus reveals the actions on desktop; tapping
the portrait also opens them. Each reply starts with “What’s your email?” and
then “Anything you’d like to know?” The second prompt is optional. Editing the
email preserves the message and any recorded video.

Delivery currently opens a prefilled email draft addressed to `siteLinks.email`.
The visitor reviews and sends it in their email app. The site does not claim
that opening a draft means a message was sent. No email service or storage has
been configured, and no reply data is posted from the page.

Video capture requires a separate press after the email step. It records for
up to 60 seconds, stops at 8 MB, and remains in browser memory. Closing the
panel or hiding the page stops the camera and microphone. A finished recording
can be previewed, retaken, and downloaded. To email it, the visitor downloads the
clip and attaches it manually; a `mailto:` link cannot add that attachment.
Closing the reply discards its in-memory draft. Email software will retain a
copy once the visitor sends it, according to their provider's settings.

Direct delivery can replace the email-app handoff once an email service is
chosen. An attachment can be forwarded without adding persistent website file
storage, but the delivery provider and recipient mailbox still handle copies.
