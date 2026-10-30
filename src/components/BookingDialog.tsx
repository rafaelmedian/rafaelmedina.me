import "../styles/booking.css"
import { Menu } from "@base-ui/react/menu"
import { Dialog } from "@base-ui/react/dialog"
import { PanelRightClose, ArrowUp, Calendar, Mic, Square, X } from "lucide-react"
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent, type RefObject } from "react"
import { siteProfile } from "../data/portfolio"
import { isContactEmail } from "../lib/contactEmail"
import { ignorePasswordManagers } from "../lib/passwordManagers"
import { contactMailto, sendContact, type ContactMessage } from "../lib/sendContact"
import { useMessageDictation } from "../lib/useMessageDictation"
import { BookingCalendar } from "./BookingCalendar"
import { BookingContactPanel } from "./BookingContactPanel"
import { CalendarThumbnail } from "./CalendarThumbnail"

type Delivery = ContactMessage & { status: "sending" | "delivered" | "failed"; error?: string }

type BookingDialogProps = {
  bookingUrl: string
  calendarEntry?: { email: string } | null
  portraitOrigin: { left: number; top: number; width: number; height: number } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  returnFocus: RefObject<HTMLButtonElement | null>
}

export function BookingDialog({ bookingUrl, calendarEntry, portraitOrigin, open, onOpenChange, returnFocus }: BookingDialogProps) {
  const [email, setEmail] = useState("")
  const [confirmedEmail, setConfirmedEmail] = useState("")
  const [message, setMessage] = useState("")
  const [outbox, setOutbox] = useState<Delivery[]>([])
  const [calendar, setCalendar] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [calendarEmail, setCalendarEmail] = useState<string | null>(null)
  const [appliedCalendarEntry, setAppliedCalendarEntry] = useState<typeof calendarEntry>(null)
  if (calendarEntry !== appliedCalendarEntry) {
    setAppliedCalendarEntry(calendarEntry)
    if (calendarEntry) {
      setEmail(calendarEntry.email)
      setConfirmedEmail(calendarEntry.email)
      setCalendarEmail(calendarEntry.email)
      setCalendar(true)
      setContactOpen(false)
    }
  }
  const popupRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  const bookRef = useRef<HTMLButtonElement>(null)
  const calLinkRef = useRef<HTMLAnchorElement>(null)
  const calendarOpenerRef = useRef<"link" | "button">("button")
  const historyRef = useRef<HTMLDivElement>(null)
  const hintId = useId()
  const sending = outbox.some(item => item.status === "sending")
  const atLimit = outbox.length >= 5
  const dictation = useMessageDictation(open && !calendar && !!confirmedEmail && !atLimit, setMessage)
  const [entrance, setEntrance] = useState({ open, keys: ["hello", "catch-up", "email-prompt", "cal-note", "cal-link"] })
  if (entrance.open !== open) {
    setEntrance({ open, keys: [
      "hello", "catch-up", "email-prompt", "cal-note", "cal-link",
      ...(confirmedEmail ? ["address", "message-prompt"] : []),
      ...outbox.map(item => item.requestId),
    ] })
  }
  // The five greeting bubbles keep a conversational 160ms beat. A reopen
  // replays everything saved after them on a 40ms step instead, so five sent
  // messages land in 200ms rather than 800ms, and the composer arrives with the
  // last of them instead of at a fixed 680ms that put it mid-replay.
  const entranceDelay = (order: number) => order < 5 ? 200 + order * 160 : 840 + (order - 4) * 40
  const entryStyle = (key: string, newDelay = 0) => {
    const order = entrance.keys.indexOf(key)
    return { animationDelay: `${order < 0 ? newDelay : entranceDelay(order)}ms` }
  }
  const composeStyle = {
    "--booking-compose-delay": `${entranceDelay(entrance.keys.length - 1) + 160}ms`,
  } as CSSProperties


  const openCalendar = (email: string, from: "link" | "button") => {
    popupRef.current?.focus({ preventScroll: true })
    setContactOpen(false)
    setCalendarEmail(email)
    setCalendar(true)
    calendarOpenerRef.current = from
    requestAnimationFrame(() => backRef.current?.focus({ preventScroll: true }))
  }

  const composerRef = useCallback((node: HTMLElement | null) => {
    if (!node) return
    const shell = node.closest<HTMLElement>(".booking-shell")
    const measure = () => {
      if (node.offsetHeight) shell?.style.setProperty("--booking-compose-height", `${node.offsetHeight}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => {
      observer.disconnect()
      shell?.style.removeProperty("--booking-compose-height")
    }
  }, [])

  // The hero's face moves into the header rather than a second one fading in
  // over it. The popup fades, so the face that travels is a copy outside it,
  // and both ends stay hidden until it lands. Closing flies it back home.
  const heroFaceRef = useRef<HTMLElement | null>(null)
  const portraitRef = useCallback((node: HTMLImageElement | null) => {
    if (!node) return
    if (!open) {
      const hero = heroFaceRef.current
      heroFaceRef.current = null
      if (!hero) return
      const home = hero.closest(".mosaic-avatar-button")?.getBoundingClientRect()
      // A reopen mid-flight cancels this and claims the hero again before
      // the rejection lands, so only a face nobody has claimed comes back.
      const land = () => { if (!heroFaceRef.current) hero.style.visibility = "" }
      if (!home || home.width === 0) return land()
      node.style.visibility = "hidden"
      flyPortrait(node, node.getBoundingClientRect(), home, "--duration-base").finished.then(land, land)
      // No cleanup: the popup unmounts before the face is home.
      return
    }
    if (!portraitOrigin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const hero = document.querySelector<HTMLElement>(".mosaic-avatar-coin-inner")
    if (!hero) return
    const flight = flyPortrait(node, portraitOrigin, node.getBoundingClientRect(), "--duration-slow")
    heroFaceRef.current = hero
    hero.style.visibility = "hidden"
    node.style.visibility = "hidden"
    const arrive = () => { node.style.visibility = "" }
    flight.finished.then(arrive, () => {})
    return () => {
      flight.cancel()
      arrive()
    }
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
              const opener = calendarOpenerRef.current === "link" ? calLinkRef.current : bookRef.current
              requestAnimationFrame(() => (opener ?? calLinkRef.current)?.focus({ preventScroll: true }))
            }}><PanelRightClose size={20} /></button>}
          <header className="booking-identity">
            <img ref={portraitRef} src={siteProfile.photo} width="52" height="52" alt="" />
            <BookingContactPanel open={contactOpen} onOpenChange={next => {
              if (next) setCalendar(false)
              setContactOpen(next)
            }} calendarFocus={calendar ? backRef : undefined} />
          </header>
          <section className="booking-conversation" aria-label="Conversation with Rafael">
            <div className="booking-history" ref={historyRef} style={{ "--booking-avatar": `url("${siteProfile.photo}")` } as CSSProperties} role="log" aria-label="Conversation" aria-live={open ? "polite" : "off"}>
              <div className="booking-bubble" style={entryStyle("hello")}>Hey, what’s up?</div>
              <div className="booking-bubble" style={entryStyle("catch-up")}>we should chat properly</div>
              <div className="booking-bubble" style={entryStyle("email-prompt")}>where should i email you?</div>
              <div className="booking-bubble" style={entryStyle("cal-note")}>or just grab a time</div>
              <a ref={calLinkRef} className="booking-bubble booking-link-preview" href={bookingUrl} style={entryStyle("cal-link")}
                onClick={event => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
                  event.preventDefault()
                  openCalendar(confirmedEmail, "link")
                }}>
                <CalendarThumbnail />
                <span className="booking-link-preview-caption">
                  <span className="booking-link-preview-title">30-min call with Rafael</span>
                  <span className="booking-link-preview-domain">cal.com</span>
                </span>
              </a>
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
                    disabled={sending}>Retry message</button> or <a href={contactMailto(item.message)}>email it instead</a>
                </div> : <p className="booking-receipt" role="status">{item.status === "sending" ? "Sending…" : "Delivered"}</p>}
              </div>)}
            </div>
            {!confirmedEmail ? <form ref={composerRef} className="booking-compose-area" style={composeStyle} onSubmit={confirmEmail}>
              <label className="sr-only" htmlFor={`${hintId}-email`}>Your email</label>
              <div className="booking-composer">
                <input id={`${hintId}-email`} type="email" autoComplete="email" required maxLength={254}
                  {...ignorePasswordManagers} placeholder="you@example.com" value={email}
                  onChange={event => setEmail(event.target.value)} aria-describedby={hintId} />
                <button className="booking-send" type="submit" aria-label="Continue with email" disabled={!isContactEmail(email)}><ArrowUp size={24} /></button>
              </div>
              <p className="booking-hint" id={hintId}>Just for our conversation. No mailing list.</p>
            </form> : <div ref={composerRef} className="booking-compose-area booking-compose-row" style={composeStyle}>
              <button ref={bookRef} className="booking-time-button" type="button" aria-label="Book a time" title="Book a time · 30 min" onClick={() => openCalendar(confirmedEmail, "button")}><Calendar size={20} strokeWidth={1.75} aria-hidden="true" /></button>
              <form onSubmit={send}>
                <div className="booking-composer">
                  <textarea ref={messageRef} aria-label="Your message" aria-describedby={atLimit ? hintId : dictation.status ? `${hintId}-dictation` : undefined} rows={1} maxLength={2000}
                    {...ignorePasswordManagers} placeholder={atLimit ? "Message limit reached" : "Tell me a little about it…"} value={message}
                    onChange={event => setMessage(event.target.value)} disabled={atLimit} readOnly={dictation.listening} />
                  {message.trim() && !dictation.listening ? <button className="booking-send" type="submit" aria-label="Send message" disabled={sending || atLimit}><ArrowUp size={24} /></button>
                    : <button className="booking-microphone" type="button" disabled={sending || atLimit || calendar}
                      aria-label="Dictate message" aria-pressed={dictation.listening}
                      onClick={event => {
                        event.preventDefault()
                        if (dictation.listening) {
                          dictation.stop()
                          messageRef.current?.focus({ preventScroll: true })
                        } else dictation.start()
                      }}>{dictation.listening ? <Square size={18} fill="currentColor" aria-hidden="true" /> : <Mic size={24} strokeWidth={1.75} aria-hidden="true" />}</button>}
                </div>
                {dictation.status && <p className="booking-dictation-status" id={`${hintId}-dictation`} role="status">{dictation.status}</p>}
                {/* Visible, as the About chat's is: a field that only went
                    grey, still asking to be told more, read as broken. */}
                {atLimit && <p className="booking-dictation-status" id={hintId} role="status">That’s five messages. You can still book a time with the calendar button.</p>}
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

type Box = { left: number; top: number; width: number; height: number }

let activeFlight: Animation | null = null

/** Flies a copy of `face` from one box to another above the dialog, then removes it. */
function flyPortrait(face: HTMLImageElement, from: Box, to: Box, duration: string) {
  activeFlight?.cancel()
  const style = getComputedStyle(face)
  const copy = document.createElement("img")
  copy.src = face.currentSrc || face.src
  copy.alt = ""
  copy.decoding = "sync"
  copy.className = "booking-portrait-flight"
  copy.setAttribute("aria-hidden", "true")
  Object.assign(copy.style, { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` })
  document.body.append(copy)
  const flight = copy.animate([
    { transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})` },
    { transform: "translate(0, 0) scale(1)" },
  ], {
    duration: parseFloat(style.getPropertyValue(duration)),
    easing: style.getPropertyValue("--ease-smooth").trim(),
  })
  activeFlight = flight
  const remove = () => {
    copy.remove()
    if (activeFlight === flight) activeFlight = null
  }
  flight.finished.then(remove, remove)
  return flight
}
