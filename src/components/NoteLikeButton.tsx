import { Heart } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { requestNoteLikes, type NoteLikes } from "../lib/noteLikes"

/** Mounted per note so late responses cannot change a different note's count. */
export function NoteLikeButton({ noteId }: { noteId: string }) {
  const [likes, setLikes] = useState<NoteLikes | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const savingRef = useRef(false)
  const requestRef = useRef<AbortController | null>(null)

  const refresh = useCallback(() => {
    if (savingRef.current) return
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    void requestNoteLikes(noteId, AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]))
      .then((value) => {
        if (!controller.signal.aborted) { setLikes(value); setError(null) }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Likes are unavailable right now.")
      })
  }, [noteId])

  useEffect(() => {
    void refresh()
    const onFocus = () => { if (document.visibilityState === "visible") void refresh() }
    const interval = window.setInterval(onFocus, 15000)
    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onFocus)
    return () => {
      requestRef.current?.abort()
      window.clearInterval(interval)
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onFocus)
    }
  }, [refresh])

  async function toggleLike() {
    if (!likes || savingRef.current) return
    savingRef.current = true
    setSaving(true)
    setError(null)
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    try {
      const value = await requestNoteLikes(noteId, AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]), !likes.liked)
      if (!controller.signal.aborted) setLikes(value)
    } catch {
      if (!controller.signal.aborted) setError("Couldn't save your like. Please try again.")
    } finally {
      savingRef.current = false
      if (!controller.signal.aborted) setSaving(false)
    }
  }

  return (
    <div className="writing-reader-meta">
      <button type="button" className="writing-like" aria-label={likes?.liked ? "Unlike this note" : "Like this note"}
        aria-pressed={likes?.liked ?? false} aria-busy={saving} disabled={!likes || saving} onClick={() => void toggleLike()}>
        <Heart size={14} aria-hidden="true" />
        <span>{likes?.liked ? "Liked" : "Like"}</span>
      </button>
      <span role="status" aria-label="Note likes" aria-live="polite" aria-atomic="true">
        {likes ? `${likes.count} ${likes.count === 1 ? "like" : "likes"}` : error ? "" : "Loading likes…"}
      </span>
      {error ? <span role="alert">{error}</span> : null}
    </div>
  )
}
