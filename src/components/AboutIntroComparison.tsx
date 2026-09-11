import { useState } from "react"
import AboutIntro from "./AboutIntro"
import { aboutIntroPreview } from "../data/aboutIntroPreview"
import type { IntroOption } from "./AboutIntroOptions"
import "./about-intro-comparison.css"

const options = [
  { value: "a", title: "Compact pill", description: "Hover the portrait, then an icon. The label grows into the button." },
  { value: "b", title: "Chat bubble", description: "A personal greeting with two clear ways to reply." },
  { value: "c", title: "Stacked buttons", description: "Two separate reply buttons, always within reach." },
] as const

export default function AboutIntroComparison() {
  const [playingOption, setPlayingOption] = useState<IntroOption | null>(null)
  return <main id="main-content" tabIndex={-1} className="intro-comparison">
    <header className="intro-comparison-header">
      <a href="/">Back to the site</a>
      <h1>Three ways to say hello</h1>
      <p>Try each portrait, play the video, or open a reply. Click outside a form to return to its buttons.</p>
    </header>
    <div className="intro-comparison-grid">
      {options.map(option => <section key={option.value} className="intro-comparison-card"
        data-variant={option.value.toUpperCase()} aria-labelledby={`option-${option.value}`}>
        <header>
          <span className="intro-comparison-letter" aria-hidden="true">{option.value.toUpperCase()}</span>
          <div><h2 id={`option-${option.value}`}>{option.title}</h2><p>{option.description}</p></div>
        </header>
        <div className="intro-comparison-stage">
          <AboutIntro media={aboutIntroPreview} variant={option.value} visible
            open={playingOption === option.value}
            onOpenChange={open => setPlayingOption(open ? option.value : null)} />
        </div>
        <a className="intro-comparison-context" href={`/?introStyle=${option.value}`}>Try {option.value.toUpperCase()} on the site</a>
      </section>)}
    </div>
    <p className="intro-comparison-note">Same video and reply forms in all three. Use the feedback button to leave a note on an option.</p>
  </main>
}
