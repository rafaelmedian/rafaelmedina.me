import { useEffect } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"

/** Dev-only, live plate geometry. Keep chosen defaults in personal-photos.css. */
export default function PhotoWallTuner() {
  const values = useDialKit("Photo wall curvature", {
    enabled: true,
    edgeTilt: [16, 0, 30, 0.5],
    centreFalloff: [1.35, 1, 3, 0.05],
    perspective: [1000, 500, 2000, 50],
    open: { type: "action", label: "Open photo wall" },
  }, {
    onAction: action => {
      if (action === "open") document.querySelector<HTMLElement>(".personal-photos-label")?.click()
    },
  })
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `html .personal-photos-sheet[data-layout="wall"] {
      --wall-curve-angle: ${values.enabled ? values.edgeTilt : 0};
      --wall-curve-power: ${values.centreFalloff};
      --wall-curve-perspective: ${values.perspective}px;
    }`
    document.head.append(style)
    window.dispatchEvent(new Event("photo-wall-curve-change"))
    return () => { style.remove(); window.dispatchEvent(new Event("photo-wall-curve-change")) }
  }, [values.enabled, values.edgeTilt, values.centreFalloff, values.perspective])
  return <DialRoot position="top-right" theme="light" />
}
