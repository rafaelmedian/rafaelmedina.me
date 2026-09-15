import { useEffect } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"

const RADIUS_BASES = {
  "--radius-sm": 8,
  "--radius-md": 16,
  "--radius-lg": 24,
} as const

const RESUME_PAPER_SIZE = {
  width: 237,
  height: 280,
} as const

const RESUME_RADIUS_PROPERTIES = [
  "--resume-paper-radius-x",
  "--resume-paper-radius-y",
  "--resume-sheet-radius",
] as const

/** Dev-only controls for the shared rounded-rectangle curve and radius scale.
    It is the default homepage tuner; `/?tune=corners` remains an explicit
    route. The stylesheet remains the source of truth; removing the tuner
    removes its inline overrides and restores the production tokens. */
export default function CornerCurveTuner() {
  const { exponent, radiusScale, cvIllustrationRadius } = useDialKit("Continuous corners", {
    exponent: [1.25, 1, 4, 0.05],
    radiusScale: [1.55, 0.5, 2, 0.05],
    cvIllustrationRadius: [33, 0, 64, 1],
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--corner-curve", `superellipse(${exponent})`)
    for (const [token, base] of Object.entries(RADIUS_BASES)) {
      const radius = Number((base * radiusScale).toFixed(2))
      root.style.setProperty(token, `${radius}px`)
    }
    root.style.setProperty(
      "--resume-paper-radius-x",
      `${Number(((cvIllustrationRadius / RESUME_PAPER_SIZE.width) * 100).toFixed(3))}%`,
    )
    root.style.setProperty(
      "--resume-paper-radius-y",
      `${Number(((cvIllustrationRadius / RESUME_PAPER_SIZE.height) * 100).toFixed(3))}%`,
    )
    root.style.setProperty(
      "--resume-sheet-radius",
      `${Number(((cvIllustrationRadius / RESUME_PAPER_SIZE.width) * 100).toFixed(3))}cqw`,
    )
    return () => {
      root.style.removeProperty("--corner-curve")
      for (const token of Object.keys(RADIUS_BASES)) root.style.removeProperty(token)
      for (const property of RESUME_RADIUS_PROPERTIES) root.style.removeProperty(property)
    }
  }, [cvIllustrationRadius, exponent, radiusScale])

  return <DialRoot position="bottom-left" theme="light" />
}
