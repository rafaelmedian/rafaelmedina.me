import { lazy, Suspense } from "react"

import { SimpleFeed } from "./components/SimpleFeed"
import { portfolioCards, siteLinks, siteProfile } from "./data/portfolio"

// Dev-only. The build prerenders `/` alone, so in production `/styleguide` is
// served by public/404.html and redirected home — shipping the chunk would be
// dead weight.
const StyleguidePage = import.meta.env.DEV
  ? lazy(() => import("./components/StyleguidePage").then((module) => ({ default: module.StyleguidePage })))
  : null
const Agentation = import.meta.env.DEV
  ? lazy(() => import("agentation").then((module) => ({ default: module.Agentation })))
  : null

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/"
  return pathname.replace(/\/+$/, "")
}

function App() {
  const currentPath = typeof window === "undefined" ? "/" : normalizePath(window.location.pathname)
  const isStyleguidePage = StyleguidePage !== null && currentPath === "/styleguide"

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {isStyleguidePage && StyleguidePage ? (
          <Suspense fallback={null}>
            <StyleguidePage links={siteLinks} name={siteProfile.name} />
          </Suspense>
        ) : (
          <main id="main-content" tabIndex={-1} className="relative z-dock">
            <SimpleFeed cards={portfolioCards} profile={siteProfile} links={siteLinks} />
          </main>
        )}
        {Agentation ? (
          <Suspense fallback={null}>
            <Agentation />
          </Suspense>
        ) : null}
    </div>
  )
}

export default App
