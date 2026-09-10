import { beginDialogIntent } from "./dialogIntent"
import { useCallback, useEffect, useSyncExternalStore } from "react"
import { portfolioCards } from "../data/portfolio"
import { writingSummaries } from "../data/writingIndex"
import {
  isNotesPath,
  isResumePath,
  notesPath,
  projectAtPath,
  projectPath,
  resumeItemId,
  resumePath,
  updatePageMetadata,
  writingAtPath,
  writingPath,
  writingsItemId,
} from "./projectMetadata"

const portfolioUrlEvent = "portfolio-item-url"
const portfolioEntryKey = "__rafaelMedinaPortfolioEntry"

type PortfolioItem = "gallery" | "writing"
type PortfolioEntry = "about" | PortfolioItem
let pendingPortfolioClose: PortfolioEntry | null = null
let queuedSelection: { entry: PortfolioItem; id: string } | null = null

// Every project, the résumé, and every note has a prerendered page of its own,
// so each one owns its path.
type ItemLocation = {
  read: () => string | null
  set: (url: URL, id: string) => void
  clear: (url: URL) => void
}

const itemLocations: Record<PortfolioItem, ItemLocation> = {
  gallery: {
    read: () => {
      if (isResumePath(window.location.pathname)) return resumeItemId
      if (isNotesPath(window.location.pathname) || writingAtPath(window.location.pathname) ||
        writingSummaries.some(writing => writing.id === new URLSearchParams(window.location.search).get("writing"))) return writingsItemId
      return projectAtPath(window.location.pathname)?.id ?? new URLSearchParams(window.location.search).get("project")
    },
    set: (url, id) => {
      url.searchParams.delete("project")
      // A note the reader never opened -- an id nothing matches -- has no
      // business outliving the selection of something else.
      url.searchParams.delete("writing")
      if (id === resumeItemId) {
        url.pathname = resumePath
        return
      }
      if (id === writingsItemId) {
        url.pathname = notesPath
        return
      }
      const card = portfolioCards.find(card => card.id === id)
      if (!card) return
      url.pathname = projectPath(card)
    },
    clear: url => {
      url.searchParams.delete("project")
      if (projectAtPath(url.pathname) || isResumePath(url.pathname) || isNotesPath(url.pathname)) url.pathname = "/"
    },
  },
  writing: {
    read: () =>
      // `?writing=<id>` is where a note lived before it had a page of its own.
      // Links to one are out in the world, so the parameter still opens the
      // reader; the next selection writes the path over it.
      writingAtPath(window.location.pathname)?.id
        ?? new URLSearchParams(window.location.search).get("writing"),
    set: (url, id) => {
      const writing = writingSummaries.find(writing => writing.id === id)
      if (!writing) return
      url.pathname = writingPath(writing)
      url.searchParams.delete("writing")
    },
    clear: url => {
      url.searchParams.delete("writing")
      if (writingAtPath(url.pathname)) url.pathname = notesPath
    },
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

  // `onClosed` runs once the URL has actually given the item up. That is a
  // later tick when history has to be traversed, and the popstate it arrives
  // on retires every dialog intent opened before it -- so anything that opens
  // in this item's place has to wait for it rather than go first.
  const clearItem = useCallback((onClosed?: () => void) => {
    const url = new URL(window.location.href)
    location.clear(url)
    // Pop entries created by this portfolio, but close direct bookmarks in
    // place so an external previous entry cannot take the visitor off-site.
    closePortfolioUrl(url, entry, onClosed)
    window.dispatchEvent(new Event(portfolioUrlEvent))
  }, [entry, location])

  // A newer dialog supersedes a pending deep link without traversing history
  // underneath that newer selection.
  const discardItem = useCallback(() => {
    const url = new URL(window.location.href)
    location.clear(url)
    // Superseding a pending note is not Back into its parent list. Leave the
    // new dialog in charge instead of opening Notes behind it.
    if (entry === "writing" && isNotesPath(url.pathname)) url.pathname = "/"
    window.history.replaceState(window.history.state, "", url)
    window.dispatchEvent(new Event(portfolioUrlEvent))
  }, [entry, location])

  return { itemId, selectItem, clearItem, discardItem }
}

export function useGalleryUrl() {
  const { itemId, selectItem, clearItem } = usePortfolioItemUrl("gallery")
  // The note reader owns a path of its own, and its head has to be kept in step
  // with the same destinations. Both are read here rather than in each dialog
  // because only one of the two can describe the document at a time: whichever
  // one wrote it last would otherwise be overwritten by the other resetting to
  // the portfolio's own metadata.
  const { itemId: writingId } = usePortfolioItemUrl("writing")

  // Keep an enhanced visit's head in step with its static destination.
  useEffect(() => {
    const writing = writingSummaries.find(writing => writing.id === writingId)
    if (writing) {
      updatePageMetadata(writing)
      return
    }
    if (itemId === resumeItemId || itemId === writingsItemId) {
      updatePageMetadata(itemId)
      return
    }
    updatePageMetadata(portfolioCards.find(card => card.id === itemId))
  }, [itemId, writingId])

  return { itemId, selectItem, clearItem }
}
