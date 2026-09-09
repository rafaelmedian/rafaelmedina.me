import { Dialog } from "@base-ui/react/dialog"
import { X } from "lucide-react"
import { useRef, useState, type RefObject } from "react"

type BookingDialogProps = {
  /** Cal.com event type, e.g. `https://cal.com/rafaelmedian/30min`. */
  bookingUrl: string
  /** The availability line that opened this, echoed as the dialog's subtitle. */
  availabilityLabel: string
  returnFocus: RefObject<HTMLButtonElement | null>
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Cal.com renders its booking page without the marketing chrome when it is
// asked for the embed view, so the iframe carries only the calendar itself.
function toEmbedUrl(bookingUrl: string) {
  const url = new URL(bookingUrl)
  url.searchParams.set("embed", "true")
  url.searchParams.set("layout", "month_view")
  url.searchParams.set("theme", "light")
  return url.href
}

export function BookingDialog({ bookingUrl, availabilityLabel, open, onOpenChange, returnFocus }: BookingDialogProps) {
  // The calendar is a third-party page over the network. Until it paints, the
  // iframe is an empty white rectangle, so it is held transparent behind a
  // status line rather than shown blank inside a surface that has already
  // finished animating in.
  const [isCalendarReady, setIsCalendarReady] = useState(false)
  const popupRef = useRef<HTMLDivElement | null>(null)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="booking-backdrop" />
        <div
          className="booking-shell"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onOpenChange(false)
          }}
        >
          <Dialog.Popup className="booking-popup" ref={popupRef} initialFocus={popupRef} finalFocus={returnFocus}>
            <header className="booking-header">
              <div className="booking-heading">
                <Dialog.Title className="booking-title">Book a call</Dialog.Title>
                <Dialog.Description className="booking-subtitle">
                  {availabilityLabel} · 30 minutes, on Cal.com
                </Dialog.Description>
              </div>
              <div className="booking-actions">
                {/* The escape hatch, and the only way out of a browser that
                    blocks third-party frames — so it is visible from the start
                    rather than offered after the frame has already failed. */}
                <a className="booking-external" href={bookingUrl} target="_blank" rel="noreferrer">
                  Open on cal.com
                </a>
                <Dialog.Close className="preview-gallery-nav" aria-label="Close booking calendar">
                  <X aria-hidden="true" strokeWidth={2} className="preview-gallery-nav-icon" />
                </Dialog.Close>
              </div>
            </header>

            <div className="booking-frame" data-ready={isCalendarReady ? "true" : undefined}>
              {isCalendarReady ? null : (
                <p className="booking-loading" role="status">
                  Loading calendar…
                </p>
              )}
              <iframe
                className="booking-iframe"
                src={toEmbedUrl(bookingUrl)}
                title="Book a call on Cal.com"
                loading="lazy"
                onLoad={() => setIsCalendarReady(true)}
                // The calendar needs its own scrolling and its Google/Outlook
                // sign-in popups; nothing else.
                allow="clipboard-write; payment"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Dialog.Popup>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
