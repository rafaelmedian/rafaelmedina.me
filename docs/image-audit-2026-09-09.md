# Image audit — 2026-09-09

The main opportunity is responsive delivery in the personal-photo sheet. The
homepage already uses a small WebP portrait and responsive project previews.
The initial audit changed no assets. The follow-up below records the implemented optimizations.

## Scope and measurements

Inspected all 125 PNG, JPEG, WebP, and SVG files in `public/`: **5,316,053 bytes**
(5.32 MB decimal). This is repository payload, not a page download. Source assets
also include the 7,240-byte WebP portrait. ICO files, PDFs, and videos are outside
this image inventory. Raster headers decoded successfully and no byte-identical
image duplicates were found.

A local production build was opened in Chromium at 390 × 900 and 1440 × 900,
both at 2× pixel density with reduced motion. Cold homepage image requests after
the entrance settled represented about **571 KB mobile / 1,051 KB desktop** of
files. These are file-size sums of observed requests, not compressed transfer
measurements or a network-speed benchmark. Lazy loading and scroll position can
change the set. Reduced motion excludes animated video behavior.

## Prioritized findings

| Priority | Finding | Evidence | Recommended work |
| --- | --- | --- | --- |
| High | Personal photos use full-size images at small display sizes | Opening the sheet requested all 11 full-size images, **1,540,900 bytes**, on both viewports. Tiles were 151 CSS px wide on mobile and about 293 px on desktop, while sources are 1,066–1,200 px wide. `src/components/PersonalPhotos.tsx` supplies only `src`, with no `srcSet` or `sizes`. | Generate 400/800 px WebP variants and select by the actual column width. Preserve originals for large/high-density displays. Consider lazy loading offscreen sheet photos, while preserving the opening/closing photo handoff. |
| Medium | A live email-confirmation animation exceeds the asset budget | `public/reactions/copy-email-success.webp` is **159,300 bytes**, 400 × 262, 46 frames. It is referenced by `EMAIL_COPY_CONFIRMATION`. The repository targets roughly 100 KB per reaction. | Trim/re-encode from the source using the documented recipe; check that the handshake still reads. Keep its reduced-motion still. |
| Low | Unreferenced assets occupy deployment storage | No references found in `src/`, `public/`, `scripts/`, or `docs/` for `images/personal/golden-gate-shore.webp` (**256,000 bytes**) or `reactions/copy-email-reaction.webp` plus its still (**165,698 bytes** combined). The personal-photo list uses explicit names. | Confirm these are not intentionally preserved public URLs, then remove or archive outside `public/`. They are not observed page requests, so this is a **421.7 KB deployment cleanup**, not a load-time saving. |

## Keep what already works

- The homepage portrait is a 7.24 KB WebP, requested at high priority, with
  explicit dimensions. The larger `profile-header.jpg` is referenced by JSON-LD,
  not used as the rendered hero portrait.
- Project tiles have responsive variants and `sizes`; the mobile run selected
  480 px variants for most smaller tiles. Large sources are not automatically
  defects when a tile fills a high-density screen.
- Note images have dimensions, lazy loading, and asynchronous decoding.
- Reaction cards select static frames for reduced motion.
- The current social image is `og-image.png` (87,708 bytes), correctly declared
  as PNG in `index.html`. Historical documentation about `og-image.jpg` no
  longer describes the current asset.
- Pencil-mark PNGs are generated masks. Preserve their generator workflow.

## Validation boundary

This was a file/metadata and browser-request audit, not a visual comparison of
re-encoded candidates. Savings from responsive variants have not been measured
because none were generated. Do not bulk recompress illustrations, résumé
previews, or screenshots without checking text and fine-line quality.

## Implemented follow-up

Generated and wired 400/800 px WebP photo variants, preserving originals as the
largest `srcSet` candidate. The sheet's `sizes` matches its columns and print
padding. Opening/returning photos retain eager loading; later photos use native
lazy loading. Chromium's lazy-load distance still fetched all eleven in these
viewports, so the measured savings below come from source selection, not from
claiming fewer downloads.

| Photo-sheet images at 2× density | Before | After | Reduction |
| --- | ---: | ---: | ---: |
| 390 px viewport | 1,540,900 bytes | 250,744 bytes | 83.7% |
| 1440 px viewport | 1,540,900 bytes | 696,436 bytes | 54.8% |

The email confirmation is now 61,004 bytes (61.7% smaller), with the same
400 × 262 dimensions and approximately two-second loop, resampled to 10 fps.
Matched frames and the mobile photo sheet were visually checked. Email and
booking reactions still mount only on tooltip intent; they now use stills on
Data Saver, 3G, offline, or the existing slow-start fallback. LinkedIn receives
its video source only when open with motion enabled on a suitable connection.
Reduced-motion still selection is preserved.

The generator is `scripts/optimize-personal-media.mjs`; regeneration instructions
and the original reaction source location are in `AGENTS.md`. All 22 photo
variants reproduced byte-for-byte. Unreferenced cleanup candidates remain
untouched, as they do not contribute to the observed page payload.

Validation after implementation: lint, production build, 308 end-to-end tests,
and 11 design-system tests passed. A pre-existing About hit-testing race was
reproduced on the pre-change build and fixed by waiting for portrait reveal.
