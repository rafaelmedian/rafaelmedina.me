import { useEffect, useRef } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"

/** Dev-only dials for the photo sheet's prints (`/?tune=photos`). They write
    the `--photo-*` properties personal-photos.css reads, one rule above its own
    so they win on the sheet and on the flights cloned onto <body> alike. The
    defaults mirror the stylesheet; carry a value you like back there by hand. */
export default function PhotoPrintTuner() {
  const { desktop, phone, hand } = useDialKit("Photo prints", {
    desktop: {
      frame: [11, 0, 24, 1],
      band: [33, 20, 72, 1],
      size: [13, 10, 20, 0.5],
      stroke: [0.05, 0, 1.5, 0.05],
    },
    phone: {
      frame: [9, 0, 16, 1],
      band: [34, 20, 56, 1],
      size: [11, 9, 16, 0.5],
      stroke: [0.2, 0, 1.2, 0.05],
    },
    hand: {
      tiltMin: [1.6, 0, 8, 0.05],
      tiltMax: [3, 0, 10, 0.05],
      spread: [0.44, 0, 1, 0.01],
      rise: [2, 0, 10, 0.5],
    },
    open: { type: "action", label: "Open the sheet" },
  }, {
    onAction: (action) => {
      if (action === "open") document.querySelector<HTMLElement>(".personal-photos-print")?.click()
    },
  })

  const style = useRef<HTMLStyleElement | null>(null)
  useEffect(() => {
    const element = document.createElement("style")
    element.dataset.photoPrintTuner = ""
    document.head.append(element)
    style.current = element
    return () => element.remove()
  }, [])

  useEffect(() => {
    if (!style.current) return
    const print = (values: typeof desktop) => `
      --photo-frame: ${values.frame}px;
      --photo-caption-band: ${values.band}px;
      --photo-caption-size: ${values.size}px;
      --photo-caption-stroke: ${values.stroke}px;`
    style.current.textContent = `
      html .personal-photos-slide {${print(desktop)}
        --photo-caption-tilt-min: ${Math.min(hand.tiltMin, hand.tiltMax)};
        --photo-caption-tilt-max: ${Math.max(hand.tiltMin, hand.tiltMax)};
        --photo-caption-spread: ${hand.spread};
        --photo-caption-rise: ${hand.rise}px;
      }
      @media (max-width: 699.98px) {
        html .personal-photos-slide {${print(phone)}
        }
      }`
  }, [desktop, phone, hand])

  return <DialRoot position="top-right" theme="light" />
}
