import { Tooltip } from "@base-ui/react/tooltip"
import { Check, Copy } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

import { ReactionCard, type Reaction } from "./ReactionCard"

// Patrick's drumroll while the offer stands, the Predator handshake once the
// address is on the clipboard.
const INVITATION: Reaction = {
  src: "/reactions/copy-email-before.webp",
  still: "/reactions/copy-email-before-still.webp",
  width: 480,
  height: 371,
}

const CONFIRMATION: Reaction = {
  src: "/reactions/copy-email-success.webp",
  still: "/reactions/copy-email-success-still.webp",
  width: 400,
  height: 262,
}

type ProfileEmailCopyProps = {
  email: string
  /** Which way the reaction card hangs off the address. */
  side?: "top" | "bottom"
}

export function ProfileEmailCopy({ email, side = "top" }: ProfileEmailCopyProps) {
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
          <span className="mosaic-profile-email-icon" aria-hidden="true">
            {isCopied ? <Check strokeWidth={2.25} /> : <Copy strokeWidth={2} />}
          </span>
          <span className="mosaic-profile-email-label">{email}</span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          {/* In the corner the card hangs down, because there is nothing above
              it but the edge of the page. */}
          <Tooltip.Positioner side={side} align="center" sideOffset={10} collisionPadding={16} className="reaction-card-positioner">
            {/* The reaction is the whole hint. It says "click to copy" and then
                "copied" in a register a line of grey type cannot, which is why
                the address is worth hovering at all; the words are still there
                for screen readers, in the description below and the live region
                that announces the copy. */}
            <Tooltip.Popup className="reaction-card" data-copied={isCopied ? "true" : undefined} aria-hidden="true">
              <ReactionCard
                key={isCopied ? "success" : "invitation"}
                reaction={isCopied ? CONFIRMATION : INVITATION}
              />
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
      <span id={hintId} className="sr-only">
        Click to copy
      </span>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {isCopied ? `${email} copied to clipboard` : ""}
      </span>
    </>
  )
}
