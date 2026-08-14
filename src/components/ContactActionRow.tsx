import { useEffect, useRef, useState } from "react"

type ContactActionRowProps = {
  email: string
  contactHref: string
  linkedinHref: string
  xHref?: string
}

export function ContactActionRow({ email, contactHref, linkedinHref, xHref }: ContactActionRowProps) {
  const [isCopySuccess, setIsCopySuccess] = useState(false)
  const resetTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimeoutRef.current), [])

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
        <button type="button" className="mosaic-contact-pill mosaic-contact-pill-default" onClick={handleCopyEmail}>
          <span className="mosaic-contact-pill-default-label">{isCopySuccess ? "Copied!" : "Copy email"}</span>
        </button>
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
        {xHref ? (
          <a href={xHref} target="_blank" rel="noreferrer" className="mosaic-contact-pill mosaic-contact-pill-dark">
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
        ) : null}
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isCopySuccess ? "Email copied to clipboard" : ""}
      </span>
    </>
  )
}
