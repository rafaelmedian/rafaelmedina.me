# Web fonts

`scripts/build-fonts.py` cuts each font down to what the site draws and writes
`public/fonts/<Family>-core.woff2`, `<Family>-extended.woff2`, and
`src/styles/fonts.css`. The build never runs it: run it by hand and commit the
output. Sources are downloaded at pinned versions and checked by SHA-256.

```sh
python3 -m venv /tmp/fonts-venv
/tmp/fonts-venv/bin/pip install fonttools==4.60.2 brotli==1.2.1
/tmp/fonts-venv/bin/python scripts/build-fonts.py          # rebuild
/tmp/fonts-venv/bin/python scripts/build-fonts.py --check  # is a rebuild due?
```

Same inputs give byte-identical files. Rerun it when:

- the site's text gains a non-ASCII character (`--check` lists any missing from
  Inter's core; the handwriting faces are not scanned, so check those by eye);
- a `font-weight` on Inter leaves 400-900, or Caveat is drawn at anything but 500;
- a new OpenType feature is switched on (the `features` lists in the script);
- `hyphens: auto` is turned on: browsers draw its hyphen from U+2010, which no
  file carries because nothing uses it today.

## What each file holds

The core has ASCII, curly quotes, dashes, the ellipsis, and, in Inter, every
character the site's text uses. The extended file has the rest of Latin-1 and
Latin Extended-A that the source font has, and only downloads for a page that
needs one of them. Handlee's source has only 4 of the 128 Extended-A characters.

Used characters go in the core even when rare, because shaping stops at a font
file's edge: a character in the extended file loses its kerning against its
neighbours. Later text that needs the extended file pays that until the script
is rerun.

## Rules that keep rendering identical

Each of these moved pixels when it was tried the other way:

- **Inter's `opsz` stays 14-32.** The site stops at 20.4px, but narrowing the
  axis re-scales every delta and the rounding moves text by up to 0.06px.
- **Inter keeps `STAT`.** Without it WebKit, through CoreText, ignores `wght` and
  draws every weight as regular on top of the bold's advances. Chromium does not
  show this, so test both.
- **`head`'s bounding box stays the source's.** Recomputing it for the subset
  changes how CoreText rasterises Handlee and La Belle Aurore.
- **Handlee keeps its glyph names.** Without them CoreText draws text under 24px
  visibly lighter at 1x.
- **`DRAWN_BY_THE_NEXT_FONT` stays out of the fonts.** The arrows and α come from
  the next font in the stack today.
- **Inter keeps its Greek and Cyrillic `kern` scripts.** Digits take the script
  of the character before them, so "α6700" is kerned as Greek.
- **`zero` stays out of Inter.** `slashed-zero` in `work-history.css` does nothing
  under Inter today; including it would change the numbers (156 bytes).

Inter used to build ō from o + U+0304. It now has the real glyph, 1.7KB cheaper
than carrying the mark, and "Sensō-ji" is pixel-identical. A future "Tō" would
gain the T-o kerning the old file skipped.

Handlee is a Reserved Font Name under the OFL, so the file calls itself "RM Hand".
"Handlee" in CSS is only this site's alias for the file.

## Verifying a rebuild

Inter only renders on non-Apple devices, so a Mac has to force it to test it:
add `:root { --font-ui: "Inter Variable", "Segoe UI", Roboto, sans-serif }` to
both builds. Pixel-diff the old and new builds on the same content, with `video`,
`canvas`, and maps hidden and the clock fixed. The site has no italics or CJK and
no project sets `showSignatures`, so a page with those cases has to be written for
the comparison. Compare the text rectangles too. A rect moving 0.06px is easier to
see there than in the pixels. Run it in Chromium and WebKit.
