import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import type { CSSProperties } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
// Direct imports keep the deferred development chunk free of the full icon catalog.
import BubbleChatIcon from "@hugeicons/core-free-icons/BubbleChatIcon"
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon"

import AboutIntroReply from "./AboutIntroReply"
import AboutIntroChat from "./AboutIntroChat"

import type { IntroOption } from "../data/aboutIntro"
import type { AboutIntroMedia } from "../data/aboutIntro"
import { useLightweightMedia } from "../lib/useLightweightMedia"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"

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

export default function AboutIntro({ media, portrait, visible, mobileMessages = false, repliesAvailable = true, variant = "b" }: {
  variant?: IntroOption
  media?: AboutIntroMedia
  portrait: string
  mobileMessages?: boolean
  repliesAvailable?: boolean
  visible: boolean
}) {
  const id = useId()
  // The frost anchors to this intro's chat by name; useId's colons are not
  // valid in a dashed ident.
  const chatAnchor = { "--intro-chat-anchor": `--intro-chat-${id.replace(/[^\w-]/g, "")}` } as CSSProperties
  const [actionsOpen, setActionsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatCollapsed, setChatCollapsed] = useState(true)
  const [messageCount, setMessageCount] = useState(0)
  const [notificationTransition, setNotificationTransition] = useState<{ current: number, leaving?: number }>({ current: 0 })
  const [reply, setReply] = useState<"email" | "text" | null>(null)
  const [replyLabel, setReplyLabel] = useState<"email" | "text" | null>(null)
  const [returnedReply, setReturnedReply] = useState<"email" | "text" | null>(null)
  const [replyContent, setReplyContent] = useState<"email" | "text" | null>(null)
  const available = visible && repliesAvailable
  const [wasAvailable, setWasAvailable] = useState(available)
  // A new About visit starts with the portrait. Adjust this component's state
  // before rendering children into a new context.
  if (wasAvailable !== available) {
    setWasAvailable(available)
    if (!available) {
      setChatCollapsed(true)
      setChatOpen(false)
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
  const teaserRef = useRef<HTMLVideoElement>(null)
  const introRef = useRef<HTMLElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const lightweight = useLightweightMedia()
  const pageHidden = useSyncExternalStore(subscribeVisibility, pageIsHidden, hiddenOnServer)
  const mobileViewport = useSyncExternalStore(subscribeMobileMessages, mobileMessagesMatch, mobileMessagesOnServer)
  const mobileChat = mobileMessages && mobileViewport && variant === "b"
  const chatActive = visible && repliesAvailable && !pageHidden
  const mobileChatOpen = mobileChat && chatActive && chatOpen
  const desktopChatOpen = !mobileChat && variant === "b" && chatActive && !chatCollapsed
  const chatExpanded = mobileChatOpen || desktopChatOpen
  const chatVisible = chatExpanded
  const collapsedMessageCount = !chatExpanded ? messageCount : 0
  if (notificationTransition.current !== collapsedMessageCount) {
    setNotificationTransition({
      current: collapsedMessageCount,
      leaving: notificationTransition.current || undefined,
    })
  }
  const teaserIsGif = /\.gif(?:\?|$)/i.test(media?.assets.teaser ?? "")
  // This chunk mounts after hydration. The shared motion hook starts false,
  // so consult the live preference before assigning an automatic media URL.
  const animateTeaser = Boolean(media) && !reducedMotion && !lightweight &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches

  useEffect(() => {
    const teaser = teaserRef.current
    if (!teaser) return
    const sync = () => {
      if (visible && !document.hidden) {
        void teaser.play().catch(() => { /* A poster remains if autoplay is blocked. */ })
      } else teaser.pause()
    }
    sync()
    document.addEventListener("visibilitychange", sync)
    return () => {
      document.removeEventListener("visibilitychange", sync)
    }
  }, [visible, animateTeaser])

  useEffect(() => {
    if (!mobileChatOpen) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      event.preventDefault()
      setChatOpen(false)
      requestAnimationFrame(() => portraitRef.current?.focus({ preventScroll: true }))
    }
    document.addEventListener("keydown", dismiss)
    return () => document.removeEventListener("keydown", dismiss)
  }, [mobileChatOpen])

  useEffect(() => {
    if (!desktopChatOpen || !mobileMessages) return
    const outsideChat = (event: Event) => {
      if (!(event.target instanceof Element)) return
      if (introRef.current?.dataset.chatOpen !== "true") return
      const chat = introRef.current?.querySelector(".about-intro-chat")
      const surface = introRef.current?.querySelector(".about-intro-surface")
      if (event.target.closest(".about-intro-chat-reaction-positioner") || chat?.contains(event.target) || surface?.contains(event.target)) return
      setChatCollapsed(true)
      setChatOpen(false)
    }
    document.addEventListener("pointerdown", outsideChat)
    document.addEventListener("focusin", outsideChat)
    return () => {
      document.removeEventListener("pointerdown", outsideChat)
      document.removeEventListener("focusin", outsideChat)
    }
  }, [desktopChatOpen, mobileMessages])

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
    setReply(mode)
    setReturnedReply(null)
    setReplyLabel(mode)
    setReplyContent(mode)
    setActionsOpen(false)
  }
  const openChat = () => {
    setChatCollapsed(false)
    setChatOpen(true)
    setActionsOpen(false)
  }
  const closeChat = (restoreFocus = true) => {
    setChatCollapsed(true)
    setChatOpen(false)
    if (restoreFocus) requestAnimationFrame(() => portraitRef.current?.focus({ preventScroll: true }))
  }
  const messageLabel = `${messageCount} ${messageCount === 1 ? "message" : "messages"}`

  return (
    <>
    <section ref={introRef} className="about-intro" style={chatAnchor} aria-label="A quick hello from Rafael" data-visible={visible} data-variant={variant}
      data-chat-open={chatExpanded}
      onPointerEnter={event => {
        if (event.pointerType === "mouse" && !mobileChat && media && !(variant === "b" && chatCollapsed)) {
          setActionsOpen(true)
        }
      }}
      onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setActionsOpen(false) }}
      onFocusCapture={() => {
        if (!mobileChat && !(variant === "b" && chatCollapsed)) setActionsOpen(true)
      }}
      onBlurCapture={event => {
        if (restoringReplyFocus.current) return
        // Closing keeps the composer mounted for its fade. Its newly inert
        // input blurs before focus is restored to the reply action.
        if (!reply && event.target instanceof HTMLElement && event.target.closest(".about-intro-reply")) return
        // Safari blurs a focused button on pointer-down without focusing the
        // next button. Keep the hovered target alive until its click completes.
        if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(":hover")) setActionsOpen(false)
      }}
      data-actions-open={actionsOpen || Boolean(returnedReply)} data-reply-layout={Boolean((reply || returnedReply || variant !== "a") && repliesAvailable)} data-reply-open={Boolean(reply && repliesAvailable)} inert={!visible} aria-hidden={!visible}
      onKeyDown={event => {
        if (event.key === "Escape" && mobileChatOpen) {
          event.preventDefault()
          event.stopPropagation()
          closeChat()
        } else if (event.key === "Escape" && reply && repliesAvailable) {
          event.preventDefault()
          event.stopPropagation()
          closeReply()
        }
      }}>
      <div className="about-intro-surface">
        <div className="about-intro-media">
          <img className="about-intro-poster" src={media ? media.assets.poster : portrait} width={720} height={720} alt="" />
          {media && animateTeaser && teaserIsGif && visible && !pageHidden &&
            <img className="about-intro-teaser" src={media.assets.teaser} width={180} height={180} alt="" />}
          {media && animateTeaser && !teaserIsGif && <video ref={teaserRef} className="about-intro-teaser" src={media.assets.teaser}
            muted loop playsInline preload="metadata" aria-hidden="true" />}
          {(variant === "b" || media) && <button ref={portraitRef} type="button" className="about-intro-portrait-trigger"
            aria-label={variant === "b" && mobileMessages ? `Open ${messageCount ? messageLabel : "messages"} from Rafa` : "Show introduction actions"}
            aria-expanded={variant === "b" ? chatExpanded : actionsOpen} aria-controls={variant === "b" ? `${id}-chat` : `${id}-actions`}
            onClick={variant === "b" ? openChat : () => setActionsOpen(true)} />}
        </div>
        {collapsedMessageCount > 0 && <span className="about-intro-chat-notification" aria-hidden="true">
          {notificationTransition.leaving && <span className="about-intro-chat-notification-ghost">{notificationTransition.leaving}</span>}
          <span key={notificationTransition.current} className="about-intro-chat-notification-number">{notificationTransition.current}</span>
        </span>}
      </div>
      {variant === "b" && <>
        <button type="button" className="about-intro-chat-backdrop" aria-label="Close messages"
          inert={!mobileChatOpen} aria-hidden={!mobileChatOpen} onClick={() => closeChat()} />
      </>}
      {variant === "b" ? <AboutIntroChat id={`${id}-chat`} active={chatActive} visible={chatVisible} modal={mobileChatOpen} onClose={closeChat} onMessageCount={setMessageCount} /> : <div id={`${id}-actions`} className="about-intro-actions" data-reply={reply ?? "none"} data-labeled={Boolean(replyLabel)} data-returned={Boolean(returnedReply)} inert={!repliesAvailable} aria-hidden={!repliesAvailable}>
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
    </section>
    {/* A sibling, not a child: inside the fixed intro, the intro's own
        compositing layer showed through the frost's backdrop blur as a pale
        square around the portrait. It follows the chat in document order, so
        it can anchor to it, and shares the intro's stacking context. */}
    {variant === "b" && <span className="about-intro-chat-frost" style={chatAnchor} data-open={chatExpanded} aria-hidden="true" />}
    </>
  )
}
