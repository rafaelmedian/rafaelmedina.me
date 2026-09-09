import type { HoverMedia, XProfilePreview } from "../data/portfolio"
import { useHoverCard } from "../lib/hoverCard"
import { AvailabilityBooking } from "./AvailabilityBooking"
import { LinkedInHoverCard } from "./LinkedInHoverCard"
import { XProfileHoverCard } from "./XProfileHoverCard"

type ContactActionRowProps = {
  availabilityLabel: string
  bookingUrl: string
  linkedinHref: string
  xHref?: string
  xProfile?: XProfilePreview
  linkedinMedia?: HoverMedia
}

export function ContactActionRow({
  availabilityLabel,
  bookingUrl,
  linkedinHref,
  xHref,
  xProfile,
  linkedinMedia,
}: ContactActionRowProps) {
  const xCard = useHoverCard()
  const linkedinCard = useHoverCard()

  return (
    <div className="mosaic-profile-actions" role="group" aria-label="Profile contact actions">
      {/* Booking leads the row: it is the one action here that asks for time
          rather than handing over an address, and the address itself now sits
          in the location line above. */}
      <AvailabilityBooking label={availabilityLabel} bookingUrl={bookingUrl} />
      <div className="mosaic-hover-anchor" {...linkedinCard.hoverProps}>
        <a
          href={linkedinHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Message on LinkedIn"
          className="mosaic-contact-pill mosaic-contact-pill-linkedin"
        >
          <span className="mosaic-contact-pill-content mosaic-contact-pill-content-linkedin">
            <img
              src="/icons/linkedin.svg"
              alt=""
              width={16}
              height={16}
              decoding="async"
              className="mosaic-contact-pill-icon mosaic-contact-pill-icon-linkedin"
            />
            <span className="mosaic-contact-pill-linkedin-label">Message</span>
          </span>
        </a>
        {linkedinMedia ? <LinkedInHoverCard media={linkedinMedia} isOpen={linkedinCard.isOpen} /> : null}
      </div>
      {xHref ? (
        // Focus anywhere in the pair keeps the card up, so a keyboard user can
        // tab from the pill into the card's own links.
        <div className="mosaic-hover-anchor" {...xCard.hoverProps}>
          <a
            href={xHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Follow on X"
            className="mosaic-contact-pill mosaic-contact-pill-follow"
          >
            <span className="mosaic-contact-pill-content mosaic-contact-pill-content-x">
              <img
                src="/icons/x.svg"
                alt=""
                width={16}
                height={16}
                decoding="async"
                className="mosaic-contact-pill-icon mosaic-contact-pill-icon-x"
              />
              <span className="mosaic-contact-pill-dark-label">Follow</span>
            </span>
          </a>
          {xProfile ? <XProfileHoverCard profile={xProfile} isOpen={xCard.isOpen} /> : null}
        </div>
      ) : null}
    </div>
  )
}
