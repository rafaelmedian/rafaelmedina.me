#!/usr/bin/env python3
"""Bundle extra pictures of each Pokémon for the scanner.

Squeezing a Pokémon on the scanner swaps it to its next picture: the shiny
artwork, its Pokémon HOME render, then the shiny HOME render. The scanner
draws them as about 112 CRT cells across, so each is shrunk to 128px here
to keep the app small. Needs macOS `sips`. No runtime network.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import json
import subprocess
import urllib.request

ASSETS = Path(__file__).resolve().parents[1] / 'Resources' / 'Assets.xcassets'
BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other'
# Name used in the asset catalog -> path under BASE. Order is the squeeze order.
PICTURES = {
    'shiny': 'official-artwork/shiny',
    'home': 'home',
    'home-shiny': 'home/shiny',
}
IDS = range(1, 152)


def fetch(job):
    number, picture, path = job
    name = f'picture-{number:03d}-{picture}'
    folder = ASSETS / f'{name}.imageset'
    folder.mkdir(exist_ok=True)
    target = folder / f'{name}.png'
    if not target.exists():
        urllib.request.urlretrieve(f'{BASE}/{path}/{number}.png', target)
        subprocess.run(['sips', '-Z', '128', str(target)], check=True, capture_output=True)
    (folder / 'Contents.json').write_text(json.dumps({
        'images': [{'filename': target.name, 'idiom': 'universal'}],
        'info': {'author': 'xcode', 'version': 1}}, indent=2) + '\n')


jobs = [(number, picture, path) for number in IDS for picture, path in PICTURES.items()]
with ThreadPoolExecutor(max_workers=16) as pool:
    list(pool.map(fetch, jobs))
print(f'{len(jobs)} pictures in {ASSETS}')
