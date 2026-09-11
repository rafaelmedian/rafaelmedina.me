import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import ArrowUp02Icon from "@hugeicons/core-free-icons/ArrowUp02Icon"
import { siteLinks } from "../data/portfolio"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"

const greeting = ["Hey, I’m Rafa.", "How are you doing?", "Wanna share your email with me so I can reach out to you?"]
const typingDuration = 900

export default function AboutIntroChat({ active }: { active: boolean }) {
  const id = useId()
  const chatRef = useRef<HTMLElement>(null)
  const focusAfterTyping = useRef(false)
  const focusWhileTyping = useRef<Element | null>(null)
  const historyRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const [email, setEmail] = useState("")
  const [valid, setValid] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [message, setMessage] = useState("")
  const [draftOpened, setDraftOpened] = useState(false)
  const [revealed, setRevealed] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const skipTyping = reducedMotion || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const target = confirmed ? 4 : 3
  const shown = skipTyping ? target : revealed
  const emailReady = shown >= 3
  const messageReady = shown >= 4
  const typing = shown < target

  useEffect(() => {
    if (!active || revealed >= target) return
    const timer = window.setTimeout(() => setRevealed(count => skipTyping ? target : count + 1), skipTyping ? 0 : typingDuration)
    return () => window.clearTimeout(timer)
  }, [active, revealed, target, skipTyping])

  useEffect(() => {
    if (!active) focusAfterTyping.current = false
    if (active && confirmed && !messageReady && focusAfterTyping.current) {
      // Safari moves focus to the nearest focusable ancestor when email unmounts.
      focusWhileTyping.current = document.activeElement
    }
    if (!active || !confirmed || !messageReady || !focusAfterTyping.current) return
    focusAfterTyping.current = false
    if (document.activeElement === document.body || document.activeElement === focusWhileTyping.current || chatRef.current?.contains(document.activeElement)) {
      messageRef.current?.focus({ preventScroll: true })
    }
  }, [active, confirmed, messageReady])

  useEffect(() => {
    const cancelFocus = (event: PointerEvent) => {
      if (event.target instanceof Node && !chatRef.current?.contains(event.target)) focusAfterTyping.current = false
    }
    document.addEventListener("pointerdown", cancelFocus)
    return () => document.removeEventListener("pointerdown", cancelFocus)
  }, [])

  useEffect(() => {
    if (active && historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [active, confirmed, shown])

  const confirmEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid) return
    focusAfterTyping.current = true
    setConfirmed(true)
  }
  const editEmail = () => {
    setConfirmed(false)
    setDraftOpened(false)
    requestAnimationFrame(() => emailRef.current?.focus({ preventScroll: true }))
  }
  const openDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = `Reply to: ${email.trim()}\n\n${message.trim() || "Hi Rafa, I’d like to keep in touch."}`
    window.location.href = `mailto:${siteLinks.email}?subject=${encodeURIComponent("A hello from your website")}&body=${encodeURIComponent(body)}`
    setDraftOpened(true)
  }

  return <section ref={chatRef} className="about-intro-chat" data-active={active} data-step={confirmed ? "message" : "email"}
    inert={!active} aria-hidden={!active} aria-label="Chat with Rafa">
    {/* Hidden live regions can make modal isolation hide the neighboring player. */}
    <div ref={historyRef} className="about-intro-chat-history" role="log" aria-label="Conversation" aria-live={active ? "polite" : undefined} aria-relevant="additions">
      {greeting.slice(0, Math.min(shown, 3)).map((text, index) => <p key={text}
        className={`about-intro-chat-bubble about-intro-chat-new${index === 2 && !confirmed ? " about-intro-chat-tail" : ""}`}>{text}</p>)}
      {confirmed && <>
        <button type="button" className="about-intro-chat-outgoing about-intro-chat-new" onClick={editEmail}
          aria-label={`Edit email address: ${email}`} title="Edit your email">{email}</button>
        {messageReady && <p className="about-intro-chat-bubble about-intro-chat-tail about-intro-chat-new" data-followup>Want to share anything else?</p>}
      </>}
      {typing && <div key={`typing-${shown}`} className="about-intro-chat-bubble about-intro-chat-tail about-intro-chat-typing about-intro-chat-new"
        role="status" aria-label="Rafa is typing">
        <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
      </div>}
    </div>
    {!confirmed ? <form className="about-intro-chat-composer about-intro-chat-enter" data-order="4" data-pending={!emailReady} inert={!emailReady} aria-hidden={!emailReady} onSubmit={confirmEmail}>
      <input ref={emailRef} type="email" aria-label="Your email" autoComplete="email" required maxLength={254}
        placeholder="hello@example.com" value={email} onChange={event => {
          setEmail(event.target.value)
          setValid(event.currentTarget.validity.valid)
        }} />
      <button type="submit" className="about-intro-send" aria-label="Continue with email" data-empty={!email}
        disabled={!valid} aria-hidden={!email}>
        <HugeiconsIcon icon={ArrowUp02Icon} size={24} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </form> : <form className="about-intro-chat-message about-intro-chat-new" data-pending={!messageReady} inert={!messageReady} aria-hidden={!messageReady} onSubmit={openDraft}>
      <div className="about-intro-chat-composer">
        <textarea ref={messageRef} aria-label="Your message (optional)" aria-describedby={`${id}-delivery`} maxLength={2000}
          rows={2} placeholder="Anything on your mind?" value={message} onChange={event => setMessage(event.target.value)} />
        <button type="submit" className="about-intro-send" aria-label="Open email draft" title="Review and send in your email app">
          <HugeiconsIcon icon={ArrowUp02Icon} size={24} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
      <p id={`${id}-delivery`} className="about-intro-chat-hint">Optional. Review and send in your email app.</p>
    </form>}
    {draftOpened && <p className="about-intro-chat-hint" role="status">Finish sending in your email app.</p>}
  </section>
}
