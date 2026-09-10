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

// Set this to the generated manifest after the real recording and captions
// have been reviewed. A normal production visit never receives test footage.
export const aboutIntro: AboutIntroMedia | null = null

export function getAboutIntro(): AboutIntroMedia | null {
  if (import.meta.env.DEV && typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("intro") !== "off") {
    const base = "/tests/fixtures/about-intro"
    return {
      placeholder: true,
      duration: 5,
      transcript: "Synthetic video for testing the introduction player.",
      assets: {
        recording: `${base}/recording.mp4`,
        teaser: `${base}/teaser.gif`,
        poster: `${base}/poster.webp`,
        captions: `${base}/captions.vtt`,
      },
    }
  }
  return aboutIntro
}
