import { lazy, Suspense } from "react"

import { SimpleFeed } from "./components/SimpleFeed"
import { portfolioCards, siteLinks, siteProfile } from "./data/portfolio"
import { shouldEnableVercelAnalytics } from "./lib/analytics"

const StyleguidePage = lazy(() =>
  import("./components/StyleguidePage").then((module) => ({ default: module.StyleguidePage })),
)
const VercelAnalytics = lazy(() =>
  import("@vercel/analytics/react").then((module) => ({ default: module.Analytics })),
)
const Agentation = import.meta.env.DEV
  ? lazy(() => import("agentation").then((module) => ({ default: module.Agentation })))
  : null

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
          <Suspense fallback={null}>
            <StyleguidePage links={siteLinks} name={siteProfile.name} />
          </Suspense>
        ) : (
          <main id="main-content" tabIndex={-1} className="relative z-dock">
            <SimpleFeed cards={portfolioCards} profile={siteProfile} links={siteLinks} showProjects />
          </main>
        )}
        {shouldEnableVercelAnalytics() ? (
          <Suspense fallback={null}>
            <VercelAnalytics />
          </Suspense>
        ) : null}
        {Agentation ? (
          <Suspense fallback={null}>
            <Agentation />
          </Suspense>
        ) : null}
    </div>
  )
}

export default App
