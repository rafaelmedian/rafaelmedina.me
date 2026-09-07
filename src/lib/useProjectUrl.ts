import { useCallback, useSyncExternalStore } from "react"

const portfolioUrlEvent = "portfolio-item-url"
const portfolioEntryKey = "__rafaelMedinaPortfolioEntry"

type PortfolioItem = "project" | "writing"
type PortfolioEntry = "about" | PortfolioItem
let pendingPortfolioClose: PortfolioEntry | null = null
let queuedSelection: { entry: PortfolioItem; id: string } | null = null

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

export function closePortfolioUrl(url: string | URL, entry: PortfolioEntry, onClosed?: () => void) {
  if (getPortfolioEntry() === entry) {
    // Dialog libraries and app-level Escape handlers can both request the same
    // close before traversal completes. Consume an owned entry only once.
    if (pendingPortfolioClose === entry) return
    pendingPortfolioClose = entry

    const finishClose = () => {
      pendingPortfolioClose = null
      onClosed?.()

      const selection = queuedSelection
      queuedSelection = null
      if (!selection) return

      const url = new URL(window.location.href)
      url.searchParams.set(selection.entry, selection.id)
      pushPortfolioUrl(url, selection.entry)
      window.dispatchEvent(new Event(portfolioUrlEvent))
    }

    window.addEventListener("popstate", finishClose, { once: true })
    window.history.back()
    return
  }

  window.history.replaceState(window.history.state, "", url)
  onClosed?.()
}

function subscribe(listener: () => void) {
  window.addEventListener("popstate", listener)
  window.addEventListener(portfolioUrlEvent, listener)
  return () => {
    window.removeEventListener("popstate", listener)
    window.removeEventListener(portfolioUrlEvent, listener)
  }
}

// Prerender and the first hydration pass agree; a shared URL opens afterward.
const getServerItemId = () => null

export function usePortfolioItemUrl(entry: PortfolioItem) {
  const getItemId = useCallback(() => {
    // Report a requested close immediately while history traversal completes.
    if (pendingPortfolioClose === entry) return null
    return new URLSearchParams(window.location.search).get(entry)
  }, [entry])
  const itemId = useSyncExternalStore(subscribe, getItemId, getServerItemId)

  const selectItem = useCallback((id: string, replaceCurrent: boolean) => {
    if (pendingPortfolioClose === entry) {
      queuedSelection = { entry, id }
      return
    }

    const url = new URL(window.location.href)
    url.searchParams.set(entry, id)
    // One history entry per visit, so Back skips intermediate selections.
    if (replaceCurrent) window.history.replaceState(window.history.state, "", url)
    else pushPortfolioUrl(url, entry)
    window.dispatchEvent(new Event(portfolioUrlEvent))
  }, [entry])

  const clearItem = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.delete(entry)
    // Pop entries created here, but close direct bookmarks in place.
    closePortfolioUrl(url, entry)
    window.dispatchEvent(new Event(portfolioUrlEvent))
  }, [entry])

  return { itemId, selectItem, clearItem }
}

export function useProjectUrl() {
  const { itemId: projectId, selectItem: selectProject, clearItem: clearProject } = usePortfolioItemUrl("project")
  return { projectId, selectProject, clearProject }
}
