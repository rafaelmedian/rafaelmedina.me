import { useCallback } from "react"
import { ensureReady, type SoundDefinition } from "@web-kits/audio"
import { useSound } from "@web-kits/audio/react"

// Building the shared AudioContext is not free: Chrome opens the output device
// synchronously, 166-750ms on an M4 Max. The first sound of a visit is the
// gallery's open "tock", played from the click that opens it, so that cost
// landed in the frame that mounts the dialog and the first preview of a visit
// appeared already settled, its entrance spent under a stalled main thread.
//
// There is no free moment before that click to pay it in: the context may only
// be built after a user activation (before one, Chrome leaves it suspended and
// logs a warning), and a visitor's first activation is usually that very
// press. Even a hover warm-up lands there, since the tiles prefetch on the
// pointerdown too. So the cold open goes silent, and the context is built in
// idle time once its entrance has settled. Every sound after that plays at once.
// Two flags, not one: idle time can be a whole second away under load, and in
// between a close or a second open would read a warm context that does not
// exist yet and pay the build in the frame this is all here to keep clear.
let audioWarm = false
let warmScheduled = false

/** Whether a sound can play now without building the AudioContext first. */
export const isAudioWarm = () => audioWarm

export function warmAudioWhenIdle() {
  if (audioWarm || warmScheduled || typeof window === "undefined" || typeof AudioContext === "undefined") return
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return
  // Reduced motion mutes every sound here (useSound checks), so nothing to warm.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  warmScheduled = true
  // A failed build leaves both flags as they were, so the next open tries again.
  const build = () => void ensureReady().then(() => { audioWarm = true }, () => { warmScheduled = false })
  if ("requestIdleCallback" in window) window.requestIdleCallback(build, { timeout: 1000 })
  else globalThis.setTimeout(build, 0)
}

/** `useSound`, noting that any sound it plays has built the context. */
export function useWarmingSound(definition: SoundDefinition, options: { volume: number }) {
  const play = useSound(definition, options)
  return useCallback(() => {
    audioWarm = true
    return play()
  }, [play])
}

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
