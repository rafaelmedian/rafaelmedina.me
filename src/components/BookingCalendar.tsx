import { useEffect, useState } from "react"

const STALL_MS = 6000
const SKELETON_DAYS = Array.from({ length: 35 })
const SKELETON_WEEKDAYS = Array.from({ length: 7 })
const SKELETON_TIMES = Array.from({ length: 7 })

function toBookingUrl(bookingUrl: string, email: string) {
  const url = new URL(bookingUrl)
  if (email) url.searchParams.set("email", email)
  return url.href
}

function toEmbedUrl(bookingUrl: string, email: string) {
  const url = new URL(toBookingUrl(bookingUrl, email))
  url.searchParams.set("embed", "true")
  url.searchParams.set("layout", "month_view")
  url.searchParams.set("theme", "light")
  return url.href
}

export function BookingCalendar({ bookingUrl, email, active }: { bookingUrl: string; email: string; active: boolean }) {
  const [isCalendarReady, setIsCalendarReady] = useState(false)
  const [hasStalled, setHasStalled] = useState(false)
  useEffect(() => {
    if (!active || isCalendarReady) return
    const timer = window.setTimeout(() => setHasStalled(true), STALL_MS)
    return () => window.clearTimeout(timer)
  }, [active, isCalendarReady])
  return (
    <div
      className={`booking-frame t-skel${isCalendarReady ? " is-revealed" : ""}`}
      data-ready={isCalendarReady ? "true" : undefined}
      data-stalled={hasStalled ? "true" : undefined}
    >
      <div className="booking-skeleton t-skel-skeleton is-pulsing" aria-hidden="true">
        <div className="booking-skeleton-panel">
          <div className="booking-skeleton-profile">
            <span className="booking-skeleton-avatar" />
            <span className="booking-skeleton-line booking-skeleton-line-name" />
            <span className="booking-skeleton-line booking-skeleton-line-title" />
            <span className="booking-skeleton-line booking-skeleton-line-detail" />
            <span className="booking-skeleton-line booking-skeleton-line-detail" />
            <span className="booking-skeleton-line booking-skeleton-line-zone" />
          </div>
          <div className="booking-skeleton-calendar">
            <div className="booking-skeleton-month">
              <span className="booking-skeleton-line booking-skeleton-line-month" />
              <span className="booking-skeleton-arrows" />
            </div>
            <div className="booking-skeleton-weekdays">
              {SKELETON_WEEKDAYS.map((_, index) => <span key={index} />)}
            </div>
            <div className="booking-skeleton-days">
              {SKELETON_DAYS.map((_, index) => <span className="booking-skeleton-day" key={index} />)}
            </div>
          </div>
          <div className="booking-skeleton-times">
            <span className="booking-skeleton-line booking-skeleton-line-times" />
            {SKELETON_TIMES.map((_, index) => <span className="booking-skeleton-time" key={index} />)}
          </div>
        </div>
      </div>
      {isCalendarReady ? null : (
        <p className={hasStalled ? "booking-loading" : "booking-loading sr-only"} role="status">
          {hasStalled ? (
            <>
              {/* The header used to carry this link from the start. It
                  is the only way through a browser that blocks
                  third-party frames, so it still has to exist — it just
                  waits until there is something to escape from. */}
              The calendar didn&rsquo;t load.{" "}
              <a className="booking-external" href={toBookingUrl(bookingUrl, email)} target="_blank" rel="noreferrer">
                Open it on cal.com
              </a>
            </>
          ) : (
            "Loading calendar…"
          )}
        </p>
      )}
      <iframe
        className="booking-iframe t-skel-content"
        src={toEmbedUrl(bookingUrl, email)}
        title="Book a call on Cal.com"
        loading="lazy"
        onLoad={() => setIsCalendarReady(true)}
        // The calendar needs its own scrolling and its Google/Outlook
        // sign-in popups; nothing else.
        allow="clipboard-write; payment"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
