import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react"
import { BookingContext } from "../lib/bookingContext"
import { beginDialogIntent, subscribeDialogIntent } from "../lib/dialogIntent"
import { trackEvent } from "../lib/analytics"
import { siteLinks } from "../data/portfolio"

const BookingDialog = lazy(() => import("./BookingDialog").then(module => ({ default: module.BookingDialog })))

/** One session across the portrait, hero pill, and inline booking links. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookingUrl, setBookingUrl] = useState(siteLinks.booking)
  const [open, setOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const returnFocus = useRef<HTMLButtonElement | null>(null)
  useEffect(() => subscribeDialogIntent(destination => {
    if (destination !== "booking") setOpen(false)
  }), [])
  return <BookingContext.Provider value={{ open, openBooking: (trigger, placement, url = siteLinks.booking) => {
    beginDialogIntent("booking")
    returnFocus.current = trigger
    setBookingUrl(url)
    setHasOpened(true)
    setOpen(true)
    trackEvent("booking_open", { booking_open_trigger: placement })
  } }}>
    {children}
    {hasOpened && <Suspense fallback={null}>
      <BookingDialog bookingUrl={bookingUrl} open={open} onOpenChange={setOpen} returnFocus={returnFocus} />
    </Suspense>}
  </BookingContext.Provider>
}
