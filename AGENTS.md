# AGENTS.md

## Interaction preference

For small, clear changes and direct follow-up corrections, implement and verify
without asking for another approval round. Ask only when a decision is genuinely
ambiguous, risky, destructive, or requires new authority.

## Design system

`/design-system` (dev server only — `npm run dev`, then
http://localhost:5173/design-system) is the reference for this site's colour,
type, spacing, elevation, motion, layout, and accessibility rules. It is an
inventory of what already ships, not a proposal.

Read it before adding a colour, a font size, a radius, an easing curve, or a
z-index, and prefer a value that is already on it. When you do change one of
those values in `src/styles/`, update any affected descriptions and exceptions in
`src/components/DesignSystemPage.tsx` in the same commit. Shared token values are
read from computed CSS and the specimens use real components; component-specific
values and explanatory prose still need to be kept in step.

`src/index.css` is the ordered stylesheet entry point. Shared tokens and base
rules live in `src/styles/base.css`; component files own their responsive rules.
Keep the Tailwind reset first and the global reduced-motion policy last. See
`src/styles/README.md` for ownership and cascade details. `npm run lint` includes
CSS linting.

## Shipping

`main` is the only branch that deploys. Merge into it and GitHub Actions builds
`dist/` and publishes it to rafaelmedina.me.

- **Never edit built output.** No hand-written CSS appended to the deployed
  assets, no patching hashed filenames, no committing a build. Change `src/` or
  `public/` and let the build produce the rest.
- Cut feature branches from `main` and merge back through a PR. CI runs lint,
  build, and Playwright on every PR that can change the shipped site;
  documentation-only PRs keep the required check but skip runtime verification.
- `public/CNAME` carries the custom domain. Losing it takes the site off
  rafaelmedina.me, so the deploy workflow fails rather than ship without it.

This repo used to keep source and built output on two unrelated branches, and
edits made directly to the deployed files were silently lost on the next build.
Do not reintroduce that pattern.

## Commits and pull requests

A PR is a sequence of commits, each one a change that stands on its own, and its
body is the list of those changes. Both apply to every agent working here —
Claude and Codex read this same file, and the format below is the shared one.

### Commits

Split the work as you go, one commit per coherent change: the refactor that
makes room for the feature, the feature, the test that guards it, the
regenerated asset. Do not finish the task and wrap it all in a single
"Implement X". Each commit carries:

- **A title** in the imperative present, under ~65 characters, naming the change
  rather than the files — "Scale preview `sizes` to each tile's share of its
  row", not "Update portfolio.ts".
- **A description** saying what was wrong or missing and why this is the fix.
  The measurement, threshold, or failure that motivated it belongs here, not in
  the PR body alone. Wrap at 72 columns. A commit ships without a body only when
  the title is genuinely the whole story.
- **The `Co-Authored-By:` trailer** for the agent that wrote it.

Keep each commit building and passing on its own where the change allows it, so
a later `git bisect` lands somewhere useful.

### Pull request body

Open with a paragraph on what the PR changes and why. Then list the changes in
the order they land, one entry per commit, each with a one- or two-sentence
summary in plain language — enough that the list alone explains the PR without
opening the diff. Close with what was verified: lint, build, the Playwright
count, and anything checked by hand in a browser.

The repo squash-merges and keeps the individual commit messages as the squashed
body, so the commits written on a branch become the permanent record on `main`.
That is what lets `git log` and `git blame` answer why a value is what it is;
one "Implement X" commit erases that reasoning for good, and no PR description
brings it back.

## Résumé

`public/rafael-medina-resume.pdf` is generated, not exported by hand. It used to
be a Figma export, which is how it drifted into advertising a role I had left and
an address the site had already moved off. Edit the content in
`scripts/build-resume.mjs`, run `node scripts/build-resume.mjs`, and commit the
regenerated PDF. The rule is that the PDF matches the site, not that any
particular address is wrong: whatever `siteLinks.email` says today is what
belongs on the résumé.

Keep it in step with `src/data/cv.ts` (work history, dates, education) and
`siteLinks.email` in `src/data/portfolio.ts` (contact address) — a Playwright test
reads the shipped PDF and fails when those disagree. The script refuses to write a
second page.

The reader that the folded CV tile opens is not a modal of its own: it is a slide
of the preview gallery, at the place the tile occupies on the grid, so the arrow
keys walk from a project into the résumé and out the other side. It owns
`/resume/` the way a project owns `/work/<slug>/` — prerendered by
`scripts/prerender.mjs`, listed in the sitemap, rendered as `ResumePage` for a
crawler or a visitor without JavaScript, and swapped for the gallery slide once
React is running. With JavaScript that article never paints: the head script in
`index.html` holds every gallery address back until the dialog presents (see
`src/lib/galleryEntry.ts`). Adding another non-project tile to the sequence means
adding a kind to `src/lib/galleryItems.ts`, a location to
`src/lib/portfolioUrl.ts`, and its path to that head script's pattern; the
gallery itself only knows about items.

## Notes

The notes are two surfaces, and which one a change belongs to matters.

The **list** is a slide of the preview gallery, exactly as the résumé is: a
`writings` item in `src/lib/galleryItems.ts`, at the place the folder tile
occupies on the grid, so the arrow keys walk from a project into the notes and
out the other side. It owns `/notes/` — prerendered, in the sitemap, rendered as
`NotesPage` for a crawler — and the folder tile and the header's Notes link both
open the gallery on it. `WritingsArchive` is the list itself, shared by the slide
and that page.

A **note** is a nested view inside the same preview-gallery dialog. Its deferred
`WritingsReader` renders article content only; the gallery owns the backdrop,
card, focus trap, and controls. Arrows browse notes while an article is forward;
Back and Escape return to the list. Each note owns `/notes/<id>/`, rendered as
`WritingPage` for a crawler. `?writing=<id>` was the
old address and still opens the reader. `WritingArticle` is the article, shared
by the sheet and that page.

Two modules hold a note. `src/data/writingIndex.ts` is the eager half: id,
title, date, blurb, and the social card. `src/data/writings.ts` is the prose,
and it is 34KB — it stays out of the main bundle, so the standalone note page is
fetched before hydration by `src/lib/writingPageSlot.ts` rather than imported.
Add a note to the index and `writings.ts` will spread its fields; a title or a
date is written once.

The reader chunk is fetched by a row of the list, not by the tile, and
`WritingsFolder` is where it is fetched, cancelled, and retried; the list prints
its status. The gallery stays on its Notes item for both /notes/ and a note URL.
Only content turns horizontally: the card remains opaque and grows downward to
the viewport's bottom gutter for articles, then shrinks to the list on Back.
The list stays measured, hidden, and inert while reading so its scroll position
and row focus can be restored. Do not reintroduce a second dialog, copied sheet
geometry, or a separate backdrop for notes.

## The last-updated clause and its GitHub card

Two different things with two different lifecycles sit behind the hero's
"Last updated" clause, and it matters which is which.

The **date** is read from this repository's git log at build time by
`scripts/site-activity.mjs`, injected through a Vite `define` in
`vite.config.ts`, and typed in `src/data/siteActivity.ts`. It has to be true of
the deploy that is happening right now, so it is never committed — and because
it only needs the most recent commit, a default shallow CI checkout answers it
correctly.

The **contribution calendar** is `src/data/githubActivity.ts`, generated by
`scripts/build-github-activity.mjs` and committed. It is the whole GitHub
profile's graph, not this repository's commits, and GitHub only exposes that
through an authenticated GraphQL call — so it is fetched once on a machine that
is signed in to `gh` and committed, exactly like the résumé PDF, rather than
requiring a token in CI. Re-run the script and commit the result when it goes
stale; `fetchedOn` in the generated file says how stale it is. The shading bands
are quartiles of the days that had any work, computed at generation time, so the
graph stays legible whether a normal day is three contributions or thirty.

The card's avatar is self-hosted at `public/people/github-rafaelmedian.jpg`
rather than hotlinked from `avatars.githubusercontent.com`; re-download it when
the GitHub one changes.

## Reaction clips

`public/reactions/` holds the clips the hover cards play — the address's copy
invitation and confirmation, the booking pill's, and the LinkedIn pill's. They
are meme GIFs sourced from Tenor and Giphy and transcoded rather than shipped
as-is: a 480px GIF straight off Giphy is 1.4MB for a surface that is on screen
for two seconds. The recipe, using the `ffmpeg-static` that is already a devDependency:

```
ffmpeg -t 3.2 -i source.gif -vf "fps=10,scale=400:-2:flags=lanczos" \
  -loop 0 -quality 55 -compression_level 6 public/reactions/<name>.webp
ffmpeg -ss 1 -i source.gif -vf "scale=400:-2:flags=lanczos" -frames:v 1 \
  -quality 80 public/reactions/<name>-still.webp
```

Roughly 2x the card's 200px display width, trimmed to the part that carries the
joke, and a still beside each one for `prefers-reduced-motion`. Keep them under
about 100KB. Swapping a clip is a single `Reaction` constant —
`emailCopyReactions.ts` for the address, worn by both the corner chip and the
About sheet's prose link, or `AvailabilityBooking.tsx` for the booking pill —
and the card takes its shape from the `width`/`height` you give it.

## Personal photo variants

The photo sheet uses generated 400/800 px WebP siblings in
`public/images/personal/`. Add originals and their dimensions to
`src/data/personalPhotos.ts`, then run `node scripts/optimize-personal-media.mjs`
with Node 22.18 or newer. It also writes a `-thumb.webp` (300×400 box) for any
photo that lacks one, which the fan and the flights start from; it never rewrites
an existing thumb. Commit the generated variants. The original stays in
`srcSet` for large/high-density displays; `sizes` mirrors the sheet's columns,
gutters, gaps, and print padding in `src/styles/personal-photos.css`.

The same script accepts an optional original GIF or animated WebP path to rebuild
`copy-email-success.webp` at 400 px / 10 fps / quality 55. Always use the source,
not the optimized result. The pre-optimization source is recoverable with
`git show 9e2be59:public/reactions/copy-email-success.webp > /tmp/copy-email-source.webp`.
Its existing still remains the reduced-motion/data-saving alternative.

## Generated artwork

`public/writings/marks/` holds the notes reader's pencil marks: the bracket that
holds a passage beside a margin note, and the stroke under an interjection. Like
the résumé, they are generated rather than drawn by hand. Edit
`scripts/build-writing-marks.mjs`, run `node scripts/build-writing-marks.mjs`,
and commit the regenerated PNGs.

They were bezier paths written inline in the component first, and they read as
vector geometry — one clean stroke of even weight, the same curve every time,
which is the one thing a pencil never does. The script draws them with Rough.js,
which retraces every line with randomised bowing, and rasterises them through the
Playwright that is already a devDependency, so no drawing library reaches the
browser. Each file's seed is hashed from its own name, so a rerun reproduces the
same artwork instead of churning the diff.

The PNGs are black on transparent and are used as CSS masks, so the reader still
colours them with `currentColor` and one asset serves any ink.

The archive's gutter drawings (`drawing-<object>-frames.png`) are strips of
three frames side by side, which the list steps through on hover. The first
frame keeps the seed the single drawing always had, so the resting artwork never
changes; the frame count in the script and the `300%` mask size in
`src/styles/writings.css` have to agree.

## Planning Mode Rules

- In planning mode, any task related to design, animation/motion, or user flows must include an ASCII plan.
- Use plain ASCII characters only (`|`, `-`, `>`, `+`, `[]`, `()`), with no Unicode box-drawing symbols.
- Include the ASCII plan before implementation steps.
- Keep the plan concise and actionable, then follow with a numbered execution plan.

### ASCII Plan Template

```txt
[Goal]
  |
  +--> [Step 1]
  |       |
  |       +--> [Decision A?] --yes--> [Path A]
  |                         \--no--> [Path B]
  |
  +--> [Step 2]
  |
  +--> [Validation]
```
