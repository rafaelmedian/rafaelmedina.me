import { Tooltip } from "@base-ui/react/tooltip"
import { Check, Copy } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

type ProfileEmailCopyProps = {
  email: string
}

export function ProfileEmailCopy({ email }: ProfileEmailCopyProps) {
  const hintId = useId()
  const [isCopied, setIsCopied] = useState(false)
  const resetTimeoutRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimeoutRef.current), [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
    } catch {
      // No clipboard permission (or no clipboard at all): fall back to the
      // thing the address was for.
      window.location.href = `mailto:${email}`
      return
    }
    setIsCopied(true)
    // Restart the window on every copy so a second click always gets its own
    // full confirmation instead of inheriting the tail of the first one.
    window.clearTimeout(resetTimeoutRef.current)
    resetTimeoutRef.current = window.setTimeout(() => setIsCopied(false), 1600)
  }

  return (
    <>
      <Tooltip.Root>
        {/* The tooltip has to survive the press: it is the surface that reports
            the copy back, so closing on click would take the confirmation with
            it. */}
        <Tooltip.Trigger
          delay={160}
          closeDelay={120}
          closeOnClick={false}
          className="mosaic-profile-email"
          data-copied={isCopied ? "true" : undefined}
          aria-label={`Copy email address ${email}`}
          aria-describedby={hintId}
          onClick={handleCopy}
        >
          <span className="mosaic-profile-email-label">{email}</span>
          <span className="mosaic-profile-email-icon" aria-hidden="true">
            {isCopied ? <Check strokeWidth={2.25} /> : <Copy strokeWidth={2} />}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          {/* Above the line, not below it: the contact pills sit a row down, and a
              hint that covers them hides the next thing the visitor might click. */}
          <Tooltip.Positioner side="top" align="center" sideOffset={10} collisionPadding={16} className="booking-hint-positioner">
            <Tooltip.Popup className="booking-hint" role="tooltip" id={hintId}>
              {isCopied ? "Copied to clipboard" : "Click to copy"}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isCopied ? `${email} copied to clipboard` : ""}
      </span>
    </>
  )
}
