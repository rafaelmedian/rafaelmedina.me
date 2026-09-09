import { beginDialogIntent } from "./dialogIntent"
import { useCallback, useEffect, useSyncExternalStore } from "react"
import { portfolioCards } from "../data/portfolio"
import {
  isResumePath,
  projectAtPath,
  projectPath,
  resumeItemId,
  resumePath,
  updatePageMetadata,
} from "./projectMetadata"

const portfolioUrlEvent = "portfolio-item-url"
const portfolioEntryKey = "__rafaelMedinaPortfolioEntry"

type PortfolioItem = "gallery" | "writing"
type PortfolioEntry = "about" | PortfolioItem
let pendingPortfolioClose: PortfolioEntry | null = null
let queuedSelection: { entry: PortfolioItem; id: string } | null = null

// Every gallery item -- each project and the résumé -- has a prerendered page of
// its own, so it owns the path. Writings open over the feed with no static
// destination and stay a query parameter.
type ItemLocation = {
  read: () => string | null
  set: (url: URL, id: string) => void
  clear: (url: URL) => void
}

const itemLocations: Record<PortfolioItem, ItemLocation> = {
  gallery: {
    read: () => {
      if (isResumePath(window.location.pathname)) return resumeItemId
      return projectAtPath(window.location.pathname)?.id ?? new URLSearchParams(window.location.search).get("project")
    },
    set: (url, id) => {
      if (id === resumeItemId) {
        url.pathname = resumePath
        url.searchParams.delete("project")
        return
      }
      const card = portfolioCards.find(card => card.id === id)
      if (!card) return
      url.pathname = projectPath(card)
      url.searchParams.delete("project")
    },
    clear: url => {
      url.searchParams.delete("project")
      if (projectAtPath(url.pathname) || isResumePath(url.pathname)) url.pathname = "/"
    },
  },
  writing: {
    read: () => new URLSearchParams(window.location.search).get("writing"),
    set: (url, id) => url.searchParams.set("writing", id),
    clear: url => url.searchParams.delete("writing"),
  },
}

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
  beginDialogIntent(entry)
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

      const selectionUrl = new URL(window.location.href)
      itemLocations[selection.entry].set(selectionUrl, selection.id)
      pushPortfolioUrl(selectionUrl, selection.entry)
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
  const location = itemLocations[entry]

  const getItemId = useCallback(() => {
    // An owned close has already been requested even though history traversal
    // is asynchronous. Report the closed state immediately so error-boundary
    // resets cannot remount a failed view against the stale URL.
    if (pendingPortfolioClose === entry) return null
    return location.read()
  }, [entry, location])
  const itemId = useSyncExternalStore(subscribe, getItemId, getServerItemId)

  const selectItem = useCallback((id: string, replaceCurrent: boolean) => {
    beginDialogIntent(entry)
    if (pendingPortfolioClose === entry) {
      queuedSelection = { entry, id }
      return
    }

    const url = new URL(window.location.href)
    location.set(url, id)
    // One history entry per visit. Paging updates that entry so Back returns to
    // the portfolio rather than walking through every intermediate selection.
    if (replaceCurrent) window.history.replaceState(window.history.state, "", url)
    else pushPortfolioUrl(url, entry)
    window.dispatchEvent(new Event(portfolioUrlEvent))
  }, [entry, location])

  const clearItem = useCallback(() => {
    const url = new URL(window.location.href)
    location.clear(url)
    // Pop entries created by this portfolio, but close direct bookmarks in
    // place so an external previous entry cannot take the visitor off-site.
    closePortfolioUrl(url, entry)
    window.dispatchEvent(new Event(portfolioUrlEvent))
  }, [entry, location])

  // A newer dialog supersedes a pending deep link without traversing history
  // underneath that newer selection.
  const discardItem = useCallback(() => {
    const url = new URL(window.location.href)
    location.clear(url)
    window.history.replaceState(window.history.state, "", url)
    window.dispatchEvent(new Event(portfolioUrlEvent))
  }, [location])

  return { itemId, selectItem, clearItem, discardItem }
}

export function useGalleryUrl() {
  const { itemId, selectItem, clearItem } = usePortfolioItemUrl("gallery")

  // Keep an enhanced gallery visit's head in step with its static destination.
  useEffect(() => {
    if (itemId === resumeItemId) {
      updatePageMetadata(resumeItemId)
      return
    }
    updatePageMetadata(portfolioCards.find(card => card.id === itemId))
  }, [itemId])

  return { itemId, selectItem, clearItem }
}
