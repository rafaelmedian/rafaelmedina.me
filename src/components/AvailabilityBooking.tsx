import { Tooltip } from "@base-ui/react/tooltip"
import { lazy, Suspense, useId, useRef, useState } from "react"

import { trackEvent } from "../lib/analytics"

const BookingDialog = lazy(() =>
  import("./BookingDialog").then((module) => ({ default: module.BookingDialog })),
)

type AvailabilityBookingProps = {
  label: string
  bookingUrl: string
}

export function AvailabilityBooking({ label, bookingUrl }: AvailabilityBookingProps) {
  const hintId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  return (
    <>
      <Tooltip.Root disabled={isOpen}>
        <Tooltip.Trigger
          ref={triggerRef}
          delay={260}
          closeDelay={120}
          className="mosaic-contact-pill mosaic-contact-pill-dark mosaic-booking-pill"
          aria-label={`Book a call — ${label}`}
          aria-describedby={isOpen ? undefined : hintId}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => {
            setHasOpened(true)
            setIsOpen(true)
            trackEvent("booking_open", { booking_open_trigger: "press" })
          }}
        >
          <span className="mosaic-contact-pill-content">
            <span className="mosaic-availability-dot" aria-hidden="true" />
            <span className="mosaic-contact-pill-dark-label">Book a call</span>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="bottom" align="center" sideOffset={12} collisionPadding={16} className="booking-hint-positioner">
            <Tooltip.Popup className="booking-hint" role="tooltip" id={hintId}>
              {label} · 30 minutes in my calendar
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
