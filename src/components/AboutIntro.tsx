import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import { Mail, Maximize2, Minimize2, MessageCircle, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react"

import AboutIntroReply from "./AboutIntroReply"

import type { AboutIntroMedia } from "../data/aboutIntro"
import { useLightweightMedia } from "../lib/useLightweightMedia"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"

const timeLabel = (seconds: number) => {
  const whole = Math.max(0, Math.floor(Number.isFinite(seconds) ? seconds : 0))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

function setCaptionMode(video: HTMLVideoElement | null, enabled: boolean) {
  const track = video?.textTracks[0]
  if (track) track.mode = enabled ? "showing" : "disabled"
}

const subscribeVisibility = (listener: () => void) => {
  document.addEventListener("visibilitychange", listener)
  return () => document.removeEventListener("visibilitychange", listener)
}
const pageIsHidden = () => document.hidden
const hiddenOnServer = () => true

export default function AboutIntro({ media, visible, open, onOpenChange, repliesAvailable = true }: {
  media: AboutIntroMedia
  repliesAvailable?: boolean
  visible: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const id = useId()
  const [actionsOpen, setActionsOpen] = useState(false)
  const [reply, setReply] = useState<"email" | "text" | null>(null)
  const available = visible && repliesAvailable
  const [wasAvailable, setWasAvailable] = useState(available)
  // A new About visit starts with the portrait, while the video retains time.
  // Adjust this component's state before rendering children into a new context.
  if (wasAvailable !== available) {
    setWasAvailable(available)
    if (!available) {
      setReply(null)
      setActionsOpen(false)
    }
  }
  const textReplyRef = useRef<HTMLButtonElement>(null)
  const emailReplyRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const teaserRef = useRef<HTMLVideoElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const playRef = useRef<HTMLButtonElement>(null)
  const requestRef = useRef(0)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [enlarged, setEnlarged] = useState(false)
  const [touchControls, setTouchControls] = useState(true)
  const [ready, setReady] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(false)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [captions, setCaptions] = useState(!media.placeholder)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(media.duration)
  const reducedMotion = usePrefersReducedMotion()
  const lightweight = useLightweightMedia()
  const pageHidden = useSyncExternalStore(subscribeVisibility, pageIsHidden, hiddenOnServer)
  const teaserIsGif = /\.gif(?:\?|$)/i.test(media.assets.teaser)
  // This chunk mounts after hydration. The shared motion hook starts false,
  // so consult the live preference before assigning an automatic media URL.
  const animateTeaser = !reducedMotion && !lightweight &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    const video = videoRef.current
    const teaser = teaserRef.current
    const sync = () => {
      if (!visible || !open || document.hidden) {
        requestRef.current += 1
        video?.pause()
      }
      if (visible && !open && !document.hidden && animateTeaser) {
        void teaser?.play().catch(() => { /* A poster remains if autoplay is blocked. */ })
      } else teaser?.pause()
    }
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => {
      document.removeEventListener("visibilitychange", sync)
    }
  }, [visible, open, animateTeaser])

  useEffect(() => {
    const video = videoRef.current
    return () => { video?.pause() }
  }, [])

  useEffect(() => {
    if (open && visible) playRef.current?.focus({ preventScroll: true })
  }, [open, visible])

  const syncCaptions = () => {
    setCaptionMode(videoRef.current, captions)
  }

  const play = () => {
    const video = videoRef.current
    if (!video) return
    setReply(null)
    setActionsOpen(false)
    setTouchControls(true)
    if (!open) setEnlarged(false)
    const request = ++requestRef.current
    teaserRef.current?.pause()
    setStarted(true)
    setError(false)
    setWaiting(true)
    setEnded(false)
    onOpenChange(true)
    // Set the source and call play in the originating gesture. Deferring this
    // until an effect or transition end loses audio permission on mobile.
    if (!video.getAttribute("src")) video.src = media.assets.recording
    if (error) video.load()
    if (video.ended) video.currentTime = 0
    video.muted = muted
    void video.play().catch(reason => {
      if (request !== requestRef.current) return
      setWaiting(false)
      setPlaying(false)
      if (!(reason instanceof DOMException && (reason.name === "NotAllowedError" || reason.name === "AbortError"))) {
        setError(true)
      }
    })
  }

  const collapse = () => {
    requestRef.current += 1
    videoRef.current?.pause()
    onOpenChange(false)
    setEnlarged(false)
    // The trigger stays mounted through the morph; focus after React removes
    // inert from it, with no transition timer to race a rapid reopen.
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }))
  }
  const closeReply = useCallback((restoreFocus = true) => {
    const target = reply === "email" ? emailReplyRef : textReplyRef
    setReply(null)
    setActionsOpen(restoreFocus)
    if (restoreFocus) requestAnimationFrame(() => target.current?.focus({ preventScroll: true }))
  }, [reply])
  const startReply = (mode: "email" | "text") => {
    requestRef.current += 1
    videoRef.current?.pause()
    onOpenChange(false)
    setReply(mode)
    setActionsOpen(false)
  }
  const action = error ? "Retry introduction" : ended ? "Replay introduction" : started ? "Resume introduction" : "Play introduction"

  return (
    <section className="about-intro" aria-label="A quick hello from Rafael" data-visible={visible}
      onPointerEnter={event => { if (event.pointerType === "mouse") setActionsOpen(true) }}
      onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setActionsOpen(false) }}
      onFocusCapture={() => setActionsOpen(true)}
      onBlurCapture={event => {
        // Safari blurs a focused button on pointer-down without focusing the
        // next button. Keep the hovered target alive until its click completes.
        if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(":hover")) setActionsOpen(false)
      }}
      data-open={open} data-enlarged={enlarged && open} data-touch-controls={touchControls} data-actions-open={actionsOpen} data-reply-open={Boolean(reply && repliesAvailable)} inert={!visible} aria-hidden={!visible}
      onKeyDown={event => {
        if (event.key.toLowerCase() === "c" && open && !event.metaKey && !event.ctrlKey && !event.altKey &&
          !(event.target instanceof HTMLElement && event.target.matches("input, textarea, [contenteditable]"))) {
          setCaptionMode(videoRef.current, !captions)
          setCaptions(!captions)
        }
        if (event.key === "Escape" && reply && repliesAvailable) {
          event.preventDefault()
          event.stopPropagation()
          closeReply()
        } else if (event.key === "Escape" && open) {
          event.preventDefault()
          event.stopPropagation()
          collapse()
        }
      }}>
      <div className="about-intro-surface" data-ready={ready && open}>
        <img className="about-intro-poster" src={media.assets.poster} width={720} height={720} alt="" />
        {animateTeaser && teaserIsGif && visible && !open && !pageHidden &&
          <img className="about-intro-teaser" src={media.assets.teaser} width={180} height={180} alt="" />}
        {animateTeaser && !teaserIsGif && <video ref={teaserRef} className="about-intro-teaser" src={media.assets.teaser}
          muted loop playsInline preload="metadata" aria-hidden="true" />}
        <video ref={videoRef} className="about-intro-recording" data-recording="" playsInline preload="none"
          aria-label={media.placeholder ? "Placeholder introduction" : "Rafael's introduction"} aria-description="Press C to toggle captions." aria-hidden={!open} tabIndex={-1}
          onLoadedMetadata={event => {
            const next = event.currentTarget.duration
            if (Number.isFinite(next) && next > 0) setDuration(next)
            syncCaptions()
          }}
          onLoadedData={() => setReady(true)} onWaiting={() => setWaiting(true)}
          onPlaying={() => { setWaiting(false); setPlaying(true) }}
          onPause={() => { setPlaying(false); setWaiting(false) }}
          onTimeUpdate={event => setPosition(event.currentTarget.currentTime)}
          onEnded={() => { setEnded(true); setPlaying(false); setWaiting(false) }}
          onError={() => { setError(true); setWaiting(false); setPlaying(false) }}>
          {started && <track kind="captions" label="English" srcLang="en" src={media.assets.captions}
            default={captions} onLoad={syncCaptions} />}
        </video>
        <button type="button" className="about-intro-portrait-trigger" aria-label="Show introduction actions"
          aria-expanded={actionsOpen} aria-controls={`${id}-actions`} onClick={() => setActionsOpen(true)}
          inert={open} aria-hidden={open} />
        <button ref={triggerRef} type="button" className="about-intro-trigger" aria-label={action}
          aria-expanded={open} aria-controls={id} onClick={play} inert={open || !repliesAvailable} aria-hidden={open || !repliesAvailable}>
          <span className="about-intro-play-disc"><Play size={18} fill="currentColor" aria-hidden="true" /></span>
        </button>
        <div id={id} className="about-intro-expanded" inert={!open} aria-hidden={!open}>
          <button type="button" className="about-intro-video-touch" aria-label={touchControls ? "Hide video controls" : "Show video controls"}
            onClick={() => setTouchControls(!touchControls)} />
          <button type="button" className="about-intro-collapse about-intro-button" onClick={collapse} aria-label="Close introduction">
            <X size={16} aria-hidden="true" />
          </button>
          <div className="about-intro-controls">
            <div className="about-intro-progress">
              <input type="range" min={0} max={duration} step={0.1} value={Math.min(position, duration)}
                aria-label="Seek introduction" aria-valuetext={`${timeLabel(position)} of ${timeLabel(duration)}`}
                disabled={!ready} onChange={event => {
                  const next = Number(event.target.value)
                  if (videoRef.current) videoRef.current.currentTime = next
                  setPosition(next)
                  setEnded(false)
                }} />
            </div>
            <div className="about-intro-control-row">
              <button ref={playRef} type="button" className="about-intro-button"
                aria-label={playing ? "Pause introduction" : action}
                onClick={() => { if (playing) videoRef.current?.pause(); else play() }}>
                {playing ? <Pause size={18} aria-hidden="true" /> : ended || error ? <RotateCcw size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
              </button>
              <button type="button" className="about-intro-button" aria-label={muted ? "Unmute introduction" : "Mute introduction"}
                onClick={() => {
                  if (videoRef.current) videoRef.current.muted = !muted
                  setMuted(!muted)
                }}>
                {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
              </button>
              <button type="button" className="about-intro-button" aria-label={enlarged ? "Shrink introduction" : "Expand introduction"}
                onClick={() => setEnlarged(!enlarged)}>
                {enlarged ? <Minimize2 size={16} aria-hidden="true" /> : <Maximize2 size={16} aria-hidden="true" />}
              </button>
              <span className="about-intro-time" aria-hidden="true">{timeLabel(position)} / {timeLabel(duration)}</span>
            </div>
          </div>
          <span className="about-intro-status" role="status">{error ? "Couldn’t load video. Try again." : waiting ? "Loading introduction…" : ""}</span>
        </div>
      </div>
      <div id={`${id}-actions`} className="about-intro-actions" data-reply={reply ?? "none"} inert={open || !repliesAvailable} aria-hidden={open || !repliesAvailable}>
        <div className="about-intro-action-buttons" inert={Boolean(reply)} aria-hidden={Boolean(reply)}>
        <button ref={emailReplyRef} type="button" className="about-intro-reply-action" aria-label="Email"
          aria-describedby={`${id}-email-tooltip`} onClick={() => startReply("email")}>
          <Mail size={19} aria-hidden="true" /><span id={`${id}-email-tooltip`} role="tooltip" className="about-intro-tooltip">Email</span>
        </button>
        <button ref={textReplyRef} type="button" className="about-intro-reply-action" aria-label="Text"
          aria-describedby={`${id}-text-tooltip`} onClick={() => startReply("text")}>
          <MessageCircle size={19} aria-hidden="true" /><span id={`${id}-text-tooltip`} role="tooltip" className="about-intro-tooltip">Text</span>
        </button>
        </div>
        {reply && visible && repliesAvailable && <AboutIntroReply key={reply} mode={reply} onClose={closeReply} />}
      </div>
      <span className="about-intro-label" aria-hidden="true">A quick hello <span>{timeLabel(duration)}</span></span>
    </section>
  )
}
