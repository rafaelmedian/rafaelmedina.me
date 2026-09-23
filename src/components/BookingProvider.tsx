import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react"
import { BookingContext } from "../lib/bookingContext"
import { beginDialogIntent, subscribeDialogIntent } from "../lib/dialogIntent"
import { trackEvent } from "../lib/analytics"
import { siteLinks } from "../data/portfolio"

const BookingDialog = lazy(() => import("./BookingDialog").then(module => ({ default: module.BookingDialog })))

/** One session across the portrait, hero pill, and inline booking links. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingUrl, setBookingUrl] = useState(siteLinks.booking)
  const [calendarEntry, setCalendarEntry] = useState<{ email: string } | null>(null)
  const [open, setOpen] = useState(false)
  const [portraitOrigin, setPortraitOrigin] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const [hasOpened, setHasOpened] = useState(false)
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
    setCalendarEntry(calendarEmail ? { email: calendarEmail } : null)
    setBookingUrl(url)
    setHasOpened(true)
    setOpen(true)
    trackEvent("booking_open", { booking_open_trigger: placement })
  } }}>
    {children}
    {hasOpened && <Suspense fallback={null}>
      <BookingDialog bookingUrl={bookingUrl} calendarEntry={calendarEntry} portraitOrigin={portraitOrigin} open={open} onOpenChange={setOpen} returnFocus={returnFocus} />
    </Suspense>}
  </BookingContext.Provider>
}
