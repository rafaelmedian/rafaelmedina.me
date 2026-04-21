import type { SoundDefinition } from "@web-kits/audio"

export const openSound: SoundDefinition = {
  layers: [
    {
      source: { type: "sine", frequency: { start: 320, end: 560 } },
      envelope: { attack: 0.004, decay: 0.14, release: 0.06 },
      filter: { type: "lowpass", frequency: 2400, resonance: 0.6 },
      gain: 0.22,
    },
    {
      source: { type: "triangle", frequency: { start: 640, end: 1120 } },
      envelope: { attack: 0.002, decay: 0.08 },
      gain: 0.08,
    },
  ],
}

export const nextSound: SoundDefinition = {
  source: { type: "sine", frequency: { start: 520, end: 640 } },
  envelope: { attack: 0.002, decay: 0.07 },
  filter: { type: "lowpass", frequency: 2800 },
  gain: 0.2,
}

export const backSound: SoundDefinition = {
  source: { type: "sine", frequency: { start: 520, end: 400 } },
  envelope: { attack: 0.002, decay: 0.07 },
  filter: { type: "lowpass", frequency: 2800 },
  gain: 0.2,
}
