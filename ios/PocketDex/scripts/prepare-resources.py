#!/usr/bin/env python3
"""Bundle official artwork and synthesize original UI bleeps. No runtime network."""
from pathlib import Path
import json
import math
import struct
import urllib.request
import wave

ROOT = Path(__file__).resolve().parents[1] / 'Resources'
IDS = [1, 4, 7, 25, 39, 52, 54, 72, 94, 129, 133, 143]
ASSETS = ROOT / 'Assets.xcassets'
ASSETS.mkdir(parents=True, exist_ok=True)
(ASSETS / 'Contents.json').write_text(json.dumps({'info': {'author': 'xcode', 'version': 1}}))
for number in IDS:
    name = f'pokemon-{number:03d}'
    folder = ASSETS / f'{name}.imageset'
    folder.mkdir(exist_ok=True)
    url = f'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{number}.png'
    target = folder / f'{name}.png'
    if not target.exists():
        urllib.request.urlretrieve(url, target)
    (folder / 'Contents.json').write_text(json.dumps({
        'images': [{'filename': target.name, 'idiom': 'universal'}],
        'info': {'author': 'xcode', 'version': 1}}, indent=2) + '\n')

for name, notes in {
    'open': [(523, .075), (659, .075), (784, .13)],
    'select': [(330, .025)],
    'wrong': [(180, .075), (130, .1)],
    'capture': [(523, .07), (659, .07), (784, .07), (1047, .20)],
    'close': [(220, .045), (110, .075)],
}.items():
    with wave.open(str(ROOT / f'{name}.wav'), 'wb') as audio:
        audio.setnchannels(1)
        audio.setsampwidth(2)
        audio.setframerate(22050)
        frames = bytearray()
        for freq, duration in notes:
            count = int(duration * 22050)
            for index in range(count):
                t = index / 22050
                envelope = min(1, index / 100, (count - index) / 220)
                sample = math.sin(2 * math.pi * freq * t) + .16 * math.sin(4 * math.pi * freq * t)
                frames += struct.pack('<h', int(sample * envelope * 4300))
        audio.writeframes(frames)
