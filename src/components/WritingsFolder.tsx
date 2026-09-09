import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react"
import { writingPreviews } from "../data/writingPreviews"
import { createModuleLoader, useDeferredModule } from "../lib/deferredModule"
import { usePortfolioItemUrl } from "../lib/portfolioUrl"
import type { WritingsFolderHandle as ReaderHandle } from "./WritingsReader"

const loadReader = createModuleLoader(() => import("./WritingsReader"), "WritingsReader")
export type WritingsFolderHandle = ReaderHandle & { preload: () => void }

export function WritingsFolder({ onOpenChange, ref }: { onOpenChange?: (open: boolean) => void; ref?: Ref<WritingsFolderHandle> }) {
  const { module, status, load, warm } = useDeferredModule(loadReader)
  const Reader = module?.WritingsReader
  const triggerRef = useRef<HTMLButtonElement>(null)
  const readerRef = useRef<ReaderHandle>(null)
  const [request, setRequest] = useState<{ opener: HTMLElement | null } | null>(null)
  const { itemId: writingId, clearItem } = usePortfolioItemUrl("writing")

  const openFolder = (opener?: HTMLElement | null) => {
    setRequest({ opener: opener ?? triggerRef.current })
    if (!Reader) void load()
  }
  useImperativeHandle(ref, () => ({ openFolder, preload: warm }))
  useEffect(() => {
    if (writingId && !Reader) void load()
  }, [writingId, Reader, load])
  useEffect(() => {
    if (!Reader || !request) return
    readerRef.current?.openFolder(request.opener)
  }, [Reader, request])
  useEffect(() => {
    if (Reader || (!request && !writingId)) return
    const cancel = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setRequest(null)
      if (writingId) clearItem()
    }
    window.addEventListener("keydown", cancel)
    return () => window.removeEventListener("keydown", cancel)
  }, [Reader, request, writingId, clearItem])

  return (
    <>
      <button type="button" className="writings-tile" aria-label="Open writings folder" aria-haspopup="dialog"
        aria-busy={status === "loading" || undefined} ref={triggerRef}
        onPointerEnter={warm} onFocus={warm} onClick={() => openFolder()}>
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
        <span className="writings-tile-label" role="status">{status === "loading" ? "Opening notes…" : status === "error" ? "Try opening notes again" : status === "reload" ? "Reload to try notes again" : "Writings & notes"}</span>
      </button>
      {Reader ? <Reader ref={readerRef} triggerRef={triggerRef} onOpenChange={onOpenChange} /> : null}
    </>
  )
}
