import type { ReactNode } from "react"
import { useBooking } from "../lib/bookingContext"

type InlineBookingLinkProps = {
  bookingUrl: string
  placement: string
  className?: string
  children: ReactNode
}

export function InlineBookingLink({ bookingUrl, placement, className, children }: InlineBookingLinkProps) {
  const { open, openBooking } = useBooking()
  return <button type="button" className={className} aria-haspopup="dialog" aria-expanded={open}
    onClick={event => openBooking(event.currentTarget, placement, bookingUrl)}>{children}</button>
}
