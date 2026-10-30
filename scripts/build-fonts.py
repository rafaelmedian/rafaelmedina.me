#!/usr/bin/env python3
"""Cut the site's web fonts down to what it draws, and write their @font-face rules.

Run by hand and commit the output; the site build never runs this. It writes
public/fonts/<Family>-core.woff2 and -extended.woff2, plus src/styles/fonts.css.

    python3 -m venv /tmp/fonts-venv
    /tmp/fonts-venv/bin/pip install fonttools==4.60.2 brotli==1.2.1
    /tmp/fonts-venv/bin/python scripts/build-fonts.py          # rebuild
    /tmp/fonts-venv/bin/python scripts/build-fonts.py --check  # is a rebuild due?

Rerun it when the site starts to draw a non-ASCII character that a core file
lacks (--check lists them), when a font-weight leaves an axis range below, or when a new OpenType feature is switched on. docs/fonts.md has
the reasoning and how the output was verified.
"""

import argparse
import hashlib
import re
import sys
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
FONTS_DIR = ROOT / "public/fonts"
CSS_PATH = ROOT / "src/styles/fonts.css"
CACHE_DIR = ROOT / "node_modules/.cache/build-fonts"

GOOGLE_FONTS = "https://raw.githubusercontent.com/google/fonts/6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec/ofl"

ASCII = set(range(0x20, 0x7F))
LATIN_1 = set(range(0xA0, 0x100))
LATIN_EXT_A = set(range(0x100, 0x180))

# Curly quotes, dashes, ellipsis, plus what a browser or Intl emits on its own:
# text-overflow draws U+2026 from the primary face, and en-US times can put a
# U+202F before AM/PM, so neither is visible to a scan of the source.
CORE_PUNCTUATION = {0xA0, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026, 0x202F}

# Characters the site's text uses that these faces deliberately do not carry,
# because the next font in the stack draws them today and adding one is a
# visible change on every non-Apple device: the arrows in the photo-wall hint,
# α in "Sony α6700". ≤ and ≥ are design-system prose.
DRAWN_BY_THE_NEXT_FONT = set("←→≤≥α")

FONTS = [
    {
        "family": "Inter Variable",
        "file": "Inter",
        "url": "https://raw.githubusercontent.com/rsms/inter/v4.1/docs/font-files/InterVariable.ttf",
        "sha256": "4989b125924991b90d05b2d16e0e388c48f7d5bb8b30539bbf9c755278d0ccaf",
        # 400-700 in the stylesheets, 900 on the chat's Tapback symbols. Optical
        # size follows the font size in px and the site stops at 20.4px, but
        # opsz stays whole: narrowing it re-scales every delta, whose rounding
        # moved text by up to 0.06px and changed pixels on every page, to save
        # under 900 bytes. Above 400, wght keeps its deltas as they were.
        "limits": {"wght": (400, 900)},
        "weight": "400 900",
        # kern and the defaults the text relies on (calt: -> arrows, 10x20,
        # 12:30), tnum for font-variant-numeric. Leaving `zero` out keeps
        # work-history.css's slashed-zero a no-op, as it is today.
        "features": ["kern", "calt", "ccmp", "mark", "mkmk", "tnum"],
        # The one face that sets the site's text. The hands below only draw the
        # avatar hint, margin notes, and signatures, all ASCII plus punctuation.
        "core_includes_used_characters": True,
        "comment": """Inter Variable (SIL OFL 1.1; rsms/inter 4.1), the interface face everywhere the
   system's own is not SF: it sits behind the Apple names in --font-ui, so a Mac
   or an iPhone never asks for it. Not preloaded for that reason: a preload
   would cost every Apple visitor a download the stack never uses.""",
    },
    {
        "family": "Handlee",
        "file": "Handlee",
        "url": f"{GOOGLE_FONTS}/handlee/Handlee-Regular.ttf",
        "sha256": "7b99c0f291b5d52e06c66498a1d0dd6dff45a32e32d13be089c60d2d8dc00445",
        "weight": "400",
        "features": ["kern"],
        # CoreText draws small text differently at 1x when this font has no
        # glyph names, so it keeps them, as the old file did. Costs 84 bytes.
        "glyph_names": True,
        # Handlee is a Reserved Font Name, so a modified copy cannot carry it.
        # "Handlee" in CSS is only this site's alias for the file.
        "rename": {"family": "RM Hand", "postscript": "RMHand-Regular"},
        "comment": """Handlee (SIL OFL 1.1), the handwriting face for the avatar hint and note
   marginalia. Renamed inside the file: Handlee is a Reserved Font Name. The
   core file is preloaded from index.html.""",
    },
    {
        "family": "Caveat",
        "file": "Caveat",
        "url": f"{GOOGLE_FONTS}/caveat/Caveat%5Bwght%5D.ttf",
        "sha256": "0bdb6b660482d31531b3945849fba5916b3ef8695da7024a9e6b9ee3c4157988",
        # Only the project signatures use it, always at 500: their one override
        # (400) sits on the signature set in La Belle Aurore.
        "limits": {"wght": 500},
        "weight": "500",
        "features": ["kern", "calt", "liga"],
        "comment": "Caveat (SIL OFL 1.1), the contrasting hand in project signatures.",
    },
    {
        "family": "La Belle Aurore",
        "file": "LaBelleAurore",
        "url": f"{GOOGLE_FONTS}/labelleaurore/LaBelleAurore.ttf",
        "sha256": "ed67462999e05f0cdac92f686374661e4d68c56fdcd7d05725c6df7b41eabd2a",
        "weight": "400",
        "features": [],
        "comment": "La Belle Aurore (SIL OFL 1.1), Rafael's connected handwritten signature.",
    },
]

FONT_NAME_IDS = (1, 3, 4, 6, 16, 17)


def used_characters():
    """Every non-ASCII character in the site's source, escapes decoded."""
    paths = [ROOT / "index.html", ROOT / "public/404.html"]
    for suffix in ("ts", "tsx", "css"):
        paths += (ROOT / "src").rglob(f"*.{suffix}")
    used = set()
    for path in paths:
        if path == CSS_PATH:
            continue
        text = path.read_text(encoding="utf-8")
        text = re.sub(r"\\u\{?([0-9a-fA-F]{4,6})\}?", lambda m: chr(int(m[1], 16)), text)
        text = re.sub(r"&#x([0-9a-fA-F]+);", lambda m: chr(int(m[1], 16)), text)
        if path.suffix == ".css":
            text = re.sub(r"\\([0-9a-fA-F]{4,6})\s?", lambda m: chr(int(m[1], 16)), text)
        used |= {ord(c) for c in text if ord(c) > 0x7E and c != "\ufe0f"}
    return used


def split_characters(spec, font, used):
    """(core, extended) for one font, limited to what its source actually has."""
    available = set(font.getBestCmap())
    excluded = {ord(c) for c in DRAWN_BY_THE_NEXT_FONT}
    # A used character stays in core even when it is rare. Shaping does not
    # cross font files, so a character in the extended file loses its kerning
    # against its neighbours, and "Résumé" would start downloading that file.
    wanted = ASCII | CORE_PUNCTUATION
    if spec.get("core_includes_used_characters"):
        wanted |= used
    core = wanted & available - excluded
    extended = (LATIN_1 | LATIN_EXT_A) & available - excluded - core
    return core, extended


def load_source(spec):
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    path = CACHE_DIR / spec["sha256"]
    if not path.exists():
        print(f"downloading {spec['url']}")
        with urllib.request.urlopen(spec["url"]) as response:
            path.write_bytes(response.read())
    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != spec["sha256"]:
        path.unlink()
        sys.exit(f"{spec['url']} is not the pinned file: {digest}")
    # Keep the source's font-wide bounding box in head. Recomputing it for the
    # subset changes how CoreText rasterises the hand-drawn faces.
    return TTFont(path, recalcTimestamp=False, recalcBBoxes=False)


def build_file(spec, unicodes, out_path):
    font = load_source(spec)
    source_metrics = metrics(font)
    if "fvar" in font:
        font["fvar"].instances = []

    options = subset.Options()
    options.layout_features = spec["features"]
    options.hinting = False
    options.glyph_names = spec.get("glyph_names", False)
    options.legacy_cmap = False
    options.symbol_cmap = False
    options.name_languages = [0x409]
    # 0 is the copyright notice the OFL requires in each copy. The license
    # itself ships beside the fonts as public/fonts/*-OFL.txt.
    options.name_IDs = [0, 1, 2, 3, 4, 5, 6]
    options.drop_tables += ["STAT", "DSIG", "meta"]
    options.recalc_timestamp = False
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=sorted(unicodes))
    subsetter.subset(font)
    # The subsetter keeps extra code points for glyphs it retains (Inter's ‹
    # arrives with ›), and unicode-range must list only what the file holds.
    for table in font["cmap"].tables:
        table.cmap = {point: glyph for point, glyph in table.cmap.items() if point in unicodes}

    # Subset before limiting axes: the instancer drops gvar entries for glyphs
    # left without deltas, and the subsetter then raises a KeyError on them.
    if "limits" in spec:
        # Leave the overlap flags alone: the shipped files have never set them,
        # and they change how FreeType antialiases a glyph.
        font = instancer.instantiateVariableFont(
            font, spec["limits"], overlap=instancer.OverlapMode.KEEP_AND_DONT_SET_FLAGS
        )

    if "rename" in spec:
        rename(font, spec["rename"])
    check_output(spec, font, unicodes, source_metrics)

    font.flavor = "woff2"
    font.save(out_path, reorderTables=None)
    return out_path.stat().st_size


def rename(font, names):
    table = font["name"]
    for record in list(table.names):
        if record.nameID in (1, 16):
            record.string = names["family"]
        elif record.nameID == 3:
            record.string = f"{font['head'].fontRevision:.3f};{names['postscript']}"
        elif record.nameID == 4:
            record.string = names["family"]
        elif record.nameID == 6:
            record.string = names["postscript"]


def metrics(font):
    os2 = font["OS/2"]
    hhea = font["hhea"]
    return (
        font["head"].unitsPerEm,
        hhea.ascent,
        hhea.descent,
        hhea.lineGap,
        os2.sTypoAscender,
        os2.sTypoDescender,
        os2.sTypoLineGap,
        os2.usWinAscent,
        os2.usWinDescent,
        os2.fsSelection & 0x80,
    )


def check_output(spec, font, unicodes, source_metrics):
    """Tool quirks that would otherwise only surface as a rendering change."""
    if set(font.getBestCmap()) != unicodes:
        sys.exit(f"{spec['file']}: cmap does not match the unicode-range")
    if metrics(font) != source_metrics:
        sys.exit(f"{spec['file']}: vertical metrics moved, which moves every baseline")
    leftovers = {"fpgm", "prep", "cvt ", "cvar", "hdmx", "VDMX", "LTSH", "STAT"} & set(font.keys())
    if leftovers:
        sys.exit(f"{spec['file']}: hinting or unused tables survived: {sorted(leftovers)}")
    if "rename" in spec:
        reserved = spec["family"].lower()
        for record in font["name"].names:
            if record.nameID in FONT_NAME_IDS and reserved in record.toUnicode().lower():
                sys.exit(f"{spec['file']}: Reserved Font Name left in name ID {record.nameID}")


def unicode_range(codepoints):
    runs = []
    for point in sorted(codepoints):
        if runs and point == runs[-1][1] + 1:
            runs[-1][1] = point
        else:
            runs.append([point, point])
    return ", ".join(f"U+{a:04X}" if a == b else f"U+{a:04X}-{b:04X}" for a, b in runs)


def face_rule(spec, filename, codepoints):
    ranges = unicode_range(codepoints)
    lines, line = [], "  unicode-range:"
    for part in ranges.split(", "):
        if len(line) + len(part) + 2 > 96:
            lines.append(line)
            line = "   "
        line += f" {part},"
    lines.append(line[:-1] + ";")
    wrapped = "\n".join(lines)
    return f"""@font-face {{
  font-family: "{spec['family']}";
  font-style: normal;
  font-weight: {spec['weight']};
  font-display: swap;
  src: url("/fonts/{filename}") format("woff2");
{wrapped}
}}
"""


def write_css(blocks):
    CSS_PATH.write_text(
        """/* Generated by scripts/build-fonts.py. Do not edit: change the script and rerun
   it. Each family is two files. The core has ASCII, common punctuation, and
   (in Inter) every character the site's text uses; the extended file has the
   rest of Latin-1 and Latin Extended-A and downloads only for a page that needs
   one of them. */

"""
        + "\n".join(blocks),
        encoding="utf-8",
    )


def declared_core_range(spec):
    css = CSS_PATH.read_text(encoding="utf-8")
    url = f'url("/fonts/{spec["file"]}-core.woff2")'
    block = css[css.index(url):]
    declared = set()
    for token in re.findall(r"U\+([0-9A-F]+)(?:-([0-9A-F]+))?", block[: block.index("}")]):
        first = int(token[0], 16)
        declared |= set(range(first, int(token[1] or token[0], 16) + 1))
    return declared


def check(used):
    missing = False
    for spec in FONTS:
        core, _ = split_characters(spec, load_source(spec), used)
        for point in sorted(core - declared_core_range(spec)):
            missing = True
            print(f"{spec['family']}: U+{point:04X} {chr(point)} is used but not in the core file")
    if missing:
        sys.exit("Rerun scripts/build-fonts.py and commit the result.")
    print("Every character the site uses is in the core files.")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--check", action="store_true", help="only report whether a rebuild is due")
    args = parser.parse_args()

    used = used_characters()
    if args.check:
        check(used)
        return

    blocks = []
    for spec in FONTS:
        core, extended = split_characters(spec, load_source(spec), used)
        rules = []
        for part, unicodes in (("core", core), ("extended", extended)):
            filename = f"{spec['file']}-{part}.woff2"
            size = build_file(spec, unicodes, FONTS_DIR / filename)
            print(f"{filename:32} {size:7,} bytes  {len(unicodes):3} characters")
            rules.append(face_rule(spec, filename, unicodes))
        blocks.append(f"/* {spec['comment']} */\n" + "".join(rules))
    write_css(blocks)


if __name__ == "__main__":
    main()
