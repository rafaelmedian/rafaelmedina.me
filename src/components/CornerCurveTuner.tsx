import { useEffect } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"

const RADIUS_BASES = {
  "--radius-sm": 8,
  "--radius-md": 16,
  "--radius-lg": 24,
} as const

/** Dev-only controls for the shared rounded-rectangle curve and radius scale.
    It is the default homepage tuner; `/?tune=corners` remains an explicit
    route. The stylesheet remains the source of truth; removing the tuner
    removes its inline overrides and restores the production tokens. */
export default function CornerCurveTuner() {
  const { exponent, radiusScale } = useDialKit("Continuous corners", {
    exponent: [1.3, 1, 4, 0.05],
    radiusScale: [1.3, 0.5, 2, 0.05],
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--corner-curve", `superellipse(${exponent})`)
    for (const [token, base] of Object.entries(RADIUS_BASES)) {
      const radius = Number((base * radiusScale).toFixed(2))
      root.style.setProperty(token, `${radius}px`)
    }
    return () => {
      root.style.removeProperty("--corner-curve")
      for (const token of Object.keys(RADIUS_BASES)) root.style.removeProperty(token)
    }
  }, [exponent, radiusScale])

  return <DialRoot position="bottom-left" theme="light" />
}
