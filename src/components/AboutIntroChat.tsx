import { useEffect, useLayoutEffect, useId, useRef, useState, type CSSProperties, type FormEvent } from "react"
import { Menu } from "@base-ui/react/menu"
import { ArrowUp } from "./NavigationIcons"
import { trackEvent } from "../lib/analytics"
import { ignorePasswordManagers } from "../lib/passwordManagers"
import { sendContact, type ContactMessage } from "../lib/sendContact"
import { usePrefersReducedMotion } from "../lib/usePrefersReducedMotion"

const greeting = ["Hey, I’m Rafa.", "How are you doing?", "Wanna share your email with me so I can reach out to you?"]
const typingDuration = 900
// Rafa hearts the sent address the way a received tapback arrives: it pops onto
// the bubble's corner, then he starts typing. Each delay is a stage: the tapback
// lands, then the follow-up typing starts.
const reactionDelays = [900, 700]
const visitorReactions = [
  { id: "love", label: "Love", emoji: "🩷", announcement: "loved" },
  { id: "like", label: "Like", emoji: "👍", announcement: "liked" },
  { id: "dislike", label: "Dislike", emoji: "👎", announcement: "disliked" },
  { id: "laugh", label: "Laugh", emoji: "😂", announcement: "laughed at" },
  { id: "emphasize", label: "Emphasize", emoji: "‼️", announcement: "emphasized" },
  { id: "question", label: "Question", emoji: "❓", announcement: "questioned" },
] as const
type VisitorReactionId = typeof visitorReactions[number]["id"]

function ReactionGlyph({ reaction }: { reaction: typeof visitorReactions[number] }) {
  if (reaction.id === "laugh") return <span className="about-intro-tapback-symbol" data-symbol="laugh">HA<br />HA</span>
  if (reaction.id === "emphasize") return <span className="about-intro-tapback-symbol" data-symbol="emphasize">!!</span>
  if (reaction.id === "question") return <span className="about-intro-tapback-symbol" data-symbol="question">?</span>
  return reaction.emoji
}
const heartPath = "M12 20.7C6.1 16.6 2.5 13.3 2.5 9.2c0-2.8 2.2-4.9 4.9-4.9 1.9 0 3.6 1 4.6 2.6 1-1.6 2.7-2.6 4.6-2.6 2.7 0 4.9 2.1 4.9 4.9 0 4.1-3.6 7.4-9.5 11.5Z"
// Drawn twice, as the canvas ring and then the fill, so no ring cuts a neighbour.
const tapbackShape = <>
  <circle className="about-intro-chat-tapback-disc" cx="32" cy="20" r="18" />
  <circle className="about-intro-chat-tapback-trail" cx="18" cy="34" r="6.5" />
  <circle className="about-intro-chat-tapback-trail" data-far="true" cx="8" cy="44" r="3.5" />
</>

// Editing the sent address unsends it with a Messages-style puff: the bubble
// blurs away while its colour scatters as dots, then the email field returns.
const puffDuration = 480
// A fixed scatter across the bubble (percent positions, from the R2 sequence so it
// is even without falling into rows), drifting up and out like smoke. The right
// side drifts at most 6px so the history's 8px padding never clips it.
const puffDots = Array.from({ length: 24 }, (_, index) => {
  const x = Math.round((0.5 + index * 0.7548776662) % 1 * 100)
  const y = Math.round((0.5 + index * 0.5698402910) % 1 * 100)
  return { x, y, dx: Math.min(6, (x - 60) * 0.4), dy: (y - 50) * 0.3 - 10, size: 3 + (index * 7) % 4, delay: (index * 23) % 70 }
})

function ReactableMessage({ followup = false, messageIndex, onReaction, reactionId, text }: {
  followup?: boolean
  messageIndex: number
  onReaction: (messageIndex: number, reactionId: VisitorReactionId) => void
  reactionId?: VisitorReactionId
  text: string
}) {
  const selected = visitorReactions.find(item => item.id === reactionId)
  return <Menu.Root orientation="horizontal" modal={false}>
    <span className="about-intro-chat-received about-intro-chat-new"
      data-followup={followup || undefined} data-reacted={Boolean(selected) || undefined}>
      <Menu.Trigger className="about-intro-chat-bubble" aria-label={`React to “${text}”`}>{text}</Menu.Trigger>
      {selected && <span key={selected.id} className="about-intro-chat-visitor-tapback" role="img"
        aria-label={`You ${selected.announcement} “${text}”`}>
        <svg viewBox="0 0 52 50" width="52" height="50" aria-hidden="true">
          <g transform="translate(52 0) scale(-1 1)">
            <g fill="var(--canvas)" stroke="var(--canvas)" strokeWidth="4">{tapbackShape}</g>
            <g fill="currentColor">{tapbackShape}</g>
          </g>
        </svg>
        <span className="about-intro-chat-visitor-tapback-glyph" aria-hidden="true"><ReactionGlyph reaction={selected} /></span>
      </span>}
    </span>
    <Menu.Portal>
      <Menu.Positioner className="about-intro-chat-reaction-positioner" positionMethod="fixed"
        side="top" align="end" sideOffset={4} collisionPadding={12}>
        <Menu.Popup className="about-intro-chat-reaction-picker" aria-label={`React to “${text}”`}>
          {visitorReactions.map(choice => <Menu.CheckboxItem key={choice.id} label={choice.label}
              checked={reactionId === choice.id} onCheckedChange={() => onReaction(messageIndex, choice.id)}
              closeOnClick className="about-intro-chat-reaction-choice" aria-label={choice.label}>
              <span aria-hidden="true"><ReactionGlyph reaction={choice} /></span>
            </Menu.CheckboxItem>)}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
}

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
  const [visitorReaction, setVisitorReaction] = useState<Partial<Record<number, VisitorReactionId>>>({})
  const [reactionFeedback, setReactionFeedback] = useState("Tap a message to react — I’ll see what lands.")
  const sentRef = useRef<HTMLDivElement>(null)
  // The unsent bubble's box within the history, where its dots scatter from.
  const [puff, setPuff] = useState<{ top: number; left: number; width: number; height: number } | null>(null)
  const puffing = puff !== null
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
    // An unsend in progress holds the conversation where it is.
    if (!active || puffing || revealed >= target) return
    const timer = window.setTimeout(() => setRevealed(count => skipTyping ? target : count + 1), skipTyping ? 0 : typingDuration)
    return () => window.clearTimeout(timer)
  }, [active, puffing, revealed, target, skipTyping])

  useEffect(() => {
    if (!active || !confirmed || puffing || reactionStage >= reactionDelays.length) return
    const timer = window.setTimeout(() => setReaction(stage => stage + 1), reactionDelays[reactionStage])
    return () => window.clearTimeout(timer)
  }, [active, confirmed, puffing, reactionStage])

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
    const sent = sentRef.current
    setPuff({ top: sent?.offsetTop ?? 0, left: sent?.offsetLeft ?? 0, width: sent?.offsetWidth ?? 0, height: sent?.offsetHeight ?? 0 })
  }

  const reactToMessage = (messageIndex: number, reactionId: VisitorReactionId) => {
    const choice = visitorReactions.find(item => item.id === reactionId)
    if (!choice) return
    const removing = visitorReaction[messageIndex] === reactionId
    setVisitorReaction(current => ({ ...current, [messageIndex]: removing ? undefined : reactionId }))
    setReactionFeedback(removing ? `Removed your ${choice.emoji}.` : `Got it — I’ll see your ${choice.emoji}.`)
    if (!removing) trackEvent("about_intro_reaction", { message_index: messageIndex, reaction: reactionId })
  }

  useEffect(() => {
    if (!puffing) return
    const timer = window.setTimeout(() => {
      setPuff(null)
      setConfirmed(false)
      setReaction(0)
      setDelivery("idle")
      requestAnimationFrame(() => emailRef.current?.focus({ preventScroll: true }))
    }, skipTyping ? 0 : puffDuration)
    return () => window.clearTimeout(timer)
  }, [puffing, skipTyping])

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
      {emailReady && <p className="about-intro-chat-reaction-hint" role="status" aria-live={active ? "polite" : undefined}>{reactionFeedback}</p>}
      {/* Only the typing bubble has a tail on Rafa's side; once a question lands, the visitor's field below it carries one on the right. */}
      {greeting.slice(0, Math.min(shown, 3)).map((text, messageIndex) =>
        <ReactableMessage key={text} text={text} messageIndex={messageIndex}
          reactionId={visitorReaction[messageIndex]} onReaction={reactToMessage} />)}
      {confirmed && <>
        <div ref={sentRef} className="about-intro-chat-sent about-intro-chat-new" data-reacted={reactionShown} data-puff={puffing}>
          <button type="button" className="about-intro-chat-outgoing" onClick={puffing ? undefined : editEmail}
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
        {/* A sibling rather than a child, so the dots outlive the bubble's fade. */}
        {puff && !skipTyping && <span className="about-intro-chat-puff" style={puff} aria-hidden="true">
          {puffDots.map(({ x, y, dx, dy, size, delay }) => <i key={`${x}-${y}`} style={{
            left: `${x}%`, top: `${y}%`, width: size, height: size,
            "--puff-x": `${dx}px`, "--puff-y": `${dy}px`, animationDelay: `${delay}ms`,
          } as CSSProperties} />)}
        </span>}
        {messageReady && <ReactableMessage text="Want to share anything else?" messageIndex={3} followup
          reactionId={visitorReaction[3]} onReaction={reactToMessage} />}
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
