import { useBooking } from "../lib/bookingContext"
import { Tooltip } from "@base-ui/react/tooltip"
import { useId } from "react"

import { ReactionCard, type Reaction } from "./ReactionCard"

// Kermit on the phone, from a 1987 Christmas special by way of Giphy
// (yPhqlJccIOaru), transcoded the way the LinkedIn clip was: 10fps at 400px,
// which is 2x the card's display width. The whole loop is 1.7 seconds, so
// nothing needed trimming. Swap `src` and `still` for any pair in `public/` --
// the card takes its shape from `width`/`height`, so a differently proportioned
// clip needs nothing else changed.
const BOOKING_REACTION: Reaction = {
  src: "/reactions/booking-reaction.webp",
  still: "/reactions/booking-reaction-still.webp",
  width: 400,
  height: 300,
}

type AvailabilityBookingProps = {
  label: string
  bookingUrl: string
}

export function AvailabilityBooking({ label, bookingUrl }: AvailabilityBookingProps) {
  const hintId = useId()
  const { open: isOpen, openBooking } = useBooking()

  return (
    <>
      <Tooltip.Root disabled={isOpen}>
        <Tooltip.Trigger
          delay={0}
          closeDelay={120}
          className="mosaic-contact-pill mosaic-contact-pill-dark mosaic-booking-pill"
          aria-label={`Book a call — ${label}`}
          aria-describedby={isOpen ? undefined : hintId}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={event => openBooking(event.currentTarget, "press", bookingUrl)}
        >
          <span className="mosaic-contact-pill-hit-area" aria-hidden="true" />
          <span className="mosaic-contact-pill-content">
            <span className="mosaic-contact-pill-dark-label">Book a call</span>
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="bottom" align="center" sideOffset={12} collisionPadding={16} className="reaction-card-positioner">
            {/* The clip is the whole hint, the same deal the address makes. The
                month it used to spell out is still said twice -- in the pill's
                own label and in the description below -- so nothing is lost by
                letting the card be a picture. */}
            <Tooltip.Popup className="reaction-card" aria-hidden="true">
              <ReactionCard reaction={BOOKING_REACTION} />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      {/* The hint carries no words now, so the words live here instead: the same
          line, for anyone who is not looking at the picture. */}
      <span id={hintId} className="sr-only">
        {label} · 30 minutes in my calendar
      </span>
    </>
  )
}
