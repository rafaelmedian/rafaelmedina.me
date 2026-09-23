import { Menu } from "@base-ui/react/menu"
import { Dialog } from "@base-ui/react/dialog"
import { ArrowLeft, ArrowUp, Calendar, Mic, Square, X } from "lucide-react"
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type RefObject } from "react"
import { siteProfile } from "../data/portfolio"
import { isContactEmail } from "../lib/contactEmail"
import { ignorePasswordManagers } from "../lib/passwordManagers"
import { sendContact, type ContactMessage } from "../lib/sendContact"
import { useMessageDictation } from "../lib/useMessageDictation"
import { BookingCalendar } from "./BookingCalendar"
import { BookingContactPanel } from "./BookingContactPanel"

type Delivery = ContactMessage & { status: "sending" | "delivered" | "failed"; error?: string }

type BookingDialogProps = {
  bookingUrl: string
  portraitOrigin: { left: number; top: number; width: number; height: number } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  returnFocus: RefObject<HTMLButtonElement | null>
}

export function BookingDialog({ bookingUrl, portraitOrigin, open, onOpenChange, returnFocus }: BookingDialogProps) {
  const [email, setEmail] = useState("")
  const [confirmedEmail, setConfirmedEmail] = useState("")
  const [message, setMessage] = useState("")
  const [outbox, setOutbox] = useState<Delivery[]>([])
  const [calendar, setCalendar] = useState(false)
  const [calendarEmail, setCalendarEmail] = useState<string | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const bookRef = useRef<HTMLButtonElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)
  const hintId = useId()
  const sending = outbox.some(item => item.status === "sending")
  const atLimit = outbox.length >= 5
  const dictation = useMessageDictation(open && !calendar && !!confirmedEmail && !atLimit, setMessage)
  const [entrance, setEntrance] = useState({ open, keys: ["hello", "catch-up", "email-prompt"] })
  if (entrance.open !== open) {
    setEntrance({ open, keys: [
      "hello", "catch-up", "email-prompt",
      ...(confirmedEmail ? ["address", "message-prompt"] : []),
      ...outbox.map(item => item.requestId),
    ] })
  }
  const entryStyle = (key: string, newDelay = 0) => {
    const order = entrance.keys.indexOf(key)
    return { animationDelay: `${order < 0 ? newDelay : 200 + order * 160}ms` }
  }


  const portraitRef = useCallback((node: HTMLImageElement | null) => {
    if (!node || !open || !portraitOrigin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const target = node.getBoundingClientRect()
    const style = getComputedStyle(node)
    const animation = node.animate([
      { transform: `translate(${portraitOrigin.left - target.left}px, ${portraitOrigin.top - target.top}px) scale(${portraitOrigin.width / target.width}, ${portraitOrigin.height / target.height})` },
      { transform: "translate(0, 0) scale(1)" },
    ], {
      duration: parseFloat(style.getPropertyValue("--duration-slow")),
      easing: style.getPropertyValue("--ease-smooth").trim(),
    })
    return () => animation.cancel()
  }, [open, portraitOrigin])


  useEffect(() => {
    if (open && !calendar) historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight })
  }, [outbox, confirmedEmail, calendar, open])

  useLayoutEffect(() => {
    const field = messageRef.current
    if (!field || !open || !field.getClientRects().length) return
    const fit = () => {
      field.style.height = "auto"
      field.style.height = `${field.scrollHeight}px`
    }
    fit()
    window.addEventListener("resize", fit)
    return () => window.removeEventListener("resize", fit)
  }, [message, confirmedEmail, calendar, open])

  const confirmEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isContactEmail(email)) return
    // Move focus before removing the active field so the dialog does not
    // schedule its own fallback focus after our next-step handoff.
    popupRef.current?.focus({ preventScroll: true })
    setConfirmedEmail(email.trim())
    requestAnimationFrame(() => messageRef.current?.focus({ preventScroll: true }))
  }
  const deliver = async (item: ContactMessage) => {
    const update = (change: Partial<Delivery>) => setOutbox(list => list.map(entry =>
      entry.requestId === item.requestId ? { ...entry, ...change } : entry))
    update({ status: "sending", error: undefined })
    try {
      await sendContact(item)
      update({ status: "delivered" })
    } catch (error) {
      update({ status: "failed", error: error instanceof Error ? error.message : "Couldn't send. Please retry." })
    }
  }
  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim() || !confirmedEmail || sending || atLimit || dictation.listening) return
    const item = { email: confirmedEmail, message: message.trim(), requestId: crypto.randomUUID() }
    setOutbox(list => [...list, { ...item, status: "sending" }])
    setMessage("")
    void deliver(item)
  }

  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Backdrop className="booking-backdrop" />
      <div className="booking-shell">
        <Dialog.Popup className="booking-popup" data-calendar={calendar} data-conversation-open={open} ref={popupRef}
          initialFocus={popupRef} finalFocus={returnFocus}>
          <Dialog.Close className="booking-icon-button booking-close" aria-label="Close conversation">
            <X size={20} aria-hidden="true" />
          </Dialog.Close>
          <Dialog.Title className="sr-only">Chat with Rafael Medina</Dialog.Title>
          <Dialog.Description className="sr-only">Send Rafael a message, then choose a time for a 30-minute call.</Dialog.Description>
          {calendar && <button ref={backRef} type="button" className="booking-icon-button booking-back"
            aria-label="Back to conversation" onClick={() => {
              popupRef.current?.focus({ preventScroll: true })
              setCalendar(false)
              requestAnimationFrame(() => bookRef.current?.focus({ preventScroll: true }))
            }}><ArrowLeft size={20} /></button>}
          <header className="booking-identity">
            <img ref={portraitRef} src={siteProfile.photo} width="52" height="52" alt="" />
            <BookingContactPanel />
          </header>
          <section className="booking-conversation" aria-label="Conversation with Rafael">
            <div className="booking-history" ref={historyRef} role="log" aria-label="Conversation" aria-live={open ? "polite" : "off"}>
              <div className="booking-bubble" style={entryStyle("hello")}>Hey, I’m Rafa.</div>
              <div className="booking-bubble" style={entryStyle("catch-up")}>we should catch up properly</div>
              <div className="booking-bubble" style={entryStyle("email-prompt")}>where should i email you?</div>
              {confirmedEmail && <>
                <div className="booking-email-confirmation" style={entryStyle("address")}>
                  <Menu.Root modal={false}>
                    <Menu.Trigger className="booking-bubble booking-outgoing booking-email-trigger" disabled={sending}
                      aria-label={`Email options for ${confirmedEmail}`}>{confirmedEmail}</Menu.Trigger>
                    <Menu.Portal>
                      <Menu.Positioner className="booking-email-menu-positioner" positionMethod="fixed" side="bottom" align="end" sideOffset={8} collisionPadding={12}>
                        <Menu.Popup className="booking-email-menu" aria-label="Email options"
                          finalFocus={() => popupRef.current?.querySelector<HTMLInputElement>('input[type="email"]') ?? true}>
                          <Menu.Item className="booking-email-menu-item" onClick={() => {
                            popupRef.current?.focus({ preventScroll: true })
                            setCalendar(false)
                            setConfirmedEmail("")
                            requestAnimationFrame(() => popupRef.current?.querySelector<HTMLInputElement>('input[type="email"]')?.focus())
                          }}>Unsend</Menu.Item>
                        </Menu.Popup>
                      </Menu.Positioner>
                    </Menu.Portal>
                  </Menu.Root>
                </div>
                <div className="booking-bubble" style={entryStyle("message-prompt", 80)}>Tell me a little about it. Or let’s find a time to talk.</div>
              </>}
              {outbox.map(item => <div className="booking-delivery" key={item.requestId} style={entryStyle(item.requestId)}>
                <p className="booking-bubble booking-outgoing">{item.message}</p>
                {item.status === "failed" ? <div className="booking-receipt" role="alert">
                  {item.error} <button type="button" onClick={() => void deliver({ email: item.email, message: item.message, requestId: item.requestId })}
                    disabled={sending}>Retry message</button>
                </div> : <p className="booking-receipt" role="status">{item.status === "sending" ? "Sending…" : "Delivered"}</p>}
              </div>)}
            </div>
            {!confirmedEmail ? <form className="booking-compose-area" onSubmit={confirmEmail}>
              <label className="sr-only" htmlFor={`${hintId}-email`}>Your email</label>
              <div className="booking-composer">
                <input id={`${hintId}-email`} type="email" autoComplete="email" required maxLength={254}
                  {...ignorePasswordManagers} placeholder="Your email address" value={email}
                  onChange={event => setEmail(event.target.value)} aria-describedby={hintId} />
                <button className="booking-send" type="submit" aria-label="Continue with email" disabled={!isContactEmail(email)}><ArrowUp size={24} /></button>
              </div>
              <p className="booking-hint" id={hintId}>Just for our conversation. No mailing list.</p>
            </form> : <div className="booking-compose-area booking-compose-row">
              <button ref={bookRef} className="booking-time-button" type="button" aria-label="Book a time" title="Book a time · 30 min" onClick={() => {
                popupRef.current?.focus({ preventScroll: true })
                setCalendarEmail(confirmedEmail)
                setCalendar(true)
                requestAnimationFrame(() => backRef.current?.focus({ preventScroll: true }))
              }}><Calendar size={20} strokeWidth={1.75} aria-hidden="true" /></button>
              <form onSubmit={send}>
                <div className="booking-composer">
                  <textarea ref={messageRef} aria-label="Your message" aria-describedby={atLimit ? hintId : dictation.status ? `${hintId}-dictation` : undefined} rows={1} maxLength={2000}
                    {...ignorePasswordManagers} placeholder="Tell me a little about it…" value={message}
                    onChange={event => setMessage(event.target.value)} disabled={atLimit} readOnly={dictation.listening} />
                  {message.trim() && !dictation.listening ? <button className="booking-send" type="submit" aria-label="Send message" disabled={sending || atLimit}><ArrowUp size={24} /></button>
                    : <button className="booking-microphone" type="button" disabled={sending || atLimit}
                      aria-label={dictation.listening ? "Stop dictation" : "Dictate message"} aria-pressed={dictation.listening}
                      onClick={event => {
                        event.preventDefault()
                        if (dictation.listening) {
                          dictation.stop()
                          messageRef.current?.focus({ preventScroll: true })
                        } else dictation.start()
                      }}>{dictation.listening ? <Square size={18} fill="currentColor" aria-hidden="true" /> : <Mic size={24} strokeWidth={1.75} aria-hidden="true" />}</button>}
                </div>
                {dictation.status && <p className="booking-dictation-status" id={`${hintId}-dictation`} role="status">{dictation.status}</p>}
                {atLimit && <p className="sr-only" id={hintId} role="status">Message limit reached. You can still book a time.</p>}
              </form>

            </div>}
          </section>
          {calendarEmail !== null && <section className="booking-calendar-stage" hidden={!calendar} aria-label="Choose a time">
            <BookingCalendar key={calendarEmail} bookingUrl={bookingUrl} email={calendarEmail} active={open && calendar} />
          </section>}
        </Dialog.Popup>
      </div>
    </Dialog.Portal>
  </Dialog.Root>
}
