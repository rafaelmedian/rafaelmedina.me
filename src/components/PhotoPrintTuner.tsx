import { useEffect, useRef } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"

/** Dev-only dials for the photo sheet's prints (`/?tune=photos`). They write
    the print padding and stage-caption size, one rule above the stylesheet
    so they win on the sheet and on the flights cloned onto <body> alike. The
    defaults mirror the stylesheet; carry a value you like back there by hand. */
export default function PhotoPrintTuner() {
  const { desktop, phone } = useDialKit("Photo prints", {
    desktop: {
      framePercent: [3.5, 0, 12, 0.1],
      size: [16, 10, 20, 0.5],
    },
    phone: {
      framePercent: [3.5, 0, 12, 0.1],
      size: [14, 9, 16, 0.5],
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
      html .personal-photos-slide {
        padding: calc(var(--photo-frame, 12rem) * ${values.framePercent / 100});
      }
      html .personal-photos-stage-caption { font-size: ${values.size}px; }`
    style.current.textContent = `
      ${print(desktop)}
      @media (max-width: 699.98px) { ${print(phone)} }`
  }, [desktop, phone])

  return <DialRoot position="top-right" theme="light" />
}
