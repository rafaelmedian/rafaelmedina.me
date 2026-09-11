import { useEffect, useLayoutEffect, useId, useRef, useState, type FormEvent } from "react"
import { ArrowUp } from "./NavigationIcons"
import { ignorePasswordManagers } from "../lib/passwordManagers"
import { sendContact, type ContactMessage } from "../lib/sendContact"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"

const greeting = ["Hey, I’m Rafa.", "How are you doing?", "Wanna share your email with me so I can reach out to you?"]
const typingDuration = 900
// Rafa hearts the sent address the way a received tapback arrives: it pops onto
// the bubble's corner, then he starts typing. Each delay is a stage: the tapback
// lands, then the follow-up typing starts.
const reactionDelays = [900, 700]
const heartPath = "M12 20.7C6.1 16.6 2.5 13.3 2.5 9.2c0-2.8 2.2-4.9 4.9-4.9 1.9 0 3.6 1 4.6 2.6 1-1.6 2.7-2.6 4.6-2.6 2.7 0 4.9 2.1 4.9 4.9 0 4.1-3.6 7.4-9.5 11.5Z"
// Drawn twice, as the canvas ring and then the fill, so no ring cuts a neighbour.
const tapbackShape = <>
  <circle className="about-intro-chat-tapback-disc" cx="32" cy="20" r="18" />
  <circle className="about-intro-chat-tapback-trail" cx="18" cy="34" r="6.5" />
  <circle className="about-intro-chat-tapback-trail" data-far="true" cx="8" cy="44" r="3.5" />
</>

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
  const [delivery, setDelivery] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [deliveryError, setDeliveryError] = useState("")
  const sending = useRef(false)
  const lastSubmission = useRef<ContactMessage | null>(null)
  const locked = delivery === "sending" || delivery === "sent"
  const [revealed, setRevealed] = useState(0)
  const [reaction, setReaction] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const skipTyping = reducedMotion || (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  const reactionStage = confirmed ? (skipTyping ? reactionDelays.length : reaction) : 0
  const reactionShown = reactionStage >= 1
  const target = reactionStage >= reactionDelays.length ? 4 : 3
  const shown = skipTyping ? target : revealed
  const emailReady = shown >= 3
  const messageReady = shown >= 4
  const typing = shown < target
  const pending = confirmed ? !messageReady : !emailReady

  useLayoutEffect(() => {
    const chat = chatRef.current
    const form = chat?.querySelector("form")
    if (!chat || !form) return
    const intro = chat.closest<HTMLElement>(".about-intro")
    const stage = chat.closest<HTMLElement>(".intro-comparison-stage")
    const measure = () => {
      chat.style.setProperty("--intro-reply-height", `${form.offsetHeight}px`)
      if (!intro) return
      const ceiling = Math.max(12, stage?.getBoundingClientRect().top ?? 12)
      const bottom = intro.getBoundingClientRect().bottom
      const offset = Number.parseFloat(getComputedStyle(chat).bottom) || 0
      chat.style.setProperty("--intro-history-height", `${Math.max(88, bottom - ceiling - offset - form.offsetHeight - 8)}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(form)
    let frame = 0
    const schedule = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; measure() }) }
    window.addEventListener("resize", schedule)
    window.addEventListener("scroll", schedule, { passive: true })
    window.visualViewport?.addEventListener("resize", schedule)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("scroll", schedule)
      window.visualViewport?.removeEventListener("resize", schedule)
    }
  }, [confirmed, active])

  useLayoutEffect(() => {
    const field = messageRef.current
    if (!field) return
    // Fit the message to its text; CSS clamps it between its floor and cap.
    const fit = () => {
      field.style.height = "auto"
      field.style.height = `${field.scrollHeight}px`
    }
    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [confirmed, message])

  useEffect(() => {
    if (!active || revealed >= target) return
    const timer = window.setTimeout(() => setRevealed(count => skipTyping ? target : count + 1), skipTyping ? 0 : typingDuration)
    return () => window.clearTimeout(timer)
  }, [active, revealed, target, skipTyping])

  useEffect(() => {
    if (!active || !confirmed || reactionStage >= reactionDelays.length) return
    const timer = window.setTimeout(() => setReaction(stage => stage + 1), reactionDelays[reactionStage])
    return () => window.clearTimeout(timer)
  }, [active, confirmed, reactionStage])

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
  }, [active, confirmed, reactionShown, shown])

  const confirmEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid) return
    focusAfterTyping.current = true
    setConfirmed(true)
  }
  const editEmail = () => {
    setConfirmed(false)
    setReaction(0)
    setDelivery("idle")
    requestAnimationFrame(() => emailRef.current?.focus({ preventScroll: true }))
  }
  const submitMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending.current || delivery === "sent" || !valid) return
    const previous = lastSubmission.current
    const payload = previous?.email === email.trim() && previous.message === message.trim()
      ? previous : { email: email.trim(), message: message.trim(), requestId: crypto.randomUUID() }
    lastSubmission.current = payload
    sending.current = true
    setDelivery("sending")
    setDeliveryError("")
    try {
      await sendContact(payload)
      setDelivery("sent")
    } catch (error) {
      setDeliveryError(error instanceof Error ? error.message : "Couldn't send. Please retry.")
      setDelivery("error")
    } finally {
      sending.current = false
    }
  }

  return <section ref={chatRef} className="about-intro-chat" data-active={active} data-typing={pending} data-step={confirmed ? "message" : "email"}
    inert={!active} aria-hidden={!active} aria-label="Chat with Rafa">
    {/* Hidden live regions can make modal isolation hide the neighboring player. */}
    <div ref={historyRef} className="about-intro-chat-history" role="log" aria-label="Conversation" aria-live={active ? "polite" : undefined} aria-relevant="additions">
      {/* Only the typing bubble has a tail on Rafa's side; once a question lands, the visitor's field below it carries one on the right. */}
      {greeting.slice(0, Math.min(shown, 3)).map(text => <p key={text} className="about-intro-chat-bubble about-intro-chat-new">{text}</p>)}
      {confirmed && <>
        <div className="about-intro-chat-sent about-intro-chat-new" data-reacted={reactionShown}>
          <button type="button" className="about-intro-chat-outgoing" onClick={editEmail}
            aria-label={`Edit email address: ${email}`} title="Edit your email" disabled={locked}>{email}</button>
          {reactionShown && <svg className="about-intro-chat-reaction" viewBox="0 0 52 50" width="52" height="50" role="img" aria-label="Loved by Rafa">
            <circle className="about-intro-chat-tapback-ripple" cx="32" cy="20" r="18" />
            <g fill="var(--canvas)" stroke="var(--canvas)" strokeWidth="4">{tapbackShape}</g>
            <g fill="currentColor">{tapbackShape}</g>
            <g className="about-intro-chat-tapback-heart">
              <g transform="translate(21.8 9.6) scale(0.85)"><path className="about-intro-chat-heart" d={heartPath} /></g>
            </g>
          </svg>}
        </div>
        {messageReady && <p className="about-intro-chat-bubble about-intro-chat-new" data-followup>Want to share anything else?</p>}
      </>}
      {typing && <div key={`typing-${shown}`} className="about-intro-chat-bubble about-intro-chat-tail about-intro-chat-typing about-intro-chat-new"
        role="status" aria-label="Rafa is typing">
        <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
      </div>}
    </div>
    {!confirmed ? <form className="about-intro-chat-composer about-intro-chat-enter" data-order="4" data-pending={!emailReady} inert={!emailReady} aria-hidden={!emailReady} onSubmit={confirmEmail}>
      <input ref={emailRef} type="email" aria-label="Your email" autoComplete="email" required maxLength={254}
        {...ignorePasswordManagers} placeholder="hello@example.com" value={email} onChange={event => {
          setEmail(event.target.value)
          setValid(event.currentTarget.validity.valid)
        }} />
      <button type="submit" className="about-intro-send" aria-label="Continue with email"
        disabled={!valid}>
        <ArrowUp size={24} aria-hidden="true" />
      </button>
    </form> : <form className="about-intro-chat-message about-intro-chat-new" data-pending={!messageReady} inert={!messageReady} aria-hidden={!messageReady} onSubmit={submitMessage} aria-busy={delivery === "sending"}>
      <div className="about-intro-chat-composer">
        <textarea ref={messageRef} aria-label="Your message (optional)" aria-describedby={`${id}-delivery`} maxLength={2000}
          rows={2} {...ignorePasswordManagers} placeholder="Anything on your mind?" value={message} readOnly={locked} onChange={event => { setMessage(event.target.value); setDelivery("idle") }} />
        <button type="submit" className="about-intro-send" aria-label={delivery === "error" ? "Retry message" : "Send message"} disabled={locked} data-muted={!message.trim()}>
          <ArrowUp size={24} aria-hidden="true" />
        </button>
      </div>
      <p id={`${id}-delivery`} className="about-intro-chat-hint" role="status" aria-live={active ? "polite" : undefined}>
        {delivery === "sending" ? "Sending…" : delivery === "sent" ? "Sent. Thanks for saying hello!" :
          delivery === "error" ? deliveryError : "Optional. Send straight to my inbox."}
      </p>
    </form>}
  </section>
}
