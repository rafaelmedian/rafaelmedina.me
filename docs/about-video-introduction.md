# About video introduction

The About introduction is designed for a short, face-only recording. Local
development shows a portrait teaser and a sample recording so the interaction
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

To generate a fixture with reviewed captions and a transcript, provide its
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

After running `npm run dev`, `http://localhost:5173/` shows the portrait teaser and sample
recording by default. Use `http://localhost:5173/?intro=off` when the widget
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

The development preview uses the user-selected [YouTube Short](https://www.youtube.com/shorts/PSrLXbNjWos)
with its original English audio. The full 60.05-second video and audio stay
together to preserve synchronization; the earlier CleanShot upload had no audio.
The square crop is positioned toward the top to keep the speaker's head intact.
The 624px MP4 is 4.77 MB; its matching two-second 160px/8fps silent GIF is
131 KB, and the 360px WebP poster is 17 KB. Speech captions have not been supplied;
the preview's descriptive track remains off by default.

Rebuild from a local copy of the original video:

```sh
node scripts/build-about-intro-placeholder.mjs <original.mp4> 0.1
```

The optional vertical crop position runs from 0 (top) to 1 (bottom), defaulting
to 0.5 (center). The script retains any source audio and adjusts the video bitrate
to fit the duration and audio within the 5 MB budget. It generates
`src/data/aboutIntroPreview.ts` with the encoded duration and asset paths so the
hover duration cannot drift from the recording. It keeps the largest GIF that
fits the 150 KB budget and checks both media sizes before replacing the fixtures.
The original remains a local input. Generated files stay in `tests/fixtures/`,
and production remains disabled until the introduction is ready to publish.

Hover or focus the portrait to reveal play in its center and two small reply
controls beside it. Hover or focus an icon to expand it into a labeled button:
“Your email” or “Text me.” Each grows from 44px to 128px with its label inside
the pill; touch users tap the portrait to reveal the 44px icon targets.

The play triangle is white with no disc. A 20% dark overlay fades over the
portrait while actions are shown. Reply icons use simple 24px Hugeicons rounded strokes. A and C keep the
site's existing white surfaces and shadows; B uses the gray Messages-style
bubble. The composer's upward send arrow uses a blue disc when enabled.

Email expands the same white control into an input and arrow, 12px to the right
of the image. Text expands it upward to add a small textarea above the email
row. Opening takes 360ms and closing 160ms; reduced motion removes the morph.
On mobile, the image and field move into a side-by-side row above the TOC.
The collapsed widget has no corner X. The arrow becomes available for a valid address and opens
a prefilled email draft addressed to `siteLinks.email`. The visitor reviews and sends it in
their email app; the website does not send or store their reply. Escape closes
and returns focus to the action. Clicking elsewhere morphs the form back into
the labeled button without moving focus away from the clicked control. It stays
visible so the visitor can reopen it; on mobile it keeps the row above the TOC. No camera permission is requested.

The compact “A quick hello” label and duration appear only on hover or focus.
The player fills its square edge to edge with controls overlaid on the video:
play/pause, a thin seek bar, right-aligned time, volume, expand/shrink, and close.
These controls appear on hover or keyboard focus; touch users tap to toggle
them. Expand grows to 480px within viewport bounds. The placeholder badge is
omitted; descriptive test captions start off, while real captions start on.
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

## Development design options

B is the selected default on the main page. The A/B/C switcher has been removed;
the development comparison page and explicit `?introStyle=a` / `c` links remain
available for reference. Production still waits for the final personal recording.

- **A — Compact pill:** the alternative hover-expanding icon buttons.
- **B — Chat bubble:** a staggered greeting, then an email field. Confirming the
  address reveals an optional message field while keeping the conversation visible.
  Any incoming message can also take a visitor reaction.
- **C — Stacked buttons:** separate “Your email” and “Text me” pills beside
  the portrait, without the introductory copy.

All three use the same video and email-draft delivery. B uses a conversational
email-first flow; A and C keep the compact reply forms.
B and C stack comfortably above the mobile TOC. Use the existing feedback
toolbar to annotate an option; include its letter.

Open `/intro-options` in development to compare A, B, and C on one page.
The cards contain the real widgets, including playback and reply forms; starting
one video pauses the others. Cards sit side by side on wide screens and stack
on narrow screens. This remains a development-only reference page.

B now follows the supplied Messages reference: a shared gray surface, rounded
corners and a curved tail toward the portrait, followed by an email-first conversation.
All reply forms use a quiet outlined field and an upward send arrow. It is hidden
while the email is empty, disabled gray for an invalid email, and blue when the
browser accepts the address. It still opens a draft in the visitor's email app.

B's conversation starts on entering About (or scrolling its comparison card into
view): the portrait appears first, then “Hey, I’m Rafa.”, “How are you doing?”,
and “Wanna share your email with me so I can reach out to you?” The email field
follows. The short stagger uses 80/120/160/240ms entry delays, an 8px rise, 2px
blur and the shared 360ms surface easing; reduced motion shows it immediately.

Each delivered message is a button. Activating it opens an Apple-style picker
above the bubble with the six classic Tapbacks: heart, thumbs up, thumbs down,
laughter, exclamation points, and a question mark. The picker uses Base UI menu
semantics, left/right arrow navigation, 40px targets, viewport collision
handling, and the shared white overlay surface. It springs open using the
existing Messages motion from the earlier reaction exploration, staggers the
six choices, and fades toward the bubble after a selection. The supplied Messages
references guide the pink heart and custom blue HA HA, coral !! and purple ?.
The picker uses smaller 18px glyphs while preserving 40px tap targets. The chosen
14px glyph then grows into a 27px blue disc and two-dot trail, a three-quarter
version of Rafa's automatic heart, mirrored onto the message's top-right corner.
A later choice replaces
it; choosing the current Tapback again removes it. The hint confirms both
actions, while reduced motion shows picker and Tapback at rest.
When analytics is configured, the site records only the message index and
reaction name; it does not attach the visitor's email or message.

Confirming the email only advances local UI state. It appears as an editable
reply bubble, followed by “Want to share anything else?” and an optional message
field. The address and optional message are not transmitted until the visitor
sends the final form. The face stays beside the latest incoming bubble; the
history scrolls when necessary while the input remains below it.

Before each incoming message, B now shows a three-dot typing bubble for 900ms.
The 8px dots gently pulse and rise 4px, offset by 120ms. The follow-up after email
confirmation uses the same treatment. Fields appear only after their question;
their space stays reserved to keep the portrait steady. Hidden chats and tabs
pause the sequence, returning keeps completed messages, and reduced motion
skips the dots and delay. Clicking elsewhere cancels delayed input focus.

The selected B email field is now 44px high and capped at 256px wide, with
the same 14px type as the messages. It sits at the chat's right edge, its
center level with the portrait, and
the conversation grows above that row. The optional message keeps its larger
textarea and 16px input type. It grows with the text, from 88px up to seven
lines (less on short screens), then scrolls.

Typing bubbles rest on the avatar's bottom edge while either reply field is pending.
Only the typing bubble has a tail on Rafa's side; the questions have none. The
reply fields are the visitor's side: right-aligned where the sent address lands,
rising from the right, with the sent bubble's tail mirrored on their right.
The measured reserved form height accounts for the delivery hint wrapping on
mobile. When the field appears, history shifts over the shared 360ms smooth
transition. The white reply surface uses the shared hairline and overlay shadow,
with an 8px visual gap below the last message. Reduced motion skips the shift.

Clicking the sent address to edit it unsends it with a Messages-style puff: the
bubble and its tapback blur out while dots of its blue drift up and away, and
after 480ms the email field returns with the address and takes focus. Reduced
motion goes straight back to the field.

## Direct website replies

B now submits to a contact Worker instead of opening an email app. The email
step stays local; only the final Send message action transmits the email and
optional message. Pending and sent states prevent duplicate clicks, retries
reuse the same request ID, and failed messages remain in component state.
The Worker uses a fixed recipient, validates the request, rate-limits anonymous
submissions, and keeps the provider key on the server. It has no message database
and does not log request bodies. The mail provider and inbox still process and
retain email under their own settings; this is not a zero-storage email system.
See [contact delivery setup](../workers/contact/README.md) for configuration.

The portrait now stays at the dock baseline beside the final reply item,
including the hint below the optional message. History uses the available
viewport height rather than a fixed 256px crop. Arrows are initially gray;
a valid email or nonempty message uses blue. Focus draws its 1px shadow inside
the field, preserving the shared outer elevation.
