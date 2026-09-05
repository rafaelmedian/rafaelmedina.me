import { useCallback, useSyncExternalStore } from "react"

const projectUrlEvent = "portfolio-project-url"
const portfolioEntryKey = "__rafaelMedinaPortfolioEntry"

type PortfolioEntry = "about" | "project"
let pendingPortfolioClose: PortfolioEntry | null = null
let queuedProjectSelection: string | null = null

function getPortfolioEntry() {
  const state = window.history.state
  if (!state || typeof state !== "object") return null
  return (state as Record<string, unknown>)[portfolioEntryKey]
}

function stateForPortfolioEntry(entry: PortfolioEntry) {
  const state = window.history.state
  const currentState = state && typeof state === "object" ? state : {}
  return { ...currentState, [portfolioEntryKey]: entry }
}

export function pushPortfolioUrl(url: string | URL, entry: PortfolioEntry) {
  window.history.pushState(stateForPortfolioEntry(entry), "", url)
}

export function closePortfolioUrl(url: string | URL, entry: PortfolioEntry) {
  if (getPortfolioEntry() === entry) {
    // Dialog libraries and app-level Escape handlers can both request the same
    // close before traversal completes. Consume an owned entry only once.
    if (pendingPortfolioClose === entry) return
    pendingPortfolioClose = entry

    const finishClose = () => {
      pendingPortfolioClose = null

      const projectId = queuedProjectSelection
      queuedProjectSelection = null
      if (!projectId) return

      const projectUrl = new URL(window.location.href)
      projectUrl.searchParams.set("project", projectId)
      pushPortfolioUrl(projectUrl, "project")
      window.dispatchEvent(new Event(projectUrlEvent))
    }

    window.addEventListener("popstate", finishClose, { once: true })
    window.history.back()
    return
  }

  window.history.replaceState(window.history.state, "", url)
}

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener)
  window.addEventListener(projectUrlEvent, listener)
  return () => {
    window.removeEventListener("popstate", listener)
    window.removeEventListener(projectUrlEvent, listener)
  }
}

function getProjectId() {
  // An owned close has already been requested even though history traversal is
  // asynchronous. Report the closed state immediately so error-boundary resets
  // cannot remount the failed gallery against the stale project URL.
  if (pendingPortfolioClose === "project") return null
  return new URLSearchParams(window.location.search).get("project")
}

// Prerender and the first hydration pass agree; a shared URL opens afterward.
const getServerProjectId = () => null

export function useProjectUrl() {
  const projectId = useSyncExternalStore(subscribe, getProjectId, getServerProjectId)

  const selectProject = useCallback((id: string, replaceCurrent: boolean) => {
    if (pendingPortfolioClose === "project") {
      queuedProjectSelection = id
      return
    }

    const url = new URL(window.location.href)
    url.searchParams.set("project", id)
    // One history entry per gallery visit. Paging updates that entry so Back
    // returns to the portfolio rather than walking through eleven previews.
    if (replaceCurrent) window.history.replaceState(window.history.state, "", url)
    else pushPortfolioUrl(url, "project")
    window.dispatchEvent(new Event(projectUrlEvent))
  }, [])

  const clearProject = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete("project")
    // Pop entries created by this portfolio, but close direct bookmarks in
    // place so an external previous entry cannot take the visitor off-site.
    closePortfolioUrl(url, "project")
    window.dispatchEvent(new Event(projectUrlEvent))
  }, [])

  return { projectId, selectProject, clearProject }
}
