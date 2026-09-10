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

## Speaking preview and minimal replies

The development preview uses a five-second excerpt from Marcus Aurelius’s
[bedroom vlog on Pexels](https://www.pexels.com/video/a-woman-vlogging-while-in-bed-9780901/),
under the [Pexels license](https://www.pexels.com/license/). The stock subject is
not Rafael. The source is silent: no speech or test tone has been added.
The recording and preview share a square face crop: a 720px MP4 (226 KB),
a two-second 160px/8fps GIF (127 KB), and a WebP poster (5 KB).
Rebuild with `node scripts/build-about-intro-placeholder.mjs [original.mp4]`;
without an argument it downloads the documented source. Outputs are checked
against the media budgets before replacing the fixtures. These files stay in
`tests/fixtures/`, and the production widget remains disabled.

Hover or focus the portrait to reveal play in its center and two small reply
controls beside it: Email and Text. Touch users tap the portrait to reveal them.
The action icons have named tooltips and 44px targets.

The play triangle is white with no disc. A 20% dark overlay fades over the
portrait while actions are shown. Reply icons and the send arrow use simple
24px Hugeicons rounded strokes on transparent buttons; their shared white
surface keeps the site's existing shadows without glass blur or green fills.

Email expands the same white control into an input and arrow, 12px to the right
of the image. Text expands it upward to add a small textarea above the email
row. Opening takes 360ms and closing 160ms; reduced motion removes the morph.
On mobile, the image and field move into a side-by-side row above the TOC.
The collapsed widget has no corner X. The arrow validates the address and opens
a prefilled email draft addressed to `siteLinks.email`. The visitor reviews and sends it in
their email app; the website does not send or store their reply. Escape closes
and returns focus to the action, while clicking elsewhere closes without moving
focus away from the clicked control. No camera permission is requested.

The compact “A quick hello” label and duration appear only on hover or focus.
The player fills its square edge to edge with controls overlaid on the video:
play/pause, a thin seek bar, right-aligned time, volume, expand/shrink, and close.
These controls appear on hover or keyboard focus; touch users tap to toggle
them. Expand grows to 480px within viewport bounds. The placeholder badge is
omitted; synthetic test captions start off, while real captions start on.
Press C while focused on the player to toggle captions.

The resting preview is 112px on desktop and 64px on mobile. Motion follows
transitions.dev’s resize, content morph, tooltip intent, and icon-swap patterns:
360ms expansion / 160ms collapse use the existing surface easing; reply contents
cross-fade with an 8px slide and 2px blur; tooltips wait 80ms on entry only.
Playback, volume and size icons use the recipe’s 250ms reversible cross-fade.

Once opened, the mini-player stays open when the video ends, while scrolling
away from About, and over dialogs. The same video element moves into the
active dialog’s focus scope, using a manual popover to escape clipping and
transforms. Paused clips stay paused; a move only resumes a previously playing
clip in browsers that pause moved media. The X or Escape closes the player.
Opening the TOC still collapses it, and background tabs still pause playback.
