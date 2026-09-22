import { useEffect } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"

/** Dev-only, shared surface and independent Watch geometry. Keep chosen defaults in personal-photos.css. */
export default function PhotoWallTuner() {
  const values = useDialKit("Photo wall motion", {
    style: { type: "select", options: [{ value: "plate", label: "Curved surface" }, { value: "watch", label: "Watch" }], default: "plate" },
    enabled: true,
    bend: [0, 0, 1, 0.01],
    rim: [0.46, 0, 1, 0.01],
    gap: [8, 8, 64, 1],
    watchShrink: [0.65, 0, 0.9, 0.05],
    watchFalloff: [1.35, 1, 3, 0.05],
    open: { type: "action", label: "Open photo wall" },
  }, {
    onAction: action => {
      if (action === "open") document.querySelector<HTMLElement>(".personal-photos-label")?.click()
    },
  })
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `html .personal-photos-sheet[data-layout="wall"] {
      --wall-bend: ${values.enabled && values.style === "plate" ? values.bend : 0};
      --wall-rim: ${values.enabled && values.style === "plate" ? values.rim : 0};
      --wall-gap: ${values.gap}px;
      --wall-watch-shrink: ${values.enabled && values.style === "watch" ? values.watchShrink : 0};
      --wall-watch-power: ${values.watchFalloff};
    }`
    document.head.append(style)
    window.dispatchEvent(new Event("photo-wall-curve-change"))
    return () => { style.remove(); window.dispatchEvent(new Event("photo-wall-curve-change")) }
  }, [values.enabled, values.style, values.bend, values.rim, values.gap, values.watchShrink, values.watchFalloff])
  return <DialRoot position="top-right" theme="light" />
}
