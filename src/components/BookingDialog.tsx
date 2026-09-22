import { Dialog } from "@base-ui/react/dialog"
import { ArrowLeft, ArrowUp, CalendarDays } from "lucide-react"
import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type RefObject } from "react"
import { siteProfile } from "../data/portfolio"
import { isContactEmail } from "../lib/contactEmail"
import { ignorePasswordManagers } from "../lib/passwordManagers"
import { sendContact, type ContactMessage } from "../lib/sendContact"
import { BookingCalendar } from "./BookingCalendar"

type Delivery = ContactMessage & { status: "sending" | "delivered" | "failed"; error?: string }

type BookingDialogProps = {
  bookingUrl: string
  open: boolean
  onOpenChange: (open: boolean) => void
  returnFocus: RefObject<HTMLButtonElement | null>
}

export function BookingDialog({ bookingUrl, open, onOpenChange, returnFocus }: BookingDialogProps) {
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

  useEffect(() => {
    if (open && !calendar) historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight })
  }, [outbox, confirmedEmail, calendar, open])

  useLayoutEffect(() => {
    const field = messageRef.current
    if (!field || calendar || !open) return
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
    if (!message.trim() || !confirmedEmail || sending || atLimit) return
    const item = { email: confirmedEmail, message: message.trim(), requestId: crypto.randomUUID() }
    setOutbox(list => [...list, { ...item, status: "sending" }])
    setMessage("")
    void deliver(item)
  }

  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Backdrop className="booking-backdrop" />
      <div className="booking-shell">
        <Dialog.Popup className="booking-popup" data-calendar={calendar} ref={popupRef}
          initialFocus={popupRef} finalFocus={returnFocus}>
          <Dialog.Title className="sr-only">Chat with Rafael Medina</Dialog.Title>
          <Dialog.Description className="sr-only">Send Rafael a message, then choose a time for a 30-minute call.</Dialog.Description>
          {calendar && <button ref={backRef} type="button" className="booking-icon-button booking-back"
            aria-label="Back to conversation" onClick={() => {
              popupRef.current?.focus({ preventScroll: true })
              setCalendar(false)
              requestAnimationFrame(() => bookRef.current?.focus({ preventScroll: true }))
            }}><ArrowLeft size={20} /></button>}
          <header className="booking-identity">
            <img src={siteProfile.photo} width="64" height="64" alt="" />
            <span className="booking-name-tag">{siteProfile.name}</span>
          </header>
          <section className="booking-conversation" hidden={calendar} aria-label="Conversation with Rafael">
            <div className="booking-history" ref={historyRef} role="log" aria-label="Conversation" aria-live={open && !calendar ? "polite" : "off"}>
              <div className="booking-bubble">Hey, I’m Rafa.</div>
              <div className="booking-bubble">Have something in mind?</div>
              <div className="booking-bubble">Leave your email so I can get back to you.</div>
              {confirmedEmail && <>
                <div className="booking-email-confirmation">
                  <div className="booking-bubble booking-outgoing">{confirmedEmail}</div>
                  <button className="booking-change-email" type="button" disabled={sending} onClick={() => {
                    popupRef.current?.focus({ preventScroll: true })
                    setConfirmedEmail("")
                    requestAnimationFrame(() => popupRef.current?.querySelector<HTMLInputElement>('input[type="email"]')?.focus())
                  }}>Change email</button>
                </div>
                <div className="booking-bubble">Tell me a little about it. Or let’s find a time to talk.</div>
              </>}
              {outbox.map(item => <div className="booking-delivery" key={item.requestId}>
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
            </form> : <div className="booking-compose-area">
              <form onSubmit={send}>
                <div className="booking-composer">
                  <textarea ref={messageRef} aria-label="Your message" aria-describedby={atLimit ? hintId : undefined} rows={1} maxLength={2000}
                    {...ignorePasswordManagers} placeholder="Tell me a little about it…" value={message}
                    onChange={event => setMessage(event.target.value)} disabled={atLimit} />
                  <button className="booking-send" type="submit" aria-label="Send message" disabled={!message.trim() || sending || atLimit}><ArrowUp size={24} /></button>
                </div>
                {atLimit && <p className="sr-only" id={hintId} role="status">Message limit reached. You can still book a time.</p>}
              </form>
              <button ref={bookRef} className="booking-time-button" type="button" aria-label="Book a time" onClick={() => {
                popupRef.current?.focus({ preventScroll: true })
                setCalendarEmail(confirmedEmail)
                setCalendar(true)
                requestAnimationFrame(() => backRef.current?.focus({ preventScroll: true }))
              }}><CalendarDays size={18} aria-hidden="true" />Book a time<span>30 min</span></button>
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
