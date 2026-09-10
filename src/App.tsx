import { lazy, Suspense, useState, useSyncExternalStore } from "react"

import { BottomOverscrollEffect } from "./components/BottomOverscrollEffect"
import { SimpleFeed } from "./components/SimpleFeed"
import { portfolioCards, siteLinks, siteProfile } from "./data/portfolio"
import { isNotesPath, isResumePath, projectAtPath, writingAtPath } from "./lib/projectMetadata"
import { ProjectPage } from "./components/ProjectPage"
import { ResumePage } from "./components/ResumePage"
import { NotesPage } from "./components/NotesPage"
import { DeferredWritingPage } from "./components/DeferredWritingPage"
import { getWritingPage } from "./lib/writingPageSlot"

// Dev-only. In production `/design-system` is served by public/404.html — shipping the chunk would
// be dead weight. The page's CSS rides the same lazy chunk, so none of it
// reaches the production stylesheet either.
const DesignSystemPage = import.meta.env.DEV
  ? lazy(() => import("./components/DesignSystemPage").then((module) => ({ default: module.DesignSystemPage })))
  : null

// `/styleguide` was the original path; keep it working rather than leaving a
// stale development bookmark to fall through to the portfolio.
const DESIGN_SYSTEM_PATHS = new Set(["/design-system", "/styleguide"])
const Agentation = import.meta.env.DEV
  ? lazy(() => import("agentation").then((module) => ({ default: module.Agentation })))
  : null
const ElasticEdgeTuner = import.meta.env.DEV
  ? lazy(() => import("./components/ElasticEdgeTuner"))
  : null

function normalizePath(pathname: string) {
  if (!pathname || pathname === "/") return "/"
  return pathname.replace(/\/+$/, "")
}

// False through the hydration pass and true from the first client render
// after it, so a swap made on this lands in a commit React already schedules.
const neverChanges = () => () => {}
function useIsHydrated() {
  return useSyncExternalStore(neverChanges, () => true, () => false)
}

function App({ pathname }: { pathname?: string }) {
  // Select the document at mount. History changes within the homepage keep its
  // enhanced gallery mounted.
  const [currentPath] = useState(() => normalizePath(pathname ?? (typeof window === "undefined" ? "/" : window.location.pathname)))
  // Every project, the résumé, and every note is prerendered
  // as a standalone article, so a crawler or a visitor without JavaScript reads
  // the whole thing from the HTML. Once React is running the same URL belongs in
  // the dialog it was shared from -- the gallery for a project or the résumé,
  // the notes reader for a note: hand the feed the path and the dialog opens
  // that item over it. The article still renders on the first client pass,
  // so hydration matches the prerendered markup before the swap.
  const isHydrated = useIsHydrated()
  const standaloneProject = isHydrated ? undefined : projectAtPath(currentPath)
  const standaloneResume = !isHydrated && isResumePath(currentPath)
  const standaloneWriting = isHydrated ? undefined : writingAtPath(currentPath)
  const standaloneNotes = !isHydrated && isNotesPath(currentPath)
  const isDesignSystemPage = DesignSystemPage !== null && DESIGN_SYSTEM_PATHS.has(currentPath)
  const isTuningEdge = ElasticEdgeTuner !== null && !isDesignSystemPage
    && typeof window !== "undefined" && new URLSearchParams(window.location.search).get("tune") === "edge"

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-canvas text-ink">
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
              {standaloneProject ? <ProjectPage card={standaloneProject} /> : standaloneResume ? <ResumePage /> : standaloneNotes ? <NotesPage /> : standaloneWriting && getWritingPage() ? (
                <DeferredWritingPage writing={standaloneWriting} />
              ) : (
                <>
                  <SimpleFeed cards={portfolioCards} profile={siteProfile} links={siteLinks} />
                  <BottomOverscrollEffect />
                </>
              )}
            </main>
          </>
        )}
        {Agentation ? (
          <Suspense fallback={null}>
            <Agentation className="portfolio-feedback-toolbar max-[699.98px]:bottom-[calc(6rem+env(safe-area-inset-bottom))]!" />
          </Suspense>
        ) : null}
        {isTuningEdge && ElasticEdgeTuner ? (
          <Suspense fallback={null}>
            <ElasticEdgeTuner />
          </Suspense>
        ) : null}
    </div>
  )
}

export default App
