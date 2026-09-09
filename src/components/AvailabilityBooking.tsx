import { Tooltip } from "@base-ui/react/tooltip"
import { ArrowUpRight, Clock3 } from "lucide-react"
import { lazy, Suspense, useId, useRef, useState } from "react"

import { trackEvent } from "../lib/analytics"
import { getAvailabilityMonth } from "../lib/availability"

const BookingDialog = lazy(() =>
  import("./BookingDialog").then((module) => ({ default: module.BookingDialog })),
)

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
const weekdays = ["M", "T", "W", "T", "F", "S", "S"]

type AvailabilityBookingProps = {
  label: string
  bookingUrl: string
}

export function AvailabilityBooking({ label, bookingUrl }: AvailabilityBookingProps) {
  const previewId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const month = getAvailabilityMonth()
  const offset = (month.getUTCDay() + 6) % 7
  const days = new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0)).getUTCDate()

  return (
    <>
      <Tooltip.Root disabled={isOpen}>
        <Tooltip.Trigger
          ref={triggerRef}
          delay={260}
          closeDelay={120}
          className="mosaic-profile-availability mosaic-availability-trigger"
          aria-label={`${label} — book a call`}
          aria-describedby={isOpen ? undefined : previewId}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => {
            setHasOpened(true)
            setIsOpen(true)
            trackEvent("booking_open", { booking_open_trigger: "press" })
          }}
        >
          <span className="mosaic-availability-label">{label}</span>
          <span className="mosaic-availability-dot" aria-hidden="true" />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="bottom" align="center" sideOffset={12} collisionPadding={16} className="booking-preview-positioner">
            <Tooltip.Popup className="booking-preview" role="tooltip" id={previewId}>
              <div className="booking-preview-heading">
                <span>{monthFormatter.format(month)}</span>
                <span className="booking-preview-duration"><Clock3 size={12} aria-hidden="true" />30 min</span>
              </div>
              <div className="booking-preview-grid" aria-hidden="true">
                {weekdays.map((day, index) => <span className="booking-preview-weekday" key={`weekday-${index}`}>{day}</span>)}
                {Array.from({ length: offset }, (_, index) => <span key={`blank-${index}`} />)}
                {Array.from({ length: days }, (_, index) => <span className="booking-preview-day" key={index}>{index + 1}</span>)}
              </div>
              <p className="booking-preview-note">Choose a time on Cal.com</p>
              <div className="booking-preview-footer">Click to book a call<ArrowUpRight size={14} aria-hidden="true" /></div>
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      {hasOpened ? (
        <Suspense fallback={null}>
          <BookingDialog
            bookingUrl={bookingUrl}
            availabilityLabel={label}
            open={isOpen}
            onOpenChange={setIsOpen}
            returnFocus={triggerRef}
          />
        </Suspense>
      ) : null}
    </>
  )
}
