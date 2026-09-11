import { Heart } from "lucide-react"
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react"
import { maxLikesPerVisitor } from "../data/likeLimits"
import { requestLikes, type LikeCollection, type LikeCounts } from "../lib/likes"
import { InlineSwap } from "./InlineSwap"

/* Clicks land instantly on screen and drain to the API in one batched write
   shortly after the tapping stops, so spamming the heart costs one request. */
const flushDelay = 500

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/* One control, two collections. The wording is the only thing that differs, and
   it is spelled out here rather than assembled from the collection name so the
   accessible names stay greppable. */
const subjects: Record<LikeCollection, { like: string; atLimit: string; status: string }> = {
  notes: { like: "Like this note", atLimit: "Like this note (limit reached)", status: "Note likes" },
  projects: { like: "Like this project", atLimit: "Like this project (limit reached)", status: "Project likes" },
}

type LikeButtonProps = {
  collection: LikeCollection
  itemId: string
  /** Layout class for the row; the button itself is the same everywhere. */
  className?: string
}

/** Mounted per item so late responses cannot change a different item's count. */
export function LikeButton({ collection, itemId, className }: LikeButtonProps) {
  const [confirmed, setConfirmed] = useState<LikeCounts | null>(null)
  const [optimistic, setOptimistic] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const pendingRef = useRef(0)
  const inflightRef = useRef(0)
  const activeWritesRef = useRef(0)
  const reconcileRef = useRef(false)
  const mountedRef = useRef(false)
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const requestRef = useRef<AbortController | null>(null)
  const hadDataRef = useRef(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const heartRef = useRef<HTMLSpanElement>(null)
  const burstRef = useRef<HTMLSpanElement>(null)
  const heartAnimRef = useRef<Animation | null>(null)
  const shakeAnimRef = useRef<Animation | null>(null)

  function popHeart() {
    const heart = heartRef.current
    if (!heart || prefersReducedMotion()) return
    heartAnimRef.current?.cancel()
    heartAnimRef.current = heart.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.35)", offset: 0.4 }, { transform: "scale(1)" }],
      { duration: 360, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    )
  }

  function burst() {
    const layer = burstRef.current
    const heart = heartRef.current
    if (!layer || !heart || prefersReducedMotion()) return
    const originX = heart.offsetLeft + heart.offsetWidth / 2
    const originY = heart.offsetTop + heart.offsetHeight / 2
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("span")
      particle.className = "like-particle"
      // A couple of oversized blurred blobs behind the sharp specks read as
      // the soft ink splatter in the reference clip.
      const soft = i < 3
      if (soft) particle.dataset.soft = ""
      const size = soft ? 7 + Math.random() * 6 : 3 + Math.random() * 4
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${originX - size / 2}px`
      particle.style.top = `${originY - size / 2}px`
      layer.appendChild(particle)
      const angle = Math.random() * Math.PI * 2
      const distance = 18 + Math.random() * 30
      const animation = particle.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 0.9 },
          { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0.1)`, opacity: 0 },
        ],
        { duration: 450 + Math.random() * 300, easing: "cubic-bezier(0.12, 0.84, 0.32, 1)" },
      )
      animation.onfinish = () => particle.remove()
      animation.oncancel = () => particle.remove()
    }
  }

  function shake() {
    const button = buttonRef.current
    if (!button || prefersReducedMotion()) return
    shakeAnimRef.current?.cancel()
    shakeAnimRef.current = button.animate(
      ["0", "-4px", "4px", "-3px", "3px", "-1px", "0"].map((x) => ({ transform: `translateX(${x})` })),
      { duration: 320, easing: "ease-out" },
    )
  }

  const refresh = useCallback((clearError = true) => {
    // Unsaved taps outrank a background read; the flush response reconciles.
    if (pendingRef.current > 0 || inflightRef.current > 0) return
    requestRef.current?.abort()
    const controller = new AbortController()
    requestRef.current = controller
    void requestLikes(collection, itemId, AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]))
      .then((value) => {
        if (controller.signal.aborted) return
        setConfirmed(value)
        if (clearError) setError(null)
        // Returning to something you already liked replays the heart's pop.
        if (!hadDataRef.current && value.visitorLikes > 0) popHeart()
        hadDataRef.current = true
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Likes are unavailable right now.")
      })
  }, [collection, itemId])

  function scheduleFlush() {
    clearTimeout(flushTimerRef.current)
    flushTimerRef.current = setTimeout(() => void flush(), flushDelay)
  }

  async function flush(leaving = false) {
    if ((!leaving && activeWritesRef.current > 0) || pendingRef.current === 0) return
    clearTimeout(flushTimerRef.current)
    const delta = pendingRef.current
    pendingRef.current = 0
    // Leaving must drain even taps queued behind another save. Keep their
    // optimistic total until all writes settle, then read once to reconcile
    // responses that may have arrived in a different order from the writes.
    if (activeWritesRef.current > 0) reconcileRef.current = true
    activeWritesRef.current += 1
    inflightRef.current += delta
    requestRef.current?.abort()
    let saved: LikeCounts | null = null
    try {
      saved = await requestLikes(collection, itemId, AbortSignal.timeout(10000), delta)
    } catch {
      reconcileRef.current = true
      if (mountedRef.current) {
        pendingRef.current = 0
        setError("Couldn't save your likes. Please try again.")
      }
    } finally {
      activeWritesRef.current -= 1
      if (activeWritesRef.current === 0) {
        inflightRef.current = 0
        if (mountedRef.current) {
          setOptimistic(pendingRef.current)
          if (reconcileRef.current) {
            // A background read must wait until unsent taps have drained too.
            if (pendingRef.current === 0) { reconcileRef.current = false; refresh(false) }
          } else if (saved) {
            setConfirmed(saved)
          }
          if (pendingRef.current > 0) scheduleFlush()
        }
      }
    }
  }

  const flushOnLeave = useEffectEvent(() => { void flush(true) })

  useEffect(() => {
    mountedRef.current = true
    void refresh()
    const onFocus = () => { if (document.visibilityState === "visible") void refresh() }
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flushOnLeave()
      else onFocus()
    }
    const onPageHide = () => flushOnLeave()
    window.addEventListener("focus", onFocus)
    window.addEventListener("pagehide", onPageHide)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      mountedRef.current = false
      window.removeEventListener("focus", onFocus)
      window.removeEventListener("pagehide", onPageHide)
      document.removeEventListener("visibilitychange", onVisibility)
      clearTimeout(flushTimerRef.current)
      flushOnLeave()
      // This controller owns reads only. Saves use keepalive and must finish
      // after the item or document goes away, without resending their deltas.
      requestRef.current?.abort()
    }
  }, [collection, itemId, refresh])

  function handleClick() {
    if (!confirmed) return
    if (confirmed.visitorLikes + pendingRef.current + inflightRef.current >= maxLikesPerVisitor) {
      shake()
      return
    }
    pendingRef.current += 1
    setOptimistic(pendingRef.current + inflightRef.current)
    setError(null)
    popHeart()
    burst()
    scheduleFlush()
  }

  const displayCount = confirmed ? confirmed.count + optimistic : null
  const liked = confirmed !== null && (confirmed.visitorLikes > 0 || optimistic > 0)
  const atLimit = confirmed !== null && confirmed.visitorLikes + optimistic >= maxLikesPerVisitor

  const subject = subjects[collection]

  return (
    <div className={className ? `like-row ${className}` : "like-row"}>
      <button ref={buttonRef} type="button" className="like-button" data-liked={liked || undefined}
        aria-label={atLimit ? subject.atLimit : subject.like}
        disabled={!confirmed} onClick={handleClick}>
        <span ref={heartRef} className="like-heart" aria-hidden="true"><Heart size={14} /></span>
        <span className="like-count" aria-hidden="true"
          style={displayCount === null ? undefined : { width: `${String(displayCount).length}ch` }}>
          <InlineSwap value={displayCount ?? "…"} />
        </span>
        <span ref={burstRef} className="like-burst" aria-hidden="true" />
      </button>
      <span role="status" aria-label={subject.status} aria-live="polite" aria-atomic="true" className="sr-only">
        {displayCount !== null ? `${displayCount} ${displayCount === 1 ? "like" : "likes"}` : error ? "" : "Loading likes…"}
      </span>
      {error ? <span role="alert">{error}</span> : null}
    </div>
  )
}
