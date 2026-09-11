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

// The latch letting go. Same two-part shape as `openSound` so the pair reads as
// one mechanism, but mirrored: the sweep falls instead of rising, and the
// transient is duller and quieter — a close is an ending, so it should sit
// below the open rather than answer it at the same volume.
export const closeSound: SoundDefinition = {
  layers: [
    {
      source: { type: "noise", color: "pink" },
      envelope: { attack: 0.001, decay: 0.013 },
      filter: [
        { type: "highpass", frequency: 600 },
        { type: "lowpass", frequency: 2600 },
      ],
      gain: 0.04,
    },
    {
      source: { type: "sine", frequency: { start: 420, end: 310 } },
      envelope: { attack: 0.002, decay: 0.075 },
      filter: { type: "lowpass", frequency: 1400, resonance: 0.4 },
      gain: 0.1,
    },
  ],
}

// A key going down, for the pointer passing over a row of the notes list: a
// list of titles read like a line being typed. Three layers, as a switch has
// them -- the bright snap of the leaf, the plate ticking under it a moment
// later, and the cap bottoming out as a low, quick thock. Far shorter and
// quieter than anything the gallery plays: it answers a hover, which happens
// many times a second, so it has to sit under the room rather than in it.
//
// Three keys rather than one, differing in the thock's pitch and the snap's
// brightness, because a run of rows played the same sample back and read as a
// machine ticking rather than as fingers on a board.
const keyClick = (thock: number, snap: number): SoundDefinition => ({
  layers: [
    {
      source: { type: "noise", color: "white" },
      envelope: { attack: 0.0005, decay: 0.006 },
      filter: [
        { type: "highpass", frequency: snap },
        { type: "lowpass", frequency: 9000 },
      ],
      gain: 0.07,
    },
    {
      source: { type: "noise", color: "pink" },
      envelope: { attack: 0.001, decay: 0.016 },
      filter: { type: "bandpass", frequency: thock * 5, resonance: 2.5 },
      gain: 0.05,
      delay: 0.002,
    },
    {
      source: { type: "sine", frequency: { start: thock, end: thock * 0.6 } },
      envelope: { attack: 0.001, decay: 0.028 },
      filter: { type: "lowpass", frequency: 1200 },
      gain: 0.12,
      delay: 0.003,
    },
  ],
})

export const keyClickSounds: readonly SoundDefinition[] = [
  keyClick(300, 2600),
  keyClick(265, 3000),
  keyClick(335, 2300),
]
