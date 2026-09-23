import { createContext, useContext } from "react"

export const BookingContext = createContext<{
  open: boolean
  openBooking: (trigger: HTMLButtonElement, placement: string, bookingUrl?: string, calendarEmail?: string) => void
} | null>(null)

export function useBooking() {
  const context = useContext(BookingContext)
  if (!context) throw new Error("Booking controls require BookingProvider")
  return context
}
