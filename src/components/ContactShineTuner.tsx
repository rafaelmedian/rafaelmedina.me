import { useEffect } from "react"
import { DialRoot, useDialKit } from "dialkit"
import "dialkit/styles.css"
import "./contact-shine-options.css"

export default function ContactShineTuner() {
  const { restingB, hoveredC, holdHover, speed } = useDialKit("Contact shine", {
    holdHover: false,
    restingB: {
      darkWidth: [1.03, 0.3, 1.5, 0.01],
      lightWidth: [1.03, 0.3, 1.5, 0.01],
      height: [23, 8, 36, 1],
      darkBlur: [1.2, 0, 8, 0.1],
      darkBrightness: [0.53, 0, 1, 0.01],
      lightBrightness: [0.45, 0, 1, 0.01],
    },
    hoveredC: {
      darkWidth: [1.08, 0.3, 1.5, 0.01],
      lightWidth: [1.02, 0.3, 1.5, 0.01],
      height: [23, 8, 36, 1],
      darkBlur: [2.8, 0, 8, 0.1],
      darkBrightness: [0.6, 0, 1, 0.01],
      lightBrightness: [1, 0, 1, 0.01],
    },
    speed: [160, 80, 600, 10],
  })

  useEffect(() => {
    const root = document.documentElement
    root.dataset.contactShine = holdHover ? "held" : "live"
    const values = {
      "--shine-rest": String(restingB.darkWidth),
      "--shine-light-rest": String(restingB.lightWidth),
      "--shine-opacity": String(restingB.lightBrightness),
      "--shine-dark-opacity": String(restingB.darkBrightness),
      "--shine-height": `${restingB.height}px`,
      "--shine-hover-height": `${hoveredC.height}px`,
      "--shine-blur": `${restingB.darkBlur}px`,
      "--shine-hover-blur": `${hoveredC.darkBlur}px`,
      "--shine-hover-dark-opacity": String(hoveredC.darkBrightness),
      "--shine-hover-opacity": String(hoveredC.lightBrightness),
      "--shine-expansion": String(hoveredC.lightWidth),
      "--shine-dark-expansion": String(hoveredC.darkWidth),
      "--shine-duration": `${speed}ms`,
    }
    for (const [name, value] of Object.entries(values)) root.style.setProperty(name, value)
    return () => {
      delete root.dataset.contactShine
      for (const name of Object.keys(values)) root.style.removeProperty(name)
    }
  }, [restingB, hoveredC, holdHover, speed])

  return <DialRoot position="top-right" theme="light" />
}
