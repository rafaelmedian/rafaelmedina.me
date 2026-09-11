import { useEffect } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"

/** Dev-only control for the shared rounded-rectangle curve. It is the default
    homepage tuner; `/?tune=corners` remains an explicit route. The stylesheet
    remains the source of truth; removing
    the tuner removes its inline override and restores --corner-curve. */
export default function CornerCurveTuner() {
  const { exponent } = useDialKit("Continuous corners", {
    exponent: [1.2, 1, 4, 0.05],
  })

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--corner-curve", `superellipse(${exponent})`)
    return () => {
      root.style.removeProperty("--corner-curve")
    }
  }, [exponent])

  return <DialRoot position="bottom-left" theme="light" />
}
