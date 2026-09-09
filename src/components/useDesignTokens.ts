import { useEffect, useState } from "react"

const paletteTokens = new Set([
  "--canvas", "--body-bg", "--mosaic-card-surface", "--body-color", "--ink",
  "--focus-ring", "--focus-ring-soft", "--muted", "--muted-soft", "--accent",
])

// Dev-reference only: read the same root custom properties the site consumes.
// Vite replaces style elements during HMR, so refresh the labels as well as the
// specimens whenever styles change. No token values are transcribed here.
export function useDesignTokens() {
  const [tokens, setTokens] = useState<Record<string, string>>({})

  useEffect(() => {
    let frame = 0
    // The shared palette is opaque. Resolve CSS color syntax to sRGB so the
    // contrast calculator and hex copy values also work for rgb(), hsl(), etc.
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    const context = canvas.getContext("2d", { willReadFrequently: true })
    const refresh = () => {
      const styles = getComputedStyle(document.documentElement)
      const next: Record<string, string> = { rootFontSize: styles.fontSize }
      for (const name of styles) {
        if (!name.startsWith("--")) continue
        const value = styles.getPropertyValue(name).trim()
        next[name] = value
        if (paletteTokens.has(name) && context && CSS.supports("color", value)) {
          context.clearRect(0, 0, 1, 1)
          context.fillStyle = value
          context.fillRect(0, 0, 1, 1)
          const [red, green, blue] = context.getImageData(0, 0, 1, 1).data
          next[name] = `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
        }
      }
      setTokens((previous) => {
        const unchanged = Object.keys(previous).length === Object.keys(next).length
          && Object.entries(next).every(([name, value]) => previous[name] === value)
        return unchanged ? previous : next
      })
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(refresh)
    }
    const observer = new MutationObserver(schedule)
    observer.observe(document.head, { childList: true, subtree: true, characterData: true })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    window.addEventListener("resize", schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return tokens
}
