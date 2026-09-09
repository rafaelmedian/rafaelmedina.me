import { beginDialogIntent } from "../lib/dialogIntent"
import { lazy, Suspense, useRef, useState, type ReactNode } from "react"

import { trackEvent } from "../lib/analytics"
import { formatAvailability } from "../lib/availability"

const BookingDialog = lazy(() =>
  import("./BookingDialog").then((module) => ({ default: module.BookingDialog })),
)

type InlineBookingLinkProps = {
  bookingUrl: string
  /** Where this trigger sits, for the analytics event. */
  placement: string
  className?: string
  children: ReactNode
}

/** The availability line in the hero opens the Cal.com calendar from a pill
    with its own month preview. This is the same calendar reached from a run of
    prose: a button that is set as a link, so a sentence can end in it. */
export function InlineBookingLink({ bookingUrl, placement, className, children }: InlineBookingLinkProps) {
  const [isOpen, setIsOpen] = useState(false)
  // Kept mounted after the first open so Base UI can run the close transition.
  const [hasOpened, setHasOpened] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={className}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          beginDialogIntent("booking")
          setHasOpened(true)
          setIsOpen(true)
          trackEvent("booking_open", { booking_open_trigger: placement })
        }}
      >
        {children}
      </button>
      {hasOpened ? (
        <Suspense fallback={null}>
          <BookingDialog
            bookingUrl={bookingUrl}
            // Read when the calendar is opened rather than held as a prop: the
            // hero's copy of this line ticks with the clock, and passing it
            // down would re-render the whole About sheet -- and the photo
            // carousel inside it -- once a minute for a string nothing on
            // screen is showing.
            availabilityLabel={formatAvailability()}
            open={isOpen}
            onOpenChange={setIsOpen}
            returnFocus={triggerRef}
          />
        </Suspense>
      ) : null}
    </>
  )
}
