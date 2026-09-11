import { X } from "./NavigationIcons"
import { type CSSProperties, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
// Direct imports keep the deferred development chunk free of the full icon catalog.
import BubbleChatIcon from "@hugeicons/core-free-icons/BubbleChatIcon"
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon"
import PlayIcon from "@hugeicons/core-free-icons/PlayIcon"

import AboutIntroReply from "./AboutIntroReply"
import AboutIntroChat from "./AboutIntroChat"

import type { IntroOption } from "../data/aboutIntro"
import type { AboutIntroMedia } from "../data/aboutIntro"
import { useLightweightMedia } from "../lib/useLightweightMedia"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"

// Solid, compact media silhouettes inspired by native iOS playback controls.
function PlaybackIcon({ kind }: { kind: "play" | "pause" | "volume" | "muted" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {kind === "play" ? <path d="M6 4.7c0-1 .9-1.5 1.7-1l12 7.3c.8.5.8 1.5 0 2l-12 7.3c-.8.5-1.7 0-1.7-1Z" />
        : kind === "pause" ? <><rect x="5" y="3" width="5" height="18" rx="1.2" /><rect x="14" y="3" width="5" height="18" rx="1.2" /></>
          : <>
            <path d={kind === "muted"
              ? "M12.5 3.8v8.1L6.7 6.1l4.2-3.2c.7-.5 1.6 0 1.6.9ZM3 8h1.1l8.4 8.4v3.8c0 .9-.9 1.4-1.6.9L5 16.5H3c-1 0-1.5-.5-1.5-1.5V9.5C1.5 8.5 2 8 3 8Z"
              : "M3 8h2l5.9-4.6c.7-.5 1.6 0 1.6.9v15.4c0 .9-.9 1.4-1.6.9L5 16H3c-1 0-1.5-.5-1.5-1.5v-5C1.5 8.5 2 8 3 8Z"} />
            <path d={kind === "muted" ? "M2 2 22 22" : "M16 8a6 6 0 0 1 0 8M19 4.5a10.5 10.5 0 0 1 0 15"}
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>}
    </svg>
  )
}

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
const mobileMessagesQuery = "(max-width: 899.98px)"
const subscribeMobileMessages = (listener: () => void) => {
  const query = window.matchMedia(mobileMessagesQuery)
  query.addEventListener("change", listener)
  return () => query.removeEventListener("change", listener)
}
const mobileMessagesMatch = () => window.matchMedia(mobileMessagesQuery).matches
const mobileMessagesOnServer = () => false

export default function AboutIntro({ media, portrait, videoEnabled = false, visible, open, onOpenChange, mobileMessages = false, repliesAvailable = true, variant = "b" }: {
  variant?: IntroOption
  media?: AboutIntroMedia
  portrait: string
  videoEnabled?: boolean
  mobileMessages?: boolean
  repliesAvailable?: boolean
  visible: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const id = useId()
  const [actionsOpen, setActionsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [readCount, setReadCount] = useState(0)
  const [notificationTransition, setNotificationTransition] = useState<{ current: number, leaving?: number }>({ current: 0 })
  const [reply, setReply] = useState<"email" | "text" | null>(null)
  const [replyLabel, setReplyLabel] = useState<"email" | "text" | null>(null)
  const [returnedReply, setReturnedReply] = useState<"email" | "text" | null>(null)
  const [replyContent, setReplyContent] = useState<"email" | "text" | null>(null)
  const available = visible && repliesAvailable
  const [wasAvailable, setWasAvailable] = useState(available)
  // A new About visit starts with the portrait, while the video retains time.
  // Adjust this component's state before rendering children into a new context.
  if (wasAvailable !== available) {
    setWasAvailable(available)
    if (!available) {
      setReply(null)
      setReturnedReply(null)
      setReplyLabel(null)
      setActionsOpen(false)
    }
  }
  const textReplyRef = useRef<HTMLButtonElement>(null)
  const emailReplyRef = useRef<HTMLButtonElement>(null)
  const portraitRef = useRef<HTMLButtonElement>(null)
  const restoringReplyFocus = useRef(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const teaserRef = useRef<HTMLVideoElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const playRef = useRef<HTMLButtonElement>(null)
  const requestRef = useRef(0)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [touchControls, setTouchControls] = useState(true)
  const [ready, setReady] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [error, setError] = useState(false)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [captions, setCaptions] = useState(!media?.placeholder)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(media?.duration ?? 0)
  const reducedMotion = usePrefersReducedMotion()
  const lightweight = useLightweightMedia()
  const pageHidden = useSyncExternalStore(subscribeVisibility, pageIsHidden, hiddenOnServer)
  const mobileViewport = useSyncExternalStore(subscribeMobileMessages, mobileMessagesMatch, mobileMessagesOnServer)
  const videoAvailable = videoEnabled && Boolean(media)
  const mobileChat = mobileMessages && mobileViewport && variant === "b"
  const chatActive = visible && !open && repliesAvailable && !pageHidden
  const mobileChatOpen = mobileChat && chatActive && chatOpen
  const chatVisible = chatActive && (!mobileChat || mobileChatOpen)
  const unreadMessages = mobileChat && !mobileChatOpen ? Math.max(0, messageCount - readCount) : 0
  if (notificationTransition.current !== unreadMessages) {
    setNotificationTransition({
      current: unreadMessages,
      leaving: notificationTransition.current || undefined,
    })
  }
  const teaserIsGif = /\.gif(?:\?|$)/i.test(media?.assets.teaser ?? "")
  // This chunk mounts after hydration. The shared motion hook starts false,
  // so consult the live preference before assigning an automatic media URL.
  const animateTeaser = videoAvailable && !reducedMotion && !lightweight &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    if (!videoAvailable) return
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
  }, [visible, open, animateTeaser, videoAvailable])

  useEffect(() => {
    if (!mobileChatOpen) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.preventDefault()
      setChatOpen(false)
      setReadCount(messageCount)
      requestAnimationFrame(() => portraitRef.current?.focus({ preventScroll: true }))
    }
    document.addEventListener("keydown", dismiss)
    return () => document.removeEventListener("keydown", dismiss)
  }, [messageCount, mobileChatOpen])

  useEffect(() => {
    if (!notificationTransition.leaving) return
    const leaving = notificationTransition.leaving
    const timer = window.setTimeout(() => {
      setNotificationTransition(current => current.leaving === leaving
        ? { current: current.current }
        : current)
    }, 160)
    return () => window.clearTimeout(timer)
  }, [notificationTransition.leaving])

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
    if (!video || !media || !videoAvailable) return
    setReply(null)
    setReturnedReply(null)
    setReplyLabel(null)
    setActionsOpen(false)
    setTouchControls(true)
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
    const focusTarget = triggerRef.current?.closest<HTMLElement>("[role='dialog'], dialog[open]") ?? triggerRef.current
    requestRef.current += 1
    videoRef.current?.pause()
    onOpenChange(false)
    // The trigger stays mounted through the morph; focus after React removes
    // inert from it, with no transition timer to race a rapid reopen.
    requestAnimationFrame(() => focusTarget?.focus({ preventScroll: true }))
  }
  const closeReply = useCallback((restoreFocus = true) => {
    const target = reply === "email" ? emailReplyRef : textReplyRef
    restoringReplyFocus.current = restoreFocus
    setReply(null)
    setReturnedReply(reply)
    setReplyLabel(reply)
    setActionsOpen(true)
    if (restoreFocus) requestAnimationFrame(() => {
      target.current?.focus({ preventScroll: true })
      restoringReplyFocus.current = false
    })
  }, [reply])
  const startReply = (mode: "email" | "text") => {
    requestRef.current += 1
    videoRef.current?.pause()
    onOpenChange(false)
    setReply(mode)
    setReturnedReply(null)
    setReplyLabel(mode)
    setReplyContent(mode)
    setActionsOpen(false)
  }
  const action = error ? "Retry introduction" : ended ? "Replay introduction" : started ? "Resume introduction" : "Play introduction"
  const openChat = () => {
    setReadCount(messageCount)
    setChatOpen(true)
    setActionsOpen(false)
  }
  const closeChat = () => {
    setChatOpen(false)
    setReadCount(messageCount)
    requestAnimationFrame(() => portraitRef.current?.focus({ preventScroll: true }))
  }
  const messageLabel = `${messageCount} ${messageCount === 1 ? "message" : "messages"}`

  return (
    <section className="about-intro" aria-label="A quick hello from Rafael" data-visible={visible} data-variant={variant}
      data-chat-open={mobileChatOpen}
      onPointerEnter={event => { if (event.pointerType === "mouse" && !mobileChat && videoAvailable) setActionsOpen(true) }}
      onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setActionsOpen(false) }}
      onFocusCapture={() => { if (!mobileChat) setActionsOpen(true) }}
      onBlurCapture={event => {
        if (restoringReplyFocus.current) return
        // Closing keeps the composer mounted for its fade. Its newly inert
        // input blurs before focus is restored to the reply action.
        if (!reply && event.target instanceof HTMLElement && event.target.closest(".about-intro-reply")) return
        // Safari blurs a focused button on pointer-down without focusing the
        // next button. Keep the hovered target alive until its click completes.
        if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(":hover")) setActionsOpen(false)
      }}
      data-open={open} data-touch-controls={touchControls} data-actions-open={actionsOpen || Boolean(returnedReply)} data-reply-layout={Boolean((reply || returnedReply || (variant !== "a" && !open)) && repliesAvailable)} data-reply-open={Boolean(reply && repliesAvailable)} inert={!visible} aria-hidden={!visible}
      onKeyDown={event => {
        if (videoAvailable && event.key.toLowerCase() === "c" && open && !event.metaKey && !event.ctrlKey && !event.altKey &&
          !(event.target instanceof HTMLElement && event.target.matches("input, textarea, [contenteditable]"))) {
          setCaptionMode(videoRef.current, !captions)
          setCaptions(!captions)
        }
        if (event.key === "Escape" && mobileChatOpen) {
          event.preventDefault()
          event.stopPropagation()
          closeChat()
        } else if (event.key === "Escape" && reply && repliesAvailable) {
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
        <div className="about-intro-media">
          <img className="about-intro-poster" src={videoAvailable && media ? media.assets.poster : portrait} width={720} height={720} alt="" />
          {videoAvailable && media && animateTeaser && teaserIsGif && visible && !open && !pageHidden &&
            <img className="about-intro-teaser" src={media.assets.teaser} width={180} height={180} alt="" />}
          {videoAvailable && media && animateTeaser && !teaserIsGif && <video ref={teaserRef} className="about-intro-teaser" src={media.assets.teaser}
            muted loop playsInline preload="metadata" aria-hidden="true" />}
          {videoAvailable && media && <video ref={videoRef} className="about-intro-recording" data-recording="" playsInline preload="none"
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
          </video>}
          {(mobileChat || videoAvailable) && <button ref={portraitRef} type="button" className="about-intro-portrait-trigger"
            aria-label={mobileChat ? `Open ${messageCount ? messageLabel : "messages"} from Rafa` : "Show introduction actions"}
            aria-expanded={mobileChat ? mobileChatOpen : actionsOpen} aria-controls={mobileChat ? `${id}-chat` : variant === "b" ? `${id}-chat` : `${id}-actions`}
            onClick={mobileChat ? openChat : () => setActionsOpen(true)}
            inert={open} aria-hidden={open} />}
          {videoAvailable && <button ref={triggerRef} type="button" className="about-intro-trigger" aria-label={action}
            aria-expanded={open} aria-controls={id} onClick={play} inert={open || !repliesAvailable} aria-hidden={open || !repliesAvailable}>
            <span className="about-intro-play-mark"><HugeiconsIcon icon={PlayIcon} strokeWidth={1.5} size={24} fill="currentColor" aria-hidden="true" /></span>
          </button>}
          {videoAvailable && media && <div id={id} className="about-intro-expanded" inert={!open} aria-hidden={!open}>
            <button type="button" className="about-intro-video-touch" aria-label={touchControls ? "Hide video controls" : "Show video controls"}
              onClick={() => setTouchControls(!touchControls)} />
            <div className="about-intro-controls">
              <button ref={playRef} type="button" className="about-intro-button"
                aria-label={playing ? "Pause introduction" : action}
                onClick={() => { if (playing) videoRef.current?.pause(); else play() }}>
                <span className="t-icon-swap" data-state={playing ? "b" : "a"} aria-hidden="true">
                  <span className="t-icon" data-icon="a"><PlaybackIcon kind="play" /></span>
                  <span className="t-icon" data-icon="b"><PlaybackIcon kind="pause" /></span>
                </span>
              </button>
              <div className="about-intro-progress" style={{ "--intro-progress": `${duration > 0 ? Math.min(100, position / duration * 100) : 0}%` } as CSSProperties}>
                <input type="range" min={0} max={duration} step={0.1} value={Math.min(position, duration)}
                  aria-label="Seek introduction" aria-valuetext={`${timeLabel(position)} of ${timeLabel(duration)}`}
                  disabled={!ready} onChange={event => {
                    const next = Number(event.target.value)
                    if (videoRef.current) videoRef.current.currentTime = next
                    setPosition(next)
                    setEnded(false)
                  }} />
              </div>
              <button type="button" className="about-intro-button" aria-label={muted ? "Unmute introduction" : "Mute introduction"}
                onClick={() => {
                  if (videoRef.current) videoRef.current.muted = !muted
                  setMuted(!muted)
                }}>
                <span className="t-icon-swap" data-state={muted ? "b" : "a"} aria-hidden="true">
                  <span className="t-icon" data-icon="a"><PlaybackIcon kind="volume" /></span>
                  <span className="t-icon" data-icon="b"><PlaybackIcon kind="muted" /></span>
                </span>
              </button>
            </div>
            <span className="about-intro-status" role="status">{error ? "Couldn’t load video. Try again." : waiting ? "Loading introduction…" : ""}</span>
          </div>}
        </div>
        {unreadMessages > 0 && <span className="about-intro-chat-notification" aria-hidden="true">
          {notificationTransition.leaving && <span className="about-intro-chat-notification-ghost">{notificationTransition.leaving}</span>}
          <span key={notificationTransition.current} className="about-intro-chat-notification-number">{notificationTransition.current}</span>
        </span>}
        {videoAvailable && <button type="button" className="about-intro-collapse about-intro-button" inert={!open} aria-hidden={!open} onClick={collapse} aria-label="Close introduction">
          <X size={18} />
        </button>}
      </div>
      {variant === "b" && <>
        <button type="button" className="about-intro-chat-backdrop" aria-label="Close messages"
          inert={!mobileChatOpen} aria-hidden={!mobileChatOpen} onClick={closeChat} />
      </>}
      {variant === "b" ? <AboutIntroChat id={`${id}-chat`} active={chatActive} visible={chatVisible} modal={mobileChatOpen} onClose={closeChat} onMessageCount={setMessageCount} /> : <div id={`${id}-actions`} className="about-intro-actions" data-reply={reply ?? "none"} data-labeled={Boolean(replyLabel)} data-returned={Boolean(returnedReply)} inert={open || !repliesAvailable} aria-hidden={open || !repliesAvailable}>
        <div className="about-intro-action-buttons" inert={Boolean(reply)} aria-hidden={Boolean(reply)}
          onPointerLeave={() => setReplyLabel(returnedReply)}
          onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setReplyLabel(returnedReply) }}>
          <div className="about-intro-choices">
            <button ref={emailReplyRef} type="button" className="about-intro-reply-action" aria-label="Your email" data-expanded={replyLabel === "email"}
              onPointerEnter={event => { if (event.pointerType === "mouse") setReplyLabel("email") }} onFocus={() => setReplyLabel("email")}
              aria-describedby={`${id}-email-tooltip`} onClick={() => startReply("email")}>
              <HugeiconsIcon icon={Mail01Icon} strokeWidth={1.5} size={24} aria-hidden="true" /><span id={`${id}-email-tooltip`} role="tooltip" aria-hidden={variant !== "c" && replyLabel !== "email"} className="about-intro-action-label">Your email</span>
            </button>
            <button ref={textReplyRef} type="button" className="about-intro-reply-action" aria-label="Text me" data-expanded={replyLabel === "text"}
              onPointerEnter={event => { if (event.pointerType === "mouse") setReplyLabel("text") }} onFocus={() => setReplyLabel("text")}
              aria-describedby={`${id}-text-tooltip`} onClick={() => startReply("text")}>
              <HugeiconsIcon icon={BubbleChatIcon} strokeWidth={1.5} size={24} aria-hidden="true" /><span id={`${id}-text-tooltip`} role="tooltip" aria-hidden={variant !== "c" && replyLabel !== "text"} className="about-intro-action-label">Text me</span>
            </button>
          </div>
        </div>
        {replyContent && visible && repliesAvailable && <AboutIntroReply key={replyContent} mode={replyContent} active={Boolean(reply)} onClose={closeReply} />}
      </div>}
      <span className="about-intro-label" aria-hidden="true">A quick hello <span>{timeLabel(duration)}</span></span>
    </section>
  )
}
