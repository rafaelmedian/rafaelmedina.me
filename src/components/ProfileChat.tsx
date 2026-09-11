import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { ArrowLeft, ArrowUp, RotateCcw } from "lucide-react"

import type { SiteLinks } from "../data/portfolio"
import { askProfileChat, type ProfileChatMessage } from "../lib/profileChat"

const emailStorageKey = "rafaelmedina:chat-email"
const messagesStorageKey = "rafaelmedina:chat-messages"
const welcomeMessage: ProfileChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hi — I’m an AI guide to Rafael’s work. Ask me about his experience, process, availability, or what it’s like to work together.",
}
const suggestions = [
  "What kind of products does Rafael design?",
  "Does Rafael write code too?",
  "How could we work together?",
]

type ProfileChatProps = {
  open: boolean
  name: string
  photo: string
  links: SiteLinks
  onClose: () => void
}

function storedEmail() {
  if (typeof window === "undefined") return ""
  try { return localStorage.getItem(emailStorageKey) ?? "" } catch { return "" }
}

function storedMessages() {
  if (typeof window === "undefined") return [welcomeMessage]
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(messagesStorageKey) ?? "null")
    if (!Array.isArray(parsed)) return [welcomeMessage]
    const messages = parsed.filter((message): message is ProfileChatMessage =>
      Boolean(message) && typeof message === "object"
      && "id" in message && typeof message.id === "string"
      && "role" in message && ["user", "assistant"].includes(String(message.role))
      && "content" in message && typeof message.content === "string",
    ).slice(-20)
    return messages.length ? messages : [welcomeMessage]
  } catch { return [welcomeMessage] }
}

function saveMessages(messages: ProfileChatMessage[]) {
  try { localStorage.setItem(messagesStorageKey, JSON.stringify(messages.slice(-20))) } catch { /* Session only. */ }
}

export function ProfileChat({ open, name, photo, links, onClose }: ProfileChatProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<AbortController | null>(null)
  const inputId = useId()
  const [email, setEmail] = useState(storedEmail)
  const [emailDraft, setEmailDraft] = useState(storedEmail)
  const [messages, setMessages] = useState(storedMessages)
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      if (!dialog.open) dialog.showModal()
      const frame = window.requestAnimationFrame(() =>
        dialog.querySelector<HTMLElement>(email ? "textarea" : 'input[type="email"]')?.focus(),
      )
      return () => window.cancelAnimationFrame(frame)
    }
    if (!open && dialog.open) dialog.close()
  }, [email, open])

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "end" })
  }, [messages, open, pending])

  useEffect(() => () => requestRef.current?.abort(), [])

  const submitEmail = (event: FormEvent) => {
    event.preventDefault()
    const normalized = emailDraft.trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
      setError("Enter a valid email address.")
      return
    }
    setEmail(normalized)
    setEmailDraft(normalized)
    setError("")
    try { localStorage.setItem(emailStorageKey, normalized) } catch { /* Session only. */ }
  }

  const submitQuestion = async (question = draft) => {
    const content = question.trim()
    if (!content || pending) return
    const userMessage: ProfileChatMessage = { id: crypto.randomUUID(), role: "user", content }
    const nextMessages = [...messages, userMessage].slice(-20)
    setMessages(nextMessages)
    saveMessages(nextMessages)
    setDraft("")
    setError("")
    setPending(true)
    const controller = new AbortController()
    requestRef.current = controller
    try {
      const answer = await askProfileChat(email, nextMessages, controller.signal)
      const answered = [...nextMessages, { id: crypto.randomUUID(), role: "assistant" as const, content: answer }].slice(-20)
      setMessages(answered)
      saveMessages(answered)
    } catch (reason) {
      if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "The chat is unavailable right now.")
    } finally {
      if (!controller.signal.aborted) setPending(false)
    }
  }

  const resetConversation = () => {
    requestRef.current?.abort()
    setPending(false)
    setError("")
    setMessages([welcomeMessage])
    saveMessages([welcomeMessage])
  }

  const changeEmail = () => {
    resetConversation()
    setEmail("")
    setEmailDraft("")
    try { localStorage.removeItem(emailStorageKey) } catch { /* Session only. */ }
  }

  return (
    <dialog
      ref={dialogRef}
      className="profile-chat"
      aria-labelledby="profile-chat-title"
      onCancel={(event) => { event.preventDefault(); onClose() }}
    >
      <header className="profile-chat-header">
        <button type="button" className="profile-chat-nav" onClick={onClose}>
          <ArrowLeft aria-hidden="true" />
          <span>Home</span>
        </button>
        {email ? (
          <button type="button" className="profile-chat-nav" onClick={resetConversation}>
            <RotateCcw aria-hidden="true" />
            <span>New chat</span>
          </button>
        ) : null}
      </header>

      {!email ? (
        <div className="profile-chat-gate">
          <img src={photo} width="208" height="208" alt="" className="profile-chat-avatar" />
          <div className="profile-chat-gate-copy">
            <p className="profile-chat-kicker">Ask Rafael’s AI</p>
            <h2 id="profile-chat-title">A quicker way to get the context.</h2>
            <p>Share your email, then ask about my work, process, services, or availability. It identifies this chat and won’t subscribe you to anything.</p>
          </div>
          <form className="profile-chat-email-form" onSubmit={submitEmail} noValidate>
            <label htmlFor={inputId}>Your email</label>
            <div className="profile-chat-email-control">
              <input
                id={inputId}
                type="email"
                autoComplete="email"
                inputMode="email"
                value={emailDraft}
                onChange={(event) => setEmailDraft(event.target.value)}
                placeholder="you@company.com"
              />
              <button type="submit">Start chatting</button>
            </div>
            <p className="profile-chat-form-error" aria-live="polite">{error}</p>
          </form>
        </div>
      ) : (
        <div className="profile-chat-conversation">
          <div className="profile-chat-intro">
            <img src={photo} width="208" height="208" alt="" className="profile-chat-avatar" />
            <div>
              <p className="profile-chat-kicker">Ask about</p>
              <h2 id="profile-chat-title">{name}</h2>
            </div>
          </div>
          <div className="profile-chat-messages" aria-live="polite" aria-busy={pending}>
            {messages.map((message) => (
              <div key={message.id} className="profile-chat-message" data-role={message.role}>
                <p>{message.content}</p>
              </div>
            ))}
            {messages.length === 1 ? (
              <div className="profile-chat-suggestions" aria-label="Suggested questions">
                {suggestions.map((suggestion) => (
                  <button type="button" key={suggestion} onClick={() => void submitQuestion(suggestion)}>{suggestion}</button>
                ))}
              </div>
            ) : null}
            {pending ? <p className="profile-chat-thinking">Thinking<span aria-hidden="true">…</span></p> : null}
            <div ref={endRef} />
          </div>
          <form className="profile-chat-composer" onSubmit={(event) => { event.preventDefault(); void submitQuestion() }}>
            <div className="profile-chat-composer-control">
              <label className="sr-only" htmlFor={`${inputId}-question`}>Ask about Rafael</label>
              <textarea
                id={`${inputId}-question`}
                rows={1}
                maxLength={800}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    void submitQuestion()
                  }
                }}
                placeholder="Ask about Rafael…"
              />
              <button type="submit" aria-label="Send question" disabled={!draft.trim() || pending}>
                <ArrowUp aria-hidden="true" />
              </button>
            </div>
            <div className="profile-chat-composer-meta">
              <p className="profile-chat-form-error" aria-live="polite">{error}</p>
              <div className="profile-chat-secondary-actions">
                <button type="button" onClick={changeEmail}>Change email</button>
                <a href={`mailto:${links.email}`}>Prefer email?</a>
              </div>
            </div>
          </form>
        </div>
      )}
    </dialog>
  )
}
