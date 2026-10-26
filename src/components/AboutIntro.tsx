import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react"
import type { CSSProperties } from "react"
import AboutIntroChat from "./AboutIntroChat"

import type { AboutIntroMedia } from "../data/aboutIntro"
import { AboutIntroPortrait } from "./AboutIntroPortrait"
import { usePageHidden } from "../lib/usePageHidden"

const mobileMessagesQuery = "(max-width: 899.98px)"
const subscribeMobileMessages = (listener: () => void) => {
  const query = window.matchMedia(mobileMessagesQuery)
  query.addEventListener("change", listener)
  return () => query.removeEventListener("change", listener)
}
const mobileMessagesMatch = () => window.matchMedia(mobileMessagesQuery).matches
const mobileMessagesOnServer = () => false

export default function AboutIntro({ media, portrait, visible, mobileMessages = false, repliesAvailable = true }: {
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
  const [chatOpen, setChatOpen] = useState(false)
  const [chatCollapsed, setChatCollapsed] = useState(true)
  const [messageCount, setMessageCount] = useState(0)
  const [notificationTransition, setNotificationTransition] = useState<{ current: number, leaving?: number }>({ current: 0 })
  const available = visible && repliesAvailable
  const [wasAvailable, setWasAvailable] = useState(available)
  // A new About visit starts with the portrait. Adjust this component's state
  // before rendering children into a new context.
  if (wasAvailable !== available) {
    setWasAvailable(available)
    if (!available) {
      setChatCollapsed(true)
      setChatOpen(false)
    }
  }
  const portraitRef = useRef<HTMLButtonElement>(null)
  const introRef = useRef<HTMLElement>(null)
  const pageHidden = usePageHidden()
  const mobileViewport = useSyncExternalStore(subscribeMobileMessages, mobileMessagesMatch, mobileMessagesOnServer)
  const mobileChat = mobileMessages && mobileViewport
  const chatActive = visible && repliesAvailable && !pageHidden
  const mobileChatOpen = mobileChat && chatActive && chatOpen
  const desktopChatOpen = !mobileChat && chatActive && !chatCollapsed
  const chatExpanded = mobileChatOpen || desktopChatOpen
  const chatVisible = chatExpanded
  const collapsedMessageCount = !chatExpanded ? messageCount : 0
  if (notificationTransition.current !== collapsedMessageCount) {
    setNotificationTransition({
      current: collapsedMessageCount,
      leaving: notificationTransition.current || undefined,
    })
  }
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

  const openChat = () => {
    setChatCollapsed(false)
    setChatOpen(true)
  }
  const closeChat = (restoreFocus = true) => {
    setChatCollapsed(true)
    setChatOpen(false)
    if (restoreFocus) requestAnimationFrame(() => portraitRef.current?.focus({ preventScroll: true }))
  }
  const messageLabel = `${messageCount} ${messageCount === 1 ? "message" : "messages"}`

  return (
    <>
    <section ref={introRef} className="about-intro" style={chatAnchor} aria-label="A quick hello from Rafael" data-visible={visible} data-variant="b"
      data-chat-open={chatExpanded}
      inert={!visible} aria-hidden={!visible}
      onKeyDown={event => {
        if (event.key === "Escape" && mobileChatOpen) {
          event.preventDefault()
          event.stopPropagation()
          closeChat()
        }
      }}>
      <div className="about-intro-surface">
        <AboutIntroPortrait media={media} portrait={portrait} visible={visible}>
          <button ref={portraitRef} type="button" className="about-intro-portrait-trigger"
            aria-label={mobileMessages
              ? chatExpanded ? "Close messages from Rafa" : `Open ${messageCount ? messageLabel : "messages"} from Rafa`
              : "Show introduction actions"}
            aria-expanded={chatExpanded} aria-controls={`${id}-chat`}
            onClick={() => chatExpanded ? closeChat() : openChat()} />
        </AboutIntroPortrait>
        {collapsedMessageCount > 0 && <span className="about-intro-chat-notification" aria-hidden="true">
          {notificationTransition.leaving && <span className="about-intro-chat-notification-ghost">{notificationTransition.leaving}</span>}
          <span key={notificationTransition.current} className="about-intro-chat-notification-number">{notificationTransition.current}</span>
        </span>}
      </div>
      <button type="button" className="about-intro-chat-backdrop" aria-label="Close messages"
        inert={!mobileChatOpen} aria-hidden={!mobileChatOpen} onClick={() => closeChat()} />
      <AboutIntroChat id={`${id}-chat`} active={chatActive} visible={chatVisible} modal={mobileChatOpen} onClose={closeChat} onMessageCount={setMessageCount} />
    </section>
    {/* A sibling, not a child: inside the fixed intro, the intro's own
        compositing layer showed through the frost's backdrop blur as a pale
        square around the portrait. It follows the chat in document order, so
        it can anchor to it, and shares the intro's stacking context. */}
    <span className="about-intro-chat-frost" style={chatAnchor} data-open={chatExpanded} aria-hidden="true" />
    </>
  )
}
