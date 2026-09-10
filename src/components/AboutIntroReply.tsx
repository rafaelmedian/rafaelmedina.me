import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

import AboutIntroRecorder from "./AboutIntroRecorder"

import { siteLinks } from "../data/portfolio"

// No draft is written to localStorage or a database. Closing the panel clears it.
export default function AboutIntroReply({ mode, onClose }: {
  mode: "text" | "video"
  onClose: () => void
}) {
  const id = useId()
  const [step, setStep] = useState<"email" | "message">("email")
  const [draftOpened, setDraftOpened] = useState(false)
  const [email, setEmail] = useState("")
  const [clip, setClip] = useState<Blob | null>(null)
  const [message, setMessage] = useState("")
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (step === "email") emailRef.current?.focus({ preventScroll: true })
    if (step === "message") messageRef.current?.focus({ preventScroll: true })
  }, [step])

  const continueReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStep("message")
  }

  return (
    <section className="about-intro-reply" aria-label={mode === "video" ? "Video reply" : "Text reply"}>
      <header className="about-intro-reply-header">
        <span>A little hello back</span>
        <button type="button" className="about-intro-button" aria-label="Close reply" onClick={onClose}><X size={18} aria-hidden="true" /></button>
      </header>
      <form hidden={step !== "email"} onSubmit={continueReply}>
        <label htmlFor={`${id}-email`}>What’s your email?</label>
        <p>So I can get back to you.</p>
        <input ref={emailRef} id={`${id}-email`} type="email" name="email" autoComplete="email" required
          maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" />
        <button className="about-intro-reply-primary" type="submit">Continue <ArrowRight size={16} aria-hidden="true" /></button>
      </form>
      <div hidden={step !== "message"}>
        <button type="button" className="about-intro-reply-back" aria-label="Edit email" onClick={() => setStep("email")}>
          <ArrowLeft size={14} aria-hidden="true" /><span>{email}</span>
        </button>
        <label htmlFor={`${id}-message`}>Anything you’d like to know?</label>
        <p>Optional. A question, an idea, or just a hello.</p>
        <textarea ref={messageRef} id={`${id}-message`} name="message" rows={3} maxLength={2000}
          value={message} onChange={event => setMessage(event.target.value)} placeholder="I’d love to hear more about…" />
        {mode === "video" && <AboutIntroRecorder onChange={setClip} active={step === "message"} />}
        <a className="about-intro-reply-primary" href={`mailto:${siteLinks.email}?subject=${encodeURIComponent("A hello from your website")}&body=${encodeURIComponent(`Reply to: ${email}\n\n${message.trim() || "Hi Rafael, I’d like to know more."}`)}`}
          onClick={() => setDraftOpened(true)}>Open email draft <ArrowRight size={16} aria-hidden="true" /></a>
        <p className="about-intro-reply-note">{clip ? "Download your video above, then attach it in your email app. Attachments aren’t added automatically." : "You’ll review and send it in your email app."}</p>
      </div>
      {draftOpened && <p className="about-intro-reply-note" role="status">Finish sending in your email app. Nothing has been sent by this website.</p>}
    </section>
  )
}
