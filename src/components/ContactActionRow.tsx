import { useEffect, useRef, useState } from "react"

import type { HoverMedia, XProfilePreview } from "../data/portfolio"
import { useHoverCard } from "../lib/hoverCard"
import { LinkedInHoverCard } from "./LinkedInHoverCard"
import { XProfileHoverCard } from "./XProfileHoverCard"

type ContactActionRowProps = {
  email: string
  contactHref: string
  linkedinHref: string
  xHref?: string
  xProfile?: XProfilePreview
  linkedinMedia?: HoverMedia
}

export function ContactActionRow({
  email,
  contactHref,
  linkedinHref,
  xHref,
  xProfile,
  linkedinMedia,
}: ContactActionRowProps) {
  const [isCopySuccess, setIsCopySuccess] = useState(false)
  const resetTimeoutRef = useRef<number | undefined>(undefined)
  const copyCard = useHoverCard()
  const xCard = useHoverCard()
  const linkedinCard = useHoverCard()

  useEffect(() => () => window.clearTimeout(resetTimeoutRef.current), [])

  const dismissCopyReaction = () => {
    window.clearTimeout(resetTimeoutRef.current)
    setIsCopySuccess(false)
    copyCard.close()
  }

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setIsCopySuccess(true)
      // Restart the window on every copy so rapid clicks don't let an earlier
      // timer clear the label while the latest "Copied!" is still showing.
      window.clearTimeout(resetTimeoutRef.current)
      resetTimeoutRef.current = window.setTimeout(() => setIsCopySuccess(false), 1800)
    } catch {
      window.location.href = contactHref
    }
  }

  return (
    <>
      <div className="mosaic-profile-actions" role="group" aria-label="Profile contact actions">
        <div className="mosaic-hover-anchor" {...copyCard.hoverProps}>
          {/* The tooltip is the one place near the action where the address is
              readable before committing to a copy. */}
          <button
            type="button"
            title={email}
            className="mosaic-contact-pill mosaic-contact-pill-default"
            onClick={handleCopyEmail}
          >
            <span className="mosaic-contact-pill-default-label">{isCopySuccess ? "Copied!" : "Copy email"}</span>
          </button>
          {isCopySuccess || copyCard.isOpen ? (
            <picture
              key={isCopySuccess ? "success" : "preview"}
              className={`mosaic-copy-reaction${isCopySuccess ? " is-success" : ""}`}
              aria-hidden="true"
            >
              <source
                media="(prefers-reduced-motion: reduce)"
                srcSet={
                  isCopySuccess
                    ? "/reactions/copy-email-success-still.webp"
                    : "/reactions/copy-email-before-still.webp"
                }
              />
              <img
                src={isCopySuccess ? "/reactions/copy-email-success.webp" : "/reactions/copy-email-before.webp"}
                alt=""
                width={isCopySuccess ? 400 : 480}
                height={isCopySuccess ? 262 : 371}
                decoding="async"
              />
            </picture>
          ) : null}
        </div>
        <div
          className="mosaic-hover-anchor"
          {...linkedinCard.hoverProps}
          onPointerEnter={(event) => {
            dismissCopyReaction()
            linkedinCard.hoverProps.onPointerEnter(event)
          }}
          onFocus={(event) => {
            dismissCopyReaction()
            linkedinCard.hoverProps.onFocus(event)
          }}
        >
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
          <div
            className="mosaic-hover-anchor"
            {...xCard.hoverProps}
            onPointerEnter={(event) => {
              dismissCopyReaction()
              xCard.hoverProps.onPointerEnter(event)
            }}
            onFocus={(event) => {
              dismissCopyReaction()
              xCard.hoverProps.onFocus(event)
            }}
          >
            <a
              href={xHref}
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on X"
              className="mosaic-contact-pill mosaic-contact-pill-dark"
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
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isCopySuccess ? `${email} copied to clipboard` : ""}
      </span>
    </>
  )
}
