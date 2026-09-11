import { useSound } from "@web-kits/audio/react"
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react"

import { writingPreviews } from "../data/writingPreviews"
import { createModuleLoader, useDeferredModule } from "../lib/deferredModule"
import { beginDialogIntent, subscribeDialogIntent } from "../lib/dialogIntent"
import { usePortfolioItemUrl } from "../lib/portfolioUrl"
import { openSound } from "../lib/sounds"

const loadReader = createModuleLoader(() => import("./WritingsReader"), "WritingsReader")

export type WritingsFolderHandle = {
  /** Fetch and select a nested note without replacing the gallery dialog. */
  openWriting: (id: string) => void
  /** Retire a row request when its list is dismissed, even without history traversal. */
  cancelPending: () => void
  /** Warm the reader's chunk ahead of a row being pressed. */
  preload: () => void
  retry: () => void
}

/** What the notes slide says while a reader is on its way, or failed to come. */
export type WritingsReaderStatus = { status: string | null; pendingId: string | null }


type WritingsFolderProps = {
  /** The tile was pressed: open the gallery on the notes slide. */
  onOpen: () => void
  /** The tile was hovered or focused: warm the gallery's chunk. */
  onPrefetch?: () => void
  onReaderReady: (module: typeof import("./WritingsReader")) => void
  onStatusChange?: (status: WritingsReaderStatus) => void
  /** The tile: the fallback origin when a reader has no list underneath it. */
  tileRef?: (node: HTMLButtonElement | null) => void
  ref?: Ref<WritingsFolderHandle>
}

/**
 * The folder tile, and the reader it keeps on hand. The tile opens the
 * gallery on the list of notes; a row of that list comes back here to open the
 * note, because the reader is a chunk of its own and this is where it is
 * fetched, cancelled, and retried. A shared link to a note fetches it the same
 * way, without the list first.
 */
export function WritingsFolder({ onOpen, onPrefetch, onReaderReady, onStatusChange, tileRef, ref }: WritingsFolderProps) {
  const { module, status, load, warm } = useDeferredModule(loadReader)
  const Reader = module?.WritingsReader
  useEffect(() => { if (module) onReaderReady(module) }, [module, onReaderReady])
  const playOpen = useSound(openSound, { volume: 0.3 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [request, setRequest] = useState<{ id: string; isCurrent: () => boolean } | null>(null)
  const { itemId: writingId, selectItem: selectWriting, clearItem, discardItem } = usePortfolioItemUrl("writing")

  const openWriting = (id: string) => {
    setRequest({ id, isCurrent: beginDialogIntent("writing") })
    if (!Reader) void load()
  }
  useImperativeHandle(ref, () => ({
    openWriting,
    cancelPending: () => setRequest(null),
    preload: warm,
    retry: () => { void load() },
  }))

  // A row was pressed and the reader is here: put the note in the URL, which
  // is what selects the nested article. Only the most recent activation gets to -- a
  // download that lands after another dialog was chosen is kept but not shown.
  // The request is spent by the selection itself: once the note is in the URL
  // the article is selected, and a stale request is retired by its own intent.
  const served = useRef<typeof request>(null)
  useEffect(() => {
    if (!Reader || !request || served.current === request) return
    served.current = request
    if (!request.isCurrent()) return
    playOpen()
    selectWriting(request.id, false)
  }, [Reader, request, playOpen, selectWriting])
  useEffect(() => {
    if (Reader || !writingId) return
    return subscribeDialogIntent(destination => {
      if (destination !== "writing") discardItem()
    })
  }, [Reader, writingId, discardItem])
  useEffect(() => {
    if (writingId && !Reader) void load()
  }, [writingId, Reader, load])
  useEffect(() => {
    if (Reader || (!request && !writingId)) return
    const cancel = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      served.current = null
      setRequest(null)
      if (writingId) clearItem()
    }
    window.addEventListener("keydown", cancel)
    return () => window.removeEventListener("keydown", cancel)
  }, [Reader, request, writingId, clearItem])
  const statusLabel = status === "loading" ? "Opening notes…" : status === "error" ? "Try opening notes again" : status === "reload" ? "Reload to try notes again" : null
  useEffect(() => {
    onStatusChange?.({ status: statusLabel, pendingId: status === "loading" ? request?.id ?? writingId ?? null : null })
  }, [status, statusLabel, request, writingId, onStatusChange])

  return (
    <>
      <button type="button" className="writings-tile" aria-label="Open writings folder" aria-haspopup="dialog"
        ref={(node) => {
          triggerRef.current = node
          tileRef?.(node)
        }}
        aria-busy={status === "loading" || undefined}
        onPointerEnter={onPrefetch} onFocus={onPrefetch}
        onClick={() => {
          // A shared link's reader that failed to arrive is retried from here:
          // the tile is wearing the failure, and opening the list instead would
          // drop the note the link was for.
          if (writingId && !Reader) void load()
          else onOpen()
        }}>
        <span className="writings-folder" aria-hidden="true">
          <img className="writings-folder-back" src="/writings/folder-back.png" alt="" width={237} height={200} loading="lazy" />
          {writingPreviews.map(writing => (
            <span className="writings-paper" key={writing.id}>
              <span className="writings-paper-content">
                <strong>{writing.title}</strong>
                {writing.paragraphs.map((paragraph, index) => <span key={index}>{paragraph.split(/`([^`]+)`/).map((part, index) => index % 2 ? <code className="writing-code" key={index}>{part}</code> : part)}</span>)}
              </span>
            </span>
          ))}
          <span className="writings-folder-front"><img src="/writings/folder-front.png" alt="" width={149} height={133} loading="lazy" /></span>
        </span>
        {/* The tile wears the reader's status too: a shared link opens a note
            with no list on screen to say what is happening. */}
        <span className="writings-tile-label" role="status">{statusLabel ?? "Notes & tools"}</span>
      </button>
    </>
  )
}
