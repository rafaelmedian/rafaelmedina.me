import { useEffect, useRef, useState, type ReactNode } from "react"
import { BookingContext } from "../lib/bookingContext"
import { beginDialogIntent, subscribeDialogIntent } from "../lib/dialogIntent"
import { trackEvent } from "../lib/analytics"
import { siteLinks } from "../data/portfolio"
import { createModuleLoader, useDeferredModule } from "../lib/deferredModule"

const loadBooking = createModuleLoader(() => import("./BookingDialog"), "BookingDialog")

/** One session across the portrait, hero pill, and inline booking links. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingUrl, setBookingUrl] = useState(siteLinks.booking)
  const [calendarEntry, setCalendarEntry] = useState<{ email: string } | null>(null)
  const [open, setOpen] = useState(false)
  const [portraitOrigin, setPortraitOrigin] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const { module, status, load } = useDeferredModule(loadBooking)
  const BookingDialog = module?.BookingDialog
  const returnFocus = useRef<HTMLButtonElement | null>(null)
  useEffect(() => subscribeDialogIntent(destination => {
    if (destination !== "booking") setOpen(false)
  }), [])
  return <BookingContext.Provider value={{ open, openBooking: (trigger, placement, url = siteLinks.booking, calendarEmail) => {
    const portrait = document.querySelector<HTMLElement>(".mosaic-avatar-button")
    const bounds = portrait?.getBoundingClientRect()
    setPortraitOrigin(bounds && bounds.width > 0 && bounds.bottom > 0 && bounds.top < window.innerHeight
      ? { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height } : null)
    beginDialogIntent("booking")
    returnFocus.current = trigger
    setCalendarEntry(calendarEmail !== undefined ? { email: calendarEmail } : null)
    setBookingUrl(url)
    setOpen(true)
    if (!BookingDialog) void load()
    trackEvent("booking_open", { booking_open_trigger: placement })
  } }}>
    {children}
    {BookingDialog ? <BookingDialog bookingUrl={bookingUrl} calendarEntry={calendarEntry} portraitOrigin={portraitOrigin} open={open} onOpenChange={setOpen} returnFocus={returnFocus} /> : open && (
      status === "error" || status === "reload" ? <div className="booking-load-status" role="alert">
        <p>Couldn’t open the conversation.</p>
        <button type="button" className="booking-external" onClick={() => void load()}>
          {status === "reload" ? "Reload to try the conversation again" : "Try opening the conversation again"}
        </button>{" · "}
        <a className="booking-external" href={bookingUrl} target="_blank" rel="noreferrer">Open it on cal.com</a>{" · "}
        <button type="button" className="booking-external" onClick={() => {
          setOpen(false)
          returnFocus.current?.focus({ preventScroll: true })
        }}>Dismiss</button>
      </div> : <p className="sr-only" role="status">Opening conversation…</p>
    )}
  </BookingContext.Provider>
}
