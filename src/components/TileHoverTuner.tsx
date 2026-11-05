import { useEffect, useRef } from "react"
import { DialRoot, useDialKitController } from "dialkit"
import "dialkit/styles.css"

/** Dev-only dials for the work tiles' hover state (`/?tune=hover`).

    Every look is built from the same four parts, so the presets are just
    starting points on one set of dials:
      inner ring  -- a dark hairline with a light band inside it (::after, over the artwork)
      shadow      -- a soft drop shadow behind the tile (::before)
      halo        -- a flat ring just outside the tile (::before)
      lift        -- the tile rising a few px
    Both pseudo-elements fade on opacity only, so the hover stays composited:
    the ring and shadow are painted once, never re-rastered per frame.

    The quote cards get the same hover. They clip their overflow, so a ring on
    the card itself lands inside its padding box -- 1px in from the border,
    on a tighter curve -- and reads as a second line. Both of the quote's
    layers hang off the row item instead: it is exactly the card's border box,
    and it takes the card's radius, so the ring lands on the border.

    "Pin" holds the hover on one pale tile, one dark tile, and the first quote
    so they can be compared without moving the pointer. Carry the numbers you like back into
    work-grid.css by hand. */

const PRESETS = {
  none: { lightWidth: 0, lightAlpha: 0, darkWidth: 0, darkAlpha: 0, y: 0, blur: 0, shadowAlpha: 0, spread: 0, haloAlpha: 0, lift: 0 },
  "ring-light": { lightWidth: 2, lightAlpha: 0.85, darkWidth: 1, darkAlpha: 0.1, y: 0, blur: 0, shadowAlpha: 0, spread: 0, haloAlpha: 0, lift: 0 },
  "ring-dark": { lightWidth: 0, lightAlpha: 0, darkWidth: 1.5, darkAlpha: 0.22, y: 0, blur: 0, shadowAlpha: 0, spread: 0, haloAlpha: 0, lift: 0 },
  shadow: { lightWidth: 0, lightAlpha: 0, darkWidth: 0, darkAlpha: 0, y: 10, blur: 28, shadowAlpha: 0.12, spread: 0, haloAlpha: 0, lift: 0 },
  halo: { lightWidth: 0, lightAlpha: 0, darkWidth: 0, darkAlpha: 0, y: 0, blur: 0, shadowAlpha: 0, spread: 4, haloAlpha: 0.07, lift: 0 },
  combo: { lightWidth: 1.5, lightAlpha: 0.7, darkWidth: 1, darkAlpha: 0.08, y: 10, blur: 28, shadowAlpha: 0.1, spread: 0, haloAlpha: 0, lift: 0 },
  lift: { lightWidth: 0, lightAlpha: 0, darkWidth: 0, darkAlpha: 0, y: 12, blur: 28, shadowAlpha: 0.1, spread: 0, haloAlpha: 0, lift: 2 },
} as const

type PresetName = keyof typeof PRESETS
const PRESET_NAMES = Object.keys(PRESETS) as PresetName[]

const PIN_LABELS = [/^Open Twilio Admiral/, /^Open Matcha launch films/]

export default function TileHoverTuner() {
  const start = PRESETS["ring-dark"]
  const dial = useDialKitController("Tile hover", {
    preset: { type: "select", options: PRESET_NAMES, default: "ring-dark" },
    pin: true,
    innerRing: {
      lightWidth: [start.lightWidth, 0, 6, 0.5],
      lightAlpha: [0.86, 0, 1, 0.01],
      darkWidth: [start.darkWidth, 0, 3, 0.5],
      darkAlpha: [start.darkAlpha, 0, 0.5, 0.01],
    },
    shadow: {
      y: [start.y, 0, 32, 1],
      blur: [start.blur, 0, 64, 1],
      alpha: [start.shadowAlpha, 0, 0.4, 0.01],
    },
    halo: {
      spread: [start.spread, 0, 12, 0.5],
      alpha: [start.haloAlpha, 0, 0.3, 0.01],
    },
    lift: [start.lift, 0, 8, 0.5],
    durationMs: [150, 0, 600, 10],
  })
  const { values, setValues } = dial

  // Choosing a preset loads its numbers onto the dials; from there every dial
  // stays live, so a preset is a starting point rather than a mode.
  const appliedPreset = useRef<string>("ring-dark")
  useEffect(() => {
    if (values.preset === appliedPreset.current) return
    appliedPreset.current = values.preset
    const p = PRESETS[values.preset as PresetName]
    if (!p) return
    setValues({
      innerRing: { lightWidth: p.lightWidth, lightAlpha: p.lightAlpha, darkWidth: p.darkWidth, darkAlpha: p.darkAlpha },
      shadow: { y: p.y, blur: p.blur, alpha: p.shadowAlpha },
      halo: { spread: p.spread, alpha: p.haloAlpha },
      lift: p.lift,
    })
  }, [setValues, values.preset])

  useEffect(() => {
    const cards = values.pin
      ? [...document.querySelectorAll<HTMLElement>(".mosaic-row-card")].filter((card) =>
          PIN_LABELS.some((label) => label.test(card.getAttribute("aria-label") ?? "")),
        )
      : []
    const quote = values.pin ? document.querySelector<HTMLElement>(".mosaic-row-quote") : null
    if (quote) cards.push(quote)
    for (const card of cards) card.dataset.tileHoverPin = ""
    return () => {
      for (const card of cards) delete card.dataset.tileHoverPin
    }
  }, [values.pin])

  const style = useRef<HTMLStyleElement | null>(null)
  useEffect(() => {
    const element = document.createElement("style")
    element.dataset.tileHoverTuner = ""
    document.head.append(element)
    style.current = element
    return () => element.remove()
  }, [])

  useEffect(() => {
    if (!style.current) return
    const { innerRing: ring, shadow, halo, lift, durationMs } = values
    const inner = [
      ring.darkWidth > 0 && `inset 0 0 0 ${ring.darkWidth}px rgb(0 0 0 / ${ring.darkAlpha})`,
      ring.lightWidth > 0 && `inset 0 0 0 ${ring.darkWidth + ring.lightWidth}px rgb(255 255 255 / ${ring.lightAlpha})`,
    ].filter(Boolean).join(", ") || "none"
    const outer = [
      halo.spread > 0 && `0 0 0 ${halo.spread}px rgb(0 0 0 / ${halo.alpha})`,
      shadow.alpha > 0 && `0 1px 2px rgb(0 0 0 / ${(shadow.alpha / 2).toFixed(3)})`,
      shadow.alpha > 0 && `0 ${shadow.y}px ${shadow.blur}px rgb(0 0 0 / ${shadow.alpha})`,
    ].filter(Boolean).join(", ") || "none"
    const hovered = `.mosaic-row-card:is(:hover, [data-tile-hover-pin])`
    const quoteHovered = `.mosaic-row-quote:is(:hover, [data-tile-hover-pin])`

    style.current.textContent = `
      .mosaic-row-card,
      .mosaic-row-quote {
        transition:
          background-color var(--duration-quick) var(--ease-standard),
          border-color var(--duration-quick) var(--ease-standard),
          translate ${durationMs}ms var(--ease-standard);
      }
      .mosaic-row-quote { position: relative; border-radius: var(--radius-lg); }
      @media (max-width: 899.98px) {
        .mosaic-row-quote { border-radius: var(--radius-md); }
      }
      .mosaic-row-card::before,
      .mosaic-row-card::after,
      .mosaic-row-quote::before,
      .mosaic-row-quote::after {
        content: "";
        position: absolute;
        inset: -1px;
        pointer-events: none;
        border-radius: inherit;
        corner-shape: inherit;
        opacity: 0;
        transition: opacity ${durationMs}ms var(--ease-standard);
      }
      .mosaic-row-quote::before,
      .mosaic-row-quote::after { inset: 0; }
      .mosaic-row-quote::after { z-index: 3; box-shadow: ${inner}; }
      .mosaic-row-quote::before { z-index: -1; box-shadow: ${outer}; }
      .mosaic-row-card::after { z-index: 2; box-shadow: ${inner}; }
      .mosaic-row-card::before { z-index: -1; box-shadow: ${outer}; }
      ${hovered}::before,
      ${hovered}::after,
      ${quoteHovered}::before,
      ${quoteHovered}::after { opacity: 1; }
      ${hovered},
      ${quoteHovered} { translate: 0 ${-lift}px; }`
  }, [values])

  return <DialRoot position="top-right" theme="light" defaultOpen />
}
