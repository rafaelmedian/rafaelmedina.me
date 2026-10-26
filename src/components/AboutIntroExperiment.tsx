import { useCallback, useId, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
// Direct imports keep the deferred development chunk free of the full icon catalog.
import BubbleChatIcon from "@hugeicons/core-free-icons/BubbleChatIcon"
import Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon"

import AboutIntroReply from "./AboutIntroReply"
import { AboutIntroPortrait } from "./AboutIntroPortrait"
import "./about-intro-experiment.css"

import type { IntroOption } from "../data/aboutIntro"
import type { AboutIntroMedia } from "../data/aboutIntro"

export default function AboutIntroExperiment({ media, portrait, visible, repliesAvailable = true, variant }: {
  variant: Exclude<IntroOption, "b">
  media?: AboutIntroMedia
  portrait: string
  repliesAvailable?: boolean
  visible: boolean
}) {
  const id = useId()
  const [actionsOpen, setActionsOpen] = useState(false)
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
  return (
    <section className="about-intro" aria-label="A quick hello from Rafael" data-visible={visible} data-variant={variant}
      onPointerEnter={event => {
        if (event.pointerType === "mouse" && media) {
          setActionsOpen(true)
        }
      }}
      onPointerLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setActionsOpen(false) }}
      onFocusCapture={() => {
        setActionsOpen(true)
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
        if (event.key === "Escape" && reply && repliesAvailable) {
          event.preventDefault()
          event.stopPropagation()
          closeReply()
        }
      }}>
      <div className="about-intro-surface">
        <AboutIntroPortrait media={media} portrait={portrait} visible={visible}>
          {media && <button ref={portraitRef} type="button" className="about-intro-portrait-trigger"
            aria-label="Show introduction actions" aria-expanded={actionsOpen} aria-controls={`${id}-actions`}
            onClick={() => setActionsOpen(true)} />}
        </AboutIntroPortrait>
      </div>
      <div id={`${id}-actions`} className="about-intro-actions" data-reply={reply ?? "none"} data-labeled={Boolean(replyLabel)} data-returned={Boolean(returnedReply)} inert={!repliesAvailable} aria-hidden={!repliesAvailable}>
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
      </div>
    </section>
  )
}
