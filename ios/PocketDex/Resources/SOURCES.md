# Resource sources

Pokémon artwork: the 12 official-artwork PNGs from
https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/other/official-artwork
retrieved 2026-09-27. Pokémon characters and artwork belong to their respective
owners (Nintendo / Creatures / GAME FREAK). This is an unofficial fan demo;
the repository's code licence does not grant rights to Pokémon artwork.

Professor Oak portrait: anime artwork supplied by the author on 2026-09-28,
with its white background cut away. The character belongs to its owners
(Nintendo / Creatures / GAME FREAK).

Shell: original SwiftUI paths, gradients, and deterministic Canvas grain.
Clues: original text for this demo.
Audio: original synthesized WAVs produced by `scripts/prepare-resources.py`.
Fonts: system rounded and monospaced fonts, supplied by iOS.

Run `python3 scripts/prepare-resources.py` from the PocketDex directory to
fetch missing artwork and reproduce the audio. No requests occur in the app.
