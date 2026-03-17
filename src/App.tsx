import { Agentation } from "agentation"

import { SimpleFeed } from "./components/SimpleFeed"
import { StyleguidePage } from "./components/StyleguidePage"
import { portfolioCards, siteLinks, siteProfile } from "./data/portfolio"

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/"
  return pathname.replace(/\/+$/, "")
}

function App() {
  const currentPath = typeof window === "undefined" ? "/" : normalizePath(window.location.pathname)
  const isStyleguidePage = currentPath === "/styleguide"

  return (
    <div
      data-theme="light"
      className="relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]"
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {isStyleguidePage ? (
        <StyleguidePage links={siteLinks} name={siteProfile.name} />
      ) : (
        <main id="main-content" tabIndex={-1} className="relative z-dock">
          <SimpleFeed cards={portfolioCards} profile={siteProfile} links={siteLinks} showProjects={false} />
        </main>
      )}
      {import.meta.env.DEV ? <Agentation /> : null}
    </div>
  )
}

export default App
