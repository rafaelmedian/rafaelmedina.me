import { Agentation } from "agentation"

import { SimpleFeed } from "./components/SimpleFeed"
import { portfolioCards, siteLinks, siteProfile } from "./data/portfolio"

function App() {
  return (
    <div
      data-theme="light"
      className="relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]"
    >
      <main className="relative z-dock">
        <SimpleFeed cards={portfolioCards} profile={siteProfile} links={siteLinks} />
      </main>
      {import.meta.env.DEV ? <Agentation /> : null}
    </div>
  )
}

export default App
