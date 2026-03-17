import { useState } from "react"

type ContactActionRowProps = {
  email: string
  contactHref: string
  telegramHref: string
  xHref?: string
}

export function ContactActionRow({ email, contactHref, telegramHref, xHref }: ContactActionRowProps) {
  const [isCopySuccess, setIsCopySuccess] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setIsCopySuccess(true)
      window.setTimeout(() => setIsCopySuccess(false), 1800)
    } catch {
      window.location.href = contactHref
    }
  }

  return (
    <>
      <div className="mosaic-profile-actions" aria-label="Profile contact actions">
        <button type="button" className="mosaic-contact-pill mosaic-contact-pill-default" onClick={handleCopyEmail}>
          <span className="mosaic-contact-pill-default-label">{isCopySuccess ? "Copied!" : "Copy email"}</span>
        </button>
        <a href={telegramHref} target="_blank" rel="noreferrer" className="mosaic-contact-pill mosaic-contact-pill-telegram">
          <span className="mosaic-contact-pill-content mosaic-contact-pill-content-telegram">
            <img src="/icons/telegram.png" alt="" className="mosaic-contact-pill-icon mosaic-contact-pill-icon-telegram" />
            <span className="mosaic-contact-pill-telegram-label">Message</span>
          </span>
        </a>
        {xHref ? (
          <a href={xHref} target="_blank" rel="noreferrer" className="mosaic-contact-pill mosaic-contact-pill-dark">
            <span className="mosaic-contact-pill-content mosaic-contact-pill-content-x">
              <img src="/icons/x.svg" alt="" className="mosaic-contact-pill-icon mosaic-contact-pill-icon-x" />
              <span className="mosaic-contact-pill-dark-label">Follow</span>
            </span>
          </a>
        ) : (
          <span className="mosaic-contact-pill mosaic-contact-pill-dark" role="text">
            <span className="mosaic-contact-pill-content mosaic-contact-pill-content-x">
              <img src="/icons/x.svg" alt="" className="mosaic-contact-pill-icon mosaic-contact-pill-icon-x" />
              <span className="mosaic-contact-pill-dark-label">Follow</span>
            </span>
          </span>
        )}
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isCopySuccess ? "Email copied to clipboard" : ""}
      </span>
    </>
  )
}
