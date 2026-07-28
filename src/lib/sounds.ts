import type { SoundDefinition } from "@web-kits/audio"

// A soft, close "tock" rather than a rising flourish: a brief filtered
// transient for the snap, then a short low body that lands almost immediately.
// The previous two-octave sweep ran ~200ms and announced itself; opening a
// preview should feel like a latch, not a chime.
export const openSound: SoundDefinition = {
  layers: [
    {
      source: { type: "noise", color: "pink" },
      envelope: { attack: 0.001, decay: 0.016 },
      filter: [
        { type: "highpass", frequency: 900 },
        { type: "lowpass", frequency: 3800 },
      ],
      gain: 0.05,
    },
    {
      source: { type: "sine", frequency: { start: 440, end: 520 } },
      envelope: { attack: 0.002, decay: 0.065 },
      filter: { type: "lowpass", frequency: 1700, resonance: 0.4 },
      gain: 0.11,
    },
  ],
}

export const nextSound: SoundDefinition = {
  source: { type: "sine", frequency: { start: 520, end: 640 } },
  envelope: { attack: 0.002, decay: 0.055 },
  filter: { type: "lowpass", frequency: 2200 },
  gain: 0.12,
}

export const backSound: SoundDefinition = {
  source: { type: "sine", frequency: { start: 520, end: 400 } },
  envelope: { attack: 0.002, decay: 0.055 },
  filter: { type: "lowpass", frequency: 2200 },
  gain: 0.12,
}
