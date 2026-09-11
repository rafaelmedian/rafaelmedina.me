import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { ArrowUp } from "./NavigationIcons"

import { siteLinks } from "../data/portfolio"

export default function AboutIntroReply({ mode, active, onClose }: {
  mode: "email" | "text"
  active: boolean
  onClose: (restoreFocus?: boolean) => void
}) {
  const id = useId()
  const panelRef = useRef<HTMLElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const [email, setEmail] = useState("")
  const [emailValid, setEmailValid] = useState(false)
  const [message, setMessage] = useState("")
  const [draftOpened, setDraftOpened] = useState(false)

  useEffect(() => {
    if (!active) return
    const input = mode === "email" ? emailRef.current : messageRef.current
    input?.focus({ preventScroll: true })
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !panelRef.current?.closest(".about-intro")?.contains(event.target)) onClose(false)
    }
    document.addEventListener("pointerdown", dismiss)
    return () => document.removeEventListener("pointerdown", dismiss)
  }, [mode, active, onClose])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = `Reply to: ${email.trim()}\n\n${message.trim() || "Hi Rafael, I’d like to know more."}`
    window.location.href = `mailto:${siteLinks.email}?subject=${encodeURIComponent("A hello from your website")}&body=${encodeURIComponent(body)}`
    setDraftOpened(true)
  }

  return (
    <section ref={panelRef} className="about-intro-reply" data-mode={mode} data-active={active} inert={!active} aria-hidden={!active} aria-label={mode === "email" ? "Email reply" : "Text reply"}>
      <form onSubmit={submit}>
        {mode === "text" && <textarea ref={messageRef} aria-label="Your message" name="message" rows={3}
          maxLength={2000} value={message} onChange={event => setMessage(event.target.value)} placeholder="Your message…" />}
        <div className="about-intro-email-row">
          <input ref={emailRef} type="email" name="email" aria-label="Your email" autoComplete="email" required
            maxLength={254} value={email} onChange={event => {
              setEmail(event.target.value)
              setEmailValid(event.currentTarget.validity.valid)
            }} placeholder="hello@example.com" />
          <button type="submit" className="about-intro-send" data-empty={!email} disabled={!emailValid} aria-hidden={!email} aria-label="Open email draft" aria-describedby={`${id}-hint`}
            title="Review and send in your email app"><ArrowUp size={24} aria-hidden="true" /></button>
        </div>
      </form>
      <span id={`${id}-hint`} className="sr-only">Review and send in your email app.</span>
      {draftOpened && <span className="sr-only" role="status">Finish sending in your email app.</span>}
    </section>
  )
}
