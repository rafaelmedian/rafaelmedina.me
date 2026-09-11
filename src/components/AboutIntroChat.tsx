import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import ArrowUp02Icon from "@hugeicons/core-free-icons/ArrowUp02Icon"
import { siteLinks } from "../data/portfolio"

export default function AboutIntroChat({ active }: { active: boolean }) {
  const id = useId()
  const historyRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const [email, setEmail] = useState("")
  const [valid, setValid] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [message, setMessage] = useState("")
  const [draftOpened, setDraftOpened] = useState(false)

  useEffect(() => {
    if (active && confirmed && historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [active, confirmed])

  const confirmEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!valid) return
    setConfirmed(true)
    requestAnimationFrame(() => messageRef.current?.focus({ preventScroll: true }))
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

  return <section className="about-intro-chat" data-active={active} data-step={confirmed ? "message" : "email"}
    inert={!active} aria-hidden={!active} aria-label="Chat with Rafa">
    <div ref={historyRef} className="about-intro-chat-history" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
      <p className="about-intro-chat-bubble about-intro-chat-enter" data-order="1">Hey, I’m Rafa.</p>
      <p className="about-intro-chat-bubble about-intro-chat-enter" data-order="2">How are you doing?</p>
      <p className={`about-intro-chat-bubble about-intro-chat-enter${confirmed ? "" : " about-intro-chat-tail"}`} data-order="3">Wanna share your email with me so I can reach out to you?</p>
      {confirmed && <>
        <button type="button" className="about-intro-chat-outgoing about-intro-chat-new" onClick={editEmail}
          aria-label={`Edit email address: ${email}`} title="Edit your email">{email}</button>
        <p className="about-intro-chat-bubble about-intro-chat-tail about-intro-chat-new" data-followup>Want to share anything else?</p>
      </>}
    </div>
    {!confirmed ? <form className="about-intro-chat-composer about-intro-chat-enter" data-order="4" onSubmit={confirmEmail}>
      <input ref={emailRef} type="email" aria-label="Your email" autoComplete="email" required maxLength={254}
        placeholder="hello@example.com" value={email} onChange={event => {
          setEmail(event.target.value)
          setValid(event.currentTarget.validity.valid)
        }} />
      <button type="submit" className="about-intro-send" aria-label="Continue with email" data-empty={!email}
        disabled={!valid} aria-hidden={!email}>
        <HugeiconsIcon icon={ArrowUp02Icon} size={24} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </form> : <form className="about-intro-chat-message about-intro-chat-new" onSubmit={openDraft}>
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
