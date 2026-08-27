import { lazy, Suspense } from "react"

import { BottomOverscrollEffect } from "./components/BottomOverscrollEffect"
import { SimpleFeed } from "./components/SimpleFeed"
import { portfolioCards, siteLinks, siteProfile } from "./data/portfolio"

// Dev-only. The build prerenders `/` alone, so in production `/design-system`
// is served by public/404.html and redirected home — shipping the chunk would
// be dead weight. The page's CSS rides the same lazy chunk, so none of it
// reaches the production stylesheet either.
const DesignSystemPage = import.meta.env.DEV
  ? lazy(() => import("./components/DesignSystemPage").then((module) => ({ default: module.DesignSystemPage })))
  : null

// `/styleguide` was the original path; keep it working rather than leaving a
// stale bookmark to fall through to the 404 redirect.
const DESIGN_SYSTEM_PATHS = new Set(["/design-system", "/styleguide"])
const Agentation = import.meta.env.DEV
  ? lazy(() => import("agentation").then((module) => ({ default: module.Agentation })))
  : null

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/"
  return pathname.replace(/\/+$/, "")
}

function App() {
  const currentPath = typeof window === "undefined" ? "/" : normalizePath(window.location.pathname)
  const isDesignSystemPage = DesignSystemPage !== null && DESIGN_SYSTEM_PATHS.has(currentPath)

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {isDesignSystemPage && DesignSystemPage ? (
          <Suspense fallback={null}>
            <DesignSystemPage links={siteLinks} name={siteProfile.name} />
          </Suspense>
        ) : (
          <>
            <main id="main-content" tabIndex={-1} className="relative z-dock">
              <SimpleFeed cards={portfolioCards} profile={siteProfile} links={siteLinks} />
            </main>
            <BottomOverscrollEffect />
          </>
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
