import { useCallback, useEffect } from "react"
import type { SoundDefinition } from "@web-kits/audio"
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
// An idle callback alone is not a safe boundary: the browser can offer idle
// time between animation frames. Wait for the actual surface's animations,
// including the origin wrapper that Base UI's popup callback does not track.
let audioWarm = false

const silentWarmup: SoundDefinition = {
  source: { type: "sine", frequency: 440 },
  envelope: { attack: 0, decay: 0.001 },
  gain: 0,
}

/** Whether a sound can play now without building the AudioContext first. */
export const isAudioWarm = () => audioWarm

export function useAudioWarmup(surface: HTMLElement | null, open: boolean) {
  // The package's core and React entry points own separate contexts. Warm
  // through useSound itself so the first real sound reuses this exact one.
  const warm = useSound(silentWarmup, { volume: 0 })
  useEffect(() => {
    if (!open || !surface || audioWarm || typeof AudioContext === "undefined") return
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let idle: number | undefined
    let timeout: ReturnType<typeof setTimeout> | undefined
    const pending = () => surface.getAnimations({ subtree: true }).filter(animation =>
      (animation.playState === "running" || animation.playState === "paused")
      && Number.isFinite(animation.effect?.getComputedTiming().endTime))
    const settle = () => {
      if (cancelled || audioWarm) return
      const animations = pending()
      if (animations.length) {
        void Promise.allSettled(animations.map(animation => animation.finished)).then(settle)
        return
      }
      const build = () => {
        if (cancelled || audioWarm) return
        // A page switch can start between settling and receiving idle time.
        if (pending().length) { settle(); return }
        try { audioWarm = Boolean(warm()) } catch { /* Retry on the next open. */ }
      }
      if ("requestIdleCallback" in window) idle = window.requestIdleCallback(build, { timeout: 1000 })
      else timeout = setTimeout(build, 0)
    }
    settle()
    return () => {
      cancelled = true
      if (idle !== undefined) window.cancelIdleCallback(idle)
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }, [surface, open, warm])
}

/** A quick close or page turn must stay silent while the context is cold. */
export function useReadySound(definition: SoundDefinition, options: { volume: number }) {
  const play = useSound(definition, options)
  return useCallback(() => {
    if (audioWarm) return play()
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

// The pointer coming to rest on a tile of the work grid: a soft tap, felt more
// than heard. A reviewer asked for a cue on hover; it sits below the notes
// list's key clicks (0.15) because a sweep across the grid crosses several
// tiles, and it is a single muted body with no bright transient, so a run of
// them reads as fingertips on a desk rather than a row of buttons.
export const tileHoverSound: SoundDefinition = {
  layers: [
    {
      source: { type: "noise", color: "pink" },
      envelope: { attack: 0.001, decay: 0.01 },
      filter: [
        { type: "highpass", frequency: 700 },
        { type: "lowpass", frequency: 2400 },
      ],
      gain: 0.035,
    },
    {
      source: { type: "sine", frequency: { start: 620, end: 560 } },
      envelope: { attack: 0.002, decay: 0.032 },
      filter: { type: "lowpass", frequency: 1600 },
      gain: 0.08,
    },
  ],
}

const TILE_HOVER_VOLUME = { volume: 0.1 }
// A tile is far wider than a notes row, so a pointer crossing the grid moves
// onto a new one every 100ms or more; this only stops a diagonal clip of two
// corners from sounding twice.
const TILE_HOVER_GAP_MS = 90
const hoverTiles = ".mosaic-row-card, .writings-tile, .personal-photos-trigger"

/**
 * A tap for each grid tile the mouse moves onto. Mounted by the gallery, so it
 * only starts once a project has been opened and its warmup has built the
 * AudioContext: the context is never built from a hover, where its 166-750ms
 * would land in the middle of the tile's own hover motion. Movement rather than
 * entry, as the notes rows do it, so a page scrolled under a still pointer
 * stays quiet; and only a mouse, since a touch already answers with the open.
 */
export function useTileHoverSounds() {
  const play = useReadySound(tileHoverSound, TILE_HOVER_VOLUME)
  useEffect(() => {
    let hovered: Element | null = null
    let last = -Infinity
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || (event.movementX === 0 && event.movementY === 0)) return
      const tile = event.target instanceof Element ? event.target.closest(hoverTiles) : null
      if (tile === hovered) return
      hovered = tile
      if (!tile || event.timeStamp - last < TILE_HOVER_GAP_MS) return
      last = event.timeStamp
      play()
    }
    document.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => document.removeEventListener("pointermove", onPointerMove)
  }, [play])
}
