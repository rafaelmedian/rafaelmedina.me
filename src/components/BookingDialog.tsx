import { Dialog } from "@base-ui/react/dialog"
import { useEffect, useRef, useState, type RefObject } from "react"

import { isTuningCornerCurve } from "../lib/developmentTuning"

type BookingDialogProps = {
  /** Cal.com event type, e.g. `https://cal.com/rafaelmedian/30min`. */
  bookingUrl: string
  /** The availability line that opened this, echoed as the dialog's subtitle. */
  availabilityLabel: string
  returnFocus: RefObject<HTMLButtonElement | null>
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Long enough that a slow connection is not accused of being a blocked one,
// short enough that nobody sits in front of a blank rectangle wondering.
const STALL_MS = 6000

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
  // A frame a browser refuses to load never fires `onError` — it just sits
  // there. Nothing distinguishes "blocked" from "slow" except how long it has
  // been, so the fallback is a clock rather than an event.
  const [hasStalled, setHasStalled] = useState(false)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const tuningCornerCurve = isTuningCornerCurve()

  useEffect(() => {
    if (!open || isCalendarReady) return
    const timer = window.setTimeout(() => setHasStalled(true), STALL_MS)
    return () => window.clearTimeout(timer)
  }, [isCalendarReady, open])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}
      modal={!tuningCornerCurve} disablePointerDismissal={tuningCornerCurve}>
      <Dialog.Portal>
        <Dialog.Backdrop className="booking-backdrop" />
        <div
          className="booking-shell"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onOpenChange(false)
          }}
        >
          <Dialog.Popup className="booking-popup" ref={popupRef} initialFocus={popupRef} finalFocus={returnFocus}>
            {/* The dialog wears no chrome: the calendar it frames has its own
                title, its own month, and its own everything, and a header
                above it was a second set of the same. The title and subtitle
                stay as text a screen reader can reach, because a dialog still
                has to say what it is — they are just not drawn. Escape and a
                press outside close it. */}
            <Dialog.Title className="sr-only">Book a call</Dialog.Title>
            <Dialog.Description className="sr-only">
              {availabilityLabel} · 30 minutes, on Cal.com
            </Dialog.Description>

            <div className="booking-frame" data-ready={isCalendarReady ? "true" : undefined}>
              {isCalendarReady ? null : (
                <p className="booking-loading" role="status">
                  {hasStalled ? (
                    <>
                      {/* The header used to carry this link from the start. It
                          is the only way through a browser that blocks
                          third-party frames, so it still has to exist — it just
                          waits until there is something to escape from. */}
                      The calendar didn&rsquo;t load.{" "}
                      <a className="booking-external" href={bookingUrl} target="_blank" rel="noreferrer">
                        Open it on cal.com
                      </a>
                    </>
                  ) : (
                    "Loading calendar…"
                  )}
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
