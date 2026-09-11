import { useEffect, useRef, useState } from "react"
import AboutIntro from "./AboutIntro"
import { aboutIntroPreview } from "../data/aboutIntroPreview"
import type { IntroOption } from "./AboutIntroOptions"
import "./about-intro-comparison.css"

const options = [
  { value: "a", title: "Compact pill", description: "Hover the portrait, then an icon. The label grows into the button." },
  { value: "b", title: "Chat bubble", description: "A gentle hello, your email, then anything else you’d like to share." },
  { value: "c", title: "Stacked buttons", description: "Two separate reply buttons, always within reach." },
] as const

function ComparisonPreview({ variant, open, onOpenChange }: {
  variant: IntroOption
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])
  return <div ref={stageRef} className="intro-comparison-stage">
    <AboutIntro media={aboutIntroPreview} variant={variant} visible={visible}
      open={open} onOpenChange={onOpenChange} />
  </div>
}

export default function AboutIntroComparison() {
  const [playingOption, setPlayingOption] = useState<IntroOption | null>(null)
  return <main id="main-content" tabIndex={-1} className="intro-comparison">
    <header className="intro-comparison-header">
      <a href="/">Back to the site</a>
      <h1>Three ways to say hello</h1>
      <p>Try each portrait and reply flow. B starts with your email, then an optional message.</p>
    </header>
    <div className="intro-comparison-grid">
      {options.map(option => <section key={option.value} className="intro-comparison-card"
        data-variant={option.value.toUpperCase()} aria-labelledby={`option-${option.value}`}>
        <header>
          <span className="intro-comparison-letter" aria-hidden="true">{option.value.toUpperCase()}</span>
          <div><h2 id={`option-${option.value}`}>{option.title}</h2><p>{option.description}</p></div>
        </header>
        <ComparisonPreview variant={option.value} open={playingOption === option.value}
          onOpenChange={open => setPlayingOption(open ? option.value : null)} />
        <a className="intro-comparison-context" href={`/?introStyle=${option.value}`}>Try {option.value.toUpperCase()} on the site</a>
      </section>)}
    </div>
    <p className="intro-comparison-note">One video, three ways to start a conversation. Use the feedback button to leave a note on an option.</p>
  </main>
}
