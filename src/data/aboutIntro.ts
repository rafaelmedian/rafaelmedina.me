import { aboutIntroPreview } from "./aboutIntroPreview"
import { aboutIntroProduction } from "./aboutIntroProduction"

export type IntroOption = "a" | "b" | "c"

export type AboutIntroMedia = {
  placeholder?: boolean
  duration: number
  transcript: string
  assets: {
    recording: string
    teaser: string
    poster: string
    captions: string
  }
}

// Importing public/ as source makes Vite warn, so CI compares this production
// module with the generated public manifest instead.
export const aboutIntro: AboutIntroMedia = aboutIntroProduction

export function getAboutIntro(): AboutIntroMedia | null {
  if (import.meta.env.DEV && typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search)
    if (params.get("intro") === "off") return null
    if (params.get("intro") === "preview" || params.has("introStyle")) return aboutIntroPreview
  }
  return aboutIntro
}
