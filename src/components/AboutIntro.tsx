import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import { Captions, ChevronDown, Pause, Play, RotateCcw, Volume2, VolumeX, X } from "lucide-react"

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

export default function AboutIntro({ media, visible, open, onOpenChange, onDismiss }: {
  media: AboutIntroMedia
  visible: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onDismiss: () => void
}) {
  const id = useId()
  const videoRef = useRef<HTMLVideoElement>(null)
  const teaserRef = useRef<HTMLVideoElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const playRef = useRef<HTMLButtonElement>(null)
  const requestRef = useRef(0)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(false)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [captions, setCaptions] = useState(true)
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
    // The trigger stays mounted through the morph; focus after React removes
    // inert from it, with no transition timer to race a rapid reopen.
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }))
  }
  const action = error ? "Retry introduction" : ended ? "Replay introduction" : started ? "Resume introduction" : "Play introduction"

  return (
    <section className="about-intro" aria-label="A quick hello from Rafael" data-visible={visible}
      data-open={open} inert={!visible} aria-hidden={!visible}
      onKeyDown={event => {
        if (event.key === "Escape" && open) {
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
          aria-label="Rafael's introduction" aria-hidden={!open} tabIndex={-1}
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
            default onLoad={syncCaptions} />}
        </video>
        <button ref={triggerRef} type="button" className="about-intro-trigger" aria-label={action}
          aria-expanded={open} aria-controls={id} onClick={play} inert={open} aria-hidden={open}>
          <span className="about-intro-play-disc"><Play size={20} fill="currentColor" aria-hidden="true" /></span>
        </button>
        <div id={id} className="about-intro-expanded" inert={!open} aria-hidden={!open}>
          {media.placeholder && <span className="about-intro-placeholder">Placeholder</span>}
          <button type="button" className="about-intro-collapse about-intro-button" onClick={collapse} aria-label="Collapse introduction">
            <ChevronDown size={18} aria-hidden="true" />
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
              <span className="about-intro-time" aria-hidden="true">{timeLabel(position)} / {timeLabel(duration)}</span>
              <button type="button" className="about-intro-button" aria-label={muted ? "Unmute introduction" : "Mute introduction"}
                onClick={() => {
                  if (videoRef.current) videoRef.current.muted = !muted
                  setMuted(!muted)
                }}>
                {muted ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
              </button>
              <button type="button" className="about-intro-button" aria-label="Captions" aria-pressed={captions}
                onClick={() => {
                  setCaptionMode(videoRef.current, !captions)
                  setCaptions(!captions)
                }}><Captions size={18} aria-hidden="true" /></button>
            </div>
          </div>
          <span className="about-intro-status" role="status">{error ? "Couldn’t load video. Try again." : waiting ? "Loading introduction…" : ""}</span>
        </div>
      </div>
      <span className="about-intro-label" aria-hidden="true">A quick hello <span>{media.placeholder ? "Placeholder · " : ""}{timeLabel(duration)}</span></span>
      <button className="about-intro-dismiss about-intro-button" type="button" aria-label="Dismiss introduction"
        onClick={() => { videoRef.current?.pause(); onDismiss() }}><X size={14} aria-hidden="true" /></button>
    </section>
  )
}
